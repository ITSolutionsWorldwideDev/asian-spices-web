import { runQuery } from "@/core/db";

export type RelatedRecipe = {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  thumbnail_url?: string | null;
  preparation_time?: number | null;
  cooking_time?: number | null;
  difficulty?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  total_minutes?: number | null;
  average_rating?: number | null;
};

const RELATED_RECIPE_SELECT = `
  r.id,
  r.title,
  r.slug,
  r.short_description,
  r.thumbnail_url,
  r.preparation_time,
  r.cooking_time,
  r.difficulty,
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
  )::float AS average_rating
`;

export async function getRelatedRecipes(
  recipeId: string,
  categoryId?: string | null,
  limit = 12,
): Promise<RelatedRecipe[]> {
  if (categoryId) {
    const { rows } = await runQuery<RelatedRecipe>(
      `
      SELECT
        ${RELATED_RECIPE_SELECT}
      FROM recipes r
      LEFT JOIN recipe_categories c
        ON c.id = r.category_id
      WHERE
        r.status = 'published'
        AND r.category_id = $1
        AND r.id != $2
      ORDER BY r.is_featured DESC, r.created_at DESC
      LIMIT $3
      `,
      [categoryId, recipeId, limit],
    );

    if (rows.length > 0) {
      return rows;
    }
  }

  const { rows } = await runQuery<RelatedRecipe>(
    `
    SELECT
      ${RELATED_RECIPE_SELECT}
    FROM recipes r
    LEFT JOIN recipe_categories c
      ON c.id = r.category_id
    WHERE
      r.status = 'published'
      AND r.id != $1
    ORDER BY r.is_featured DESC, r.created_at DESC
    LIMIT $2
    `,
    [recipeId, limit],
  );

  return rows;
}
