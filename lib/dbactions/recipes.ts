// apps/web/lib/dbactions/recipes.ts

import { pool, runQuery } from "@/core/db";

type GetRecipesParams = {
  page?: string;
  search?: string;
  category?: string;
  tag?: string;
};

export type RecipeTag = {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
};

export type RecipeIngredient = {
  ingredients_id?: string;
  ingredient_name: string;
  quantity?: number | string | null;
  unit?: string | null;
};

export type RecipeInstruction = {
  instruction_id?: string;
  step_number?: number | null;
  step_title?: string | null;
  step_description?: string | null;
  duration_minutes?: number | null;
};

export type RecipeDetail = {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  origin?: string | null;
  content?: string | null;
  thumbnail_url?: string | null;
  youtube_url?: string | null;
  youtube_video_id?: string | null;
  preparation_time?: number | null;
  cooking_time?: number | null;
  servings?: number | null;
  difficulty?: string | null;
  is_featured?: boolean | null;
  total_views?: number | null;
  created_at?: string | Date | null;
  category_id?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  ingredients?: RecipeIngredient[];
  instructions?: RecipeInstruction[];
  tags?: RecipeTag[];
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
      r.preparation_time,
      r.cooking_time,
      r.created_at,

      c.name AS category_name,
      c.slug AS category_slug,

      COALESCE(
        NULLIF(
          COALESCE(r.preparation_time, 0) + COALESCE(r.cooking_time, 0),
          0
        ),
        (
          SELECT SUM(ri.duration_minutes)::int
          FROM recipe_instructions ri
          WHERE ri.recipe_id = r.id
            AND ri.duration_minutes IS NOT NULL
        )
      ) AS total_minutes,

      COALESCE(
        (
          SELECT ROUND(AVG(spr.rating)::numeric, 1)
          FROM store_product_reviews spr
          WHERE spr.recipe_id = r.id
            AND spr.rating IS NOT NULL
            AND (
              spr.status IS NULL
              OR spr.status IN ('approved', 'pending', 'published')
            )
        ),
        0
      )::float AS average_rating,

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

export async function getRecipeBySlug(slug: string): Promise<RecipeDetail | null> {
  const { rows } = await runQuery<RecipeDetail>(
    `
    SELECT
      r.id,
      r.title,
      r.slug,
      r.short_description,
      r.origin,
      r.content,
      r.thumbnail_url,
      r.youtube_url,
      r.youtube_video_id,
      r.preparation_time,
      r.cooking_time,
      r.servings,
      r.difficulty,
      r.is_featured,
      r.total_views,
      r.created_at,
      r.category_id,

      r.seo_title,
      r.seo_description,
      r.seo_keywords,

      c.name AS category_name,
      c.slug AS category_slug,

      COALESCE(
        (
          SELECT JSON_AGG(
            JSONB_BUILD_OBJECT(
              'ingredients_id', ri.ingredients_id,
              'ingredient_name', ri.ingredient_name,
              'quantity', ri.quantity,
              'unit', ri.unit
            )
            ORDER BY ri.created_at ASC, ri.ingredient_name ASC
          )
          FROM recipe_ingredients ri
          WHERE ri.recipe_id = r.id
        ),
        '[]'
      ) AS ingredients,

      COALESCE(
        (
          SELECT JSON_AGG(
            JSONB_BUILD_OBJECT(
              'instruction_id', rin.instruction_id,
              'step_number', rin.step_number,
              'step_title', rin.step_title,
              'step_description', rin.step_description,
              'duration_minutes', rin.duration_minutes
            )
            ORDER BY rin.step_number ASC, rin.created_at ASC
          )
          FROM recipe_instructions rin
          WHERE rin.recipe_id = r.id
        ),
        '[]'
      ) AS instructions,

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

export async function getLatestRecipeCategories(limit = 4) {
  const { rows } = await runQuery(
    `
    SELECT
      c.id,
      c.name,
      c.slug,
      COUNT(DISTINCT r.id)::int AS recipe_count,
      MAX(r.created_at) AS latest_recipe_at
    FROM recipe_categories c
    INNER JOIN recipes r
      ON r.category_id = c.id
      AND r.status = 'published'
    GROUP BY c.id
    ORDER BY latest_recipe_at DESC
    LIMIT $1
    `,
    [limit],
  );

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
      r.origin,
      r.preparation_time,
      r.cooking_time,
      r.servings,
      r.difficulty,
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
        (
          SELECT JSON_AGG(
            JSONB_BUILD_OBJECT(
              'ingredients_id', ri.ingredients_id,
              'ingredient_name', ri.ingredient_name,
              'quantity', ri.quantity,
              'unit', ri.unit
            )
            ORDER BY ri.created_at ASC, ri.ingredient_name ASC
          )
          FROM recipe_ingredients ri
          WHERE ri.recipe_id = r.id
        ),
        '[]'
      ) AS ingredients,

      COALESCE(
        (
          SELECT JSON_AGG(
            JSONB_BUILD_OBJECT(
              'instruction_id', rin.instruction_id,
              'step_number', rin.step_number,
              'step_title', rin.step_title,
              'step_description', rin.step_description,
              'duration_minutes', rin.duration_minutes
            )
            ORDER BY rin.step_number ASC, rin.created_at ASC
          )
          FROM recipe_instructions rin
          WHERE rin.recipe_id = r.id
        ),
        '[]'
      ) AS instructions,

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

export async function getHomeRecipes(limit = 8) {
  const { rows } = await runQuery(
    `
    SELECT
      r.id,
      r.title,
      r.slug,
      r.short_description,
      r.thumbnail_url
    FROM recipes r
    WHERE r.status = 'published'
    ORDER BY r.is_featured DESC, r.created_at DESC
    LIMIT $1
    `,
    [limit],
  );

  return rows;
}