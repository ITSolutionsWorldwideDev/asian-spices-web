// app/api/account/recipes/[id]route.ts

import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";

import { pool } from "@/core/db";

// Replace with real auth later
async function getCurrentCustomer() {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return session?.user?.id;
}

/*
 * GET SINGLE RECIPE
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const customerId = await getCurrentCustomer();
    const { id } = await req.json();

    const { rows } = await pool.query(
      `
      SELECT
        r.id,
        r.title,
        r.slug,
        r.short_description,
        r.origin,
        r.preparation_time,
        r.cooking_time,
        r.servings,
        r.difficulty,
        r.content,
        r.thumbnail_url,
        r.youtube_url,
        r.youtube_video_id,
        r.status,
        r.created_at,

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

      LEFT JOIN recipe_recipe_tags rrt
        ON rrt.recipe_id = r.id

      LEFT JOIN recipe_tags rt
        ON rt.id = rrt.tag_id

      WHERE
        r.id = $1
        AND r.customer_id = $2

      GROUP BY r.id
      LIMIT 1
      `,
      [id, customerId],
    );

    const recipe = rows[0];

    if (!recipe) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipe not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      item: recipe,
    });
  } catch (error: any) {
    console.error("ACCOUNT RECIPE GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch recipe",
      },
      { status: 500 },
    );
  }
}

/*
 * UPDATE RECIPE
 */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const customerId = await getCurrentCustomer();

    const { id } = await params;
    const body = await req.json();

    const {
      title,
      slug,
      short_description,
      origin,
      preparation_time,
      cooking_time,
      servings,
      difficulty,
      thumbnail_url,
      youtube_url,
      content,
      ingredients = [],
      instructions = [],
      youtube_consent,
    } = body;

    if (youtube_url && !youtube_consent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please accept the YouTube video usage terms to add a video URL",
        },
        { status: 400 },
      );
    }

    const result = await pool.query(
      `
      UPDATE recipes
      SET
        title = $1,
        slug = $2,
        short_description = $3,
        origin = $4,
        preparation_time = $5,
        cooking_time = $6,
        servings = $7,
        difficulty = $8,
        thumbnail_url = $9,
        youtube_url = $10,
        content = $11,
        updated_at = NOW()
      WHERE id = $12
      AND customer_id = $13
      RETURNING id
      `,
      [
        title,
        slug,
        short_description,
        origin || null,
        preparation_time === "" || preparation_time == null ? null : Number(preparation_time),
        cooking_time === "" || cooking_time == null ? null : Number(cooking_time),
        servings === "" || servings == null ? null : Number(servings),
        difficulty
          ? String(difficulty).trim().toLowerCase()
          : null,
        thumbnail_url,
        youtube_url,
        content,
        id,
        customerId,
      ],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipe not found or unauthorized",
        },
        { status: 404 },
      );
    }

    /*
     * REPLACE INGREDIENTS
     */
    await pool.query(
      `DELETE FROM recipe_ingredients WHERE recipe_id = $1`,
      [id],
    );

    if (Array.isArray(ingredients)) {
      for (const item of ingredients) {
        const name = String(item?.ingredient_name || "").trim();
        if (!name) continue;

        const quantityRaw = item?.quantity;
        const quantity =
          quantityRaw === "" || quantityRaw == null
            ? null
            : Number(quantityRaw);

        await pool.query(
          `
          INSERT INTO recipe_ingredients (
            ingredients_id,
            recipe_id,
            ingredient_name,
            quantity,
            unit
          )
          VALUES (gen_random_uuid(), $1, $2, $3, $4)
          `,
          [
            id,
            name,
            Number.isFinite(quantity) ? quantity : null,
            item?.unit ? String(item.unit).trim() : null,
          ],
        );
      }
    }

    /*
     * REPLACE INSTRUCTIONS
     */
    await pool.query(
      `DELETE FROM recipe_instructions WHERE recipe_id = $1`,
      [id],
    );

    if (Array.isArray(instructions)) {
      let stepNumber = 0;
      for (const item of instructions) {
        const title = String(item?.step_title || "").trim();
        const description = String(item?.step_description || "").trim();
        if (!title && !description) continue;

        stepNumber += 1;
        const durationRaw = item?.duration_minutes;
        const duration =
          durationRaw === "" || durationRaw == null
            ? null
            : Number(durationRaw);

        await pool.query(
          `
          INSERT INTO recipe_instructions (
            instruction_id,
            recipe_id,
            step_number,
            step_title,
            step_description,
            duration_minutes
          )
          VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
          `,
          [
            id,
            Number(item?.step_number) || stepNumber,
            title || null,
            description || null,
            Number.isFinite(duration) ? duration : null,
          ],
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Recipe updated successfully",
    });
  } catch (error: any) {
    console.error("ACCOUNT RECIPE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update recipe",
      },
      { status: 500 },
    );
  }
}

/*
 * DELETE RECIPE
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const customerId = await getCurrentCustomer();

    const { id } = await req.json();

    const result = await pool.query(
      `
      DELETE FROM recipes
      WHERE id = $1
      AND customer_id = $2
      `,
      [id, customerId],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipe not found or unauthorized",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error: any) {
    console.error("ACCOUNT RECIPE DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete recipe",
      },
      { status: 500 },
    );
  }
}
