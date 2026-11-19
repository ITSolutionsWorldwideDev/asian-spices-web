// app/api/recipes/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";

import { pool } from "@/core/db";
import { redis } from "@/lib/redis/client";
import { REDIS_KEYS, REDIS_TTL } from "@/lib/redis/keys";

const PAKISTANI_BROWN_RICE_SLUG = "pakistani-brown-rice-easy-tarka-chaval";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (slug === PAKISTANI_BROWN_RICE_SLUG) {
      try {
        const cached = await redis.get(
          REDIS_KEYS.PAKISTANI_BROWN_RICE_EASY_TARKA_CHAVAL,
        );
        if (cached !== null && cached !== undefined) {
          return NextResponse.json(cached);
        }
      } catch (error) {
        console.error(
          "Redis get pakistani-brown-rice failed, falling back to DB:",
          error,
        );
      }
    }

    const { rows } = await pool.query(
      `
      SELECT
        r.*,

        rc.id AS category_id,
        rc.name AS category_name,
        rc.slug AS category_slug,

        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', rt.id,
              'name', rt.name,
              'slug', rt.slug,
              'color', rt.color
            )
          ) FILTER (WHERE rt.id IS NOT NULL),
          '[]'
        ) AS tags

      FROM recipes r

      LEFT JOIN recipe_categories rc
        ON rc.id = r.category_id

      LEFT JOIN recipe_recipe_tags rrt
        ON rrt.recipe_id = r.id

      LEFT JOIN recipe_tags rt
        ON rt.id = rrt.tag_id

      WHERE
        r.slug = $1
        AND r.status = 'published'

      GROUP BY
        r.id,
        rc.id

      LIMIT 1
      `,
      [slug],
    );

    const recipe = rows[0];

    if (!recipe) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipe not found",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * RELATED RECIPES
     */
    const related = await pool.query(
      `
      SELECT
        id,
        title,
        slug,
        thumbnail_url

      FROM recipes

      WHERE
        category_id = $1
        AND id != $2
        AND status = 'published'

      ORDER BY created_at DESC

      LIMIT 4
      `,
      [recipe.category_id, recipe.id],
    );

    const payload = {
      success: true,
      item: {
        ...recipe,
        relatedRecipes: related.rows,
      },
    };

    if (slug === PAKISTANI_BROWN_RICE_SLUG) {
      try {
        await redis.set(
          REDIS_KEYS.PAKISTANI_BROWN_RICE_EASY_TARKA_CHAVAL,
          payload,
          { ex: REDIS_TTL.PAKISTANI_BROWN_RICE_EASY_TARKA_CHAVAL },
        );
      } catch (error) {
        console.error("Redis set pakistani-brown-rice failed:", error);
      }
    }

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error("GET RECIPE DETAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch recipe",
      },
      {
        status: 500,
      },
    );
  }
}
