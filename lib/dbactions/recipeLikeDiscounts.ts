import { runQuery } from "@/core/db";
import { getRecipeFavoriteCount, isRecipeFavorited } from "@/lib/dbactions/recipeStats";

export type RecipeLikeDiscount = {
  id: string;
  recipe_id: string;
  recipe_title?: string;
  user_id: string | null;
  discount_type: string;
  discount_value: number;
  likes_count: number;
  favorite_count?: number;
};

export function formatRecipeLikeDiscountLabel(discount: RecipeLikeDiscount) {
  const type = (discount.discount_type || "").toUpperCase();
  const value = Number(discount.discount_value);

  if (type === "PERCENT" || type === "PERCENTAGE") {
    return `${value}% off`;
  }

  return `€${value.toFixed(2)} off`;
}

export async function getRecipeLikeDiscountForUser(
  recipeId: string,
  userId: string,
): Promise<RecipeLikeDiscount | null> {
  const favorited = await isRecipeFavorited(recipeId, userId);

  if (!favorited) {
    return null;
  }

  const favoriteCount = await getRecipeFavoriteCount(recipeId);

  const { rows } = await runQuery(
    `
    SELECT
      id,
      recipe_id,
      user_id,
      discount_type,
      discount_value,
      likes_count
    FROM recipe_like_discounts
    WHERE recipe_id = $1
      AND (user_id = $2 OR user_id IS NULL)
      AND likes_count <= $3
    ORDER BY
      CASE WHEN user_id = $2 THEN 0 ELSE 1 END,
      created_at DESC
    LIMIT 1
    `,
    [recipeId, userId, favoriteCount],
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id as string,
    recipe_id: row.recipe_id as string,
    user_id: (row.user_id as string) || null,
    discount_type: row.discount_type as string,
    discount_value: Number(row.discount_value),
    likes_count: Number(row.likes_count),
    favorite_count: favoriteCount,
  };
}

export async function getEligibleRecipeLikeDiscountsForUser(
  userId: string,
): Promise<RecipeLikeDiscount[]> {
  const { rows } = await runQuery(
    `
    SELECT
      d.id,
      d.recipe_id,
      d.user_id,
      d.discount_type,
      d.discount_value,
      d.likes_count,
      r.title AS recipe_title,
      (
        SELECT COUNT(*)::int
        FROM recipe_favorites rf
        WHERE rf.recipe_id = d.recipe_id
      ) AS favorite_count
    FROM recipe_like_discounts d
    JOIN recipes r ON r.id = d.recipe_id
    WHERE d.user_id = $1
    ORDER BY d.created_at DESC
    `,
    [userId],
  );

  return rows.map((row) => ({
    id: row.id as string,
    recipe_id: row.recipe_id as string,
    recipe_title: (row.recipe_title as string) || "",
    user_id: (row.user_id as string) || null,
    discount_type: row.discount_type as string,
    discount_value: Number(row.discount_value),
    likes_count: Number(row.likes_count),
    favorite_count: Number(row.favorite_count || 0),
  }));
}
