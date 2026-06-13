// apps/web/lib/dbactions/recipes.ts

import { pool, runQuery } from "@/core/db";

type GetRecipesParams = {
  page?: string;
  search?: string;
  category?: string;
  tag?: string;
};

const PAGE_SIZE = 12;

export async function getRecipes(params: GetRecipesParams) {
  const page = Number(params.page || 1);

  const offset = (page - 1) * PAGE_SIZE;

  const values: any[] = [];

  const where: string[] = [
    `r.status = 'published'`,
  ];

  /*
   * SEARCH
   */
  if (params.search) {
    values.push(`%${params.search}%`);

    where.push(`
      (
        r.title ILIKE $${values.length}
        OR r.short_description ILIKE $${values.length}
      )
    `);
  }

  /*
   * CATEGORY
   */
  if (params.category) {
    values.push(params.category);

    where.push(`
      c.slug = $${values.length}
    `);
  }

  /*
   * TAG
   */
  if (params.tag) {
    values.push(params.tag);

    where.push(`
      EXISTS (
        SELECT 1
        FROM recipe_recipe_tags rrt2
        INNER JOIN recipe_tags rt2
          ON rt2.id = rrt2.tag_id
        WHERE rrt2.recipe_id = r.id
        AND rt2.slug = $${values.length}
      )
    `);
  }

  const whereClause = where.length
    ? `WHERE ${where.join(" AND ")}`
    : "";

  /*
   * TOTAL
   */
  const totalRes = await runQuery(
    `
    SELECT COUNT(DISTINCT r.id)::int AS total
    FROM recipes r
    LEFT JOIN recipe_categories c
      ON c.id = r.category_id
    ${whereClause}
    `,
    values,
  );

  const total = totalRes.rows[0]?.total || 0;

  /*
   * RECIPES
   */
  values.push(PAGE_SIZE);

  values.push(offset);

  const { rows } = await runQuery(
    `
    SELECT
      r.id,
      r.title,
      r.slug,
      r.short_description,
      r.thumbnail_url,
      r.youtube_url,
      r.created_at,

      c.name AS category_name,
      c.slug AS category_slug,

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

    LEFT JOIN recipe_categories c
      ON c.id = r.category_id

    LEFT JOIN recipe_recipe_tags rrt
      ON rrt.recipe_id = r.id

    LEFT JOIN recipe_tags rt
      ON rt.id = rrt.tag_id

    ${whereClause}

    GROUP BY r.id, c.id

    ORDER BY r.created_at DESC

    LIMIT $${values.length - 1}
    OFFSET $${values.length}
    `,
    values,
  );

  return {
    items: rows,

    pagination: {
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  };
}

export async function getRecipeBySlug(slug: string) {
  const { rows } = await runQuery(
    `
    SELECT
      r.id,
      r.title,
      r.slug,
      r.short_description,
      r.content,
      r.thumbnail_url,
      r.youtube_url,
      r.youtube_video_id,
      r.created_at,

      r.seo_title,
      r.seo_description,
      r.seo_keywords,

      c.name AS category_name,
      c.slug AS category_slug,

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

    LEFT JOIN recipe_categories c
      ON c.id = r.category_id

    LEFT JOIN recipe_recipe_tags rrt
      ON rrt.recipe_id = r.id

    LEFT JOIN recipe_tags rt
      ON rt.id = rrt.tag_id

    WHERE
      r.slug = $1
      AND r.status = 'published'

    GROUP BY r.id, c.id

    LIMIT 1
    `,
    [slug],
  );

  return rows[0] || null;
}

export async function getRecipeCategories() {
  const { rows } = await runQuery(`
    SELECT
      id,
      name,
      slug
    FROM recipe_categories
    ORDER BY name ASC
  `);

  return rows;
}

export async function getRecipeTags() {
  const { rows } = await runQuery(`
    SELECT
      id,
      name,
      slug,
      color
    FROM recipe_tags
    WHERE is_active = true
    ORDER BY name ASC
  `);

  return rows;
}

export async function getRecipeById(id: string) {
  const { rows } = await runQuery(
    `
    SELECT
      r.id,
      r.title,
      r.slug,
      r.short_description,
      r.content,
      r.thumbnail_url,
      r.youtube_url,
      r.youtube_video_id,
      r.created_at,

      r.seo_title,
      r.seo_description,
      r.seo_keywords,

      r.status,

      r.category_id,

      c.name AS category_name,
      c.slug AS category_slug,

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

    LEFT JOIN recipe_categories c
      ON c.id = r.category_id

    LEFT JOIN recipe_recipe_tags rrt
      ON rrt.recipe_id = r.id

    LEFT JOIN recipe_tags rt
      ON rt.id = rrt.tag_id

    WHERE r.id = $1

    GROUP BY r.id, c.id

    LIMIT 1
    `,
    [id],
  );

  return rows[0] || null;
}