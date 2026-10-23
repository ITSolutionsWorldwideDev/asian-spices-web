import Image from "next/image";
import type { RecipeNutrient } from "@/lib/dbactions/recipeNutrition";

type RecipeNutritionSectionProps = {
  nutrients: RecipeNutrient[];
  thumbnailUrl?: string | null;
  recipeTitle?: string;
};

function formatValue(nutrient: RecipeNutrient) {
  const value = Number(nutrient.value);
  if (!Number.isFinite(value)) return "—";

  const unit = nutrient.unit?.trim() || "";
  const formatted =
    Number.isInteger(value) || unit === "kcal"
      ? String(Math.round(value))
      : String(value);

  if (unit === "kcal") return `${formatted} kcal`;
  if (unit) return `${formatted}${unit}`;
  return formatted;
}

function formatPercent(nutrient: RecipeNutrient) {
  const pct = Number(nutrient.daily_value_percent);
  if (!Number.isFinite(pct)) return null;
  return `${Math.round(pct)}%`;
}

function NutrientRow({ nutrient }: { nutrient: RecipeNutrient }) {
  const percent = formatPercent(nutrient);

  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 py-3 last:border-b-0">
      <span className="text-sm text-gray-600">{nutrient.nutrient_name}</span>
      <span className="shrink-0 text-right text-sm">
        <span className="font-bold text-gray-900">{formatValue(nutrient)}</span>
        {percent ? (
          <span className="ml-2 text-xs text-gray-400">{percent}</span>
        ) : null}
      </span>
    </div>
  );
}

function splitIntoColumns(items: RecipeNutrient[], columns = 3) {
  const perColumn = Math.ceil(items.length / columns);
  return Array.from({ length: columns }, (_, i) =>
    items.slice(i * perColumn, (i + 1) * perColumn),
  ).filter((col) => col.length > 0);
}

export default function RecipeNutritionSection({
  nutrients,
  thumbnailUrl,
  recipeTitle,
}: RecipeNutritionSectionProps) {
  if (!nutrients.length) return null;

  const columns = splitIntoColumns(nutrients, 3);

  return (
    <section className="bg-[#faf7f2]">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
          <div className="relative z-10 p-6 sm:p-8 lg:pr-[38%]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Nutrition Facts
              </h2>
              <p className="mt-1 text-sm text-gray-400">Per Serving</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {columns.map((column, index) => (
                <div key={index}>
                  {column.map((nutrient) => (
                    <NutrientRow key={nutrient.nutrition_id} nutrient={nutrient} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {thumbnailUrl ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] lg:block">
              <Image
                src={thumbnailUrl}
                alt={
                  recipeTitle
                    ? `${recipeTitle} dish`
                    : "Recipe dish"
                }
                fill
                sizes="42vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
