import { runQuery } from "@/core/db";

export type RecipeNutrient = {
  nutrition_id: string;
  recipe_id: string;
  nutrient_name: string;
  value: number | string | null;
  unit: string | null;
  daily_value_percent: number | string | null;
};

const NUTRIENT_ORDER = [
  "Calories",
  "Total Fat",
  "Saturated Fat",
  "Cholesterol",
  "Sodium",
  "Total Carbohydrate",
  "Carbohydrates",
  "Dietary Fiber",
  "Fiber",
  "Total Sugars",
  "Sugar",
  "Protein",
  "Vitamin A",
  "Vitamin C",
  "Calcium",
  "Iron",
];

function sortNutrients(items: RecipeNutrient[]) {
  return [...items].sort((a, b) => {
    const ai = NUTRIENT_ORDER.findIndex(
      (name) => name.toLowerCase() === a.nutrient_name.toLowerCase(),
    );
    const bi = NUTRIENT_ORDER.findIndex(
      (name) => name.toLowerCase() === b.nutrient_name.toLowerCase(),
    );
    const aRank = ai === -1 ? 999 : ai;
    const bRank = bi === -1 ? 999 : bi;
    return aRank - bRank || a.nutrient_name.localeCompare(b.nutrient_name);
  });
}

export async function getRecipeNutrition(
  recipeId: string,
): Promise<RecipeNutrient[]> {
  const { rows } = await runQuery<RecipeNutrient>(
    `
    SELECT
      nutrition_id,
      recipe_id,
      nutrient_name,
      value,
      unit,
      daily_value_percent
    FROM recipe_nutrition
    WHERE recipe_id = $1
    ORDER BY nutrient_name ASC
    `,
    [recipeId],
  );

  return sortNutrients(rows);
}
