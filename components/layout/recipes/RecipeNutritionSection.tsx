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
    <div className="flex items-center justify-between gap-2 border-b border-gray-100 py-2.5 last:border-b-0">
      <span className="text-xs sm:text-sm text-gray-600 truncate pr-1" title={nutrient.nutrient_name}>
        {nutrient.nutrient_name}
      </span>
      <div className="shrink-0 flex items-center gap-2 text-xs sm:text-sm">
        <span className="font-bold text-gray-900">{formatValue(nutrient)}</span>
        <span className="w-10 text-right font-medium text-gray-400">
          {percent ?? "—"}
        </span>
      </div>
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
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Nutrition Facts
                </h2>
                <p className="mt-1 text-sm text-gray-500">Per Serving</p>
              </div>
              <div className="rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                % DV = % Daily Value*
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {columns.map((column, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <span>Nutrient</span>
                    <div className="flex items-center gap-2">
                      <span>Amount</span>
                      <span className="w-10 text-right" title="Percent Daily Value">
                        % DV*
                      </span>
                    </div>
                  </div>
                  {column.map((nutrient) => (
                    <NutrientRow key={nutrient.nutrition_id} nutrient={nutrient} />
                  ))}
                </div>
              ))}
            </div>

            <p className="mt-6 text-[11px] sm:text-xs text-gray-400 leading-relaxed">
              * The % Daily Value (DV) tells you how much a nutrient in a serving contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
            </p>
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
