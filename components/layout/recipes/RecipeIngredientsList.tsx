"use client";

import { useState } from "react";

export type RecipeIngredient = {
  ingredients_id?: string;
  ingredient_name: string;
  quantity?: number | string | null;
  unit?: string | null;
};

type RecipeIngredientsListProps = {
  ingredients?: RecipeIngredient[] | null;
};

function formatAmount(quantity?: number | string | null, unit?: string | null) {
  const qty =
    quantity === null || quantity === undefined || quantity === ""
      ? ""
      : String(quantity);
  const u = unit?.trim() || "";
  if (!qty && !u) return "";
  return [qty, u].filter(Boolean).join(" ");
}

export default function RecipeIngredientsList({
  ingredients = [],
}: RecipeIngredientsListProps) {
  const items = Array.isArray(ingredients) ? ingredients : [];
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  if (!items.length) return null;

  return (
    <section className="mt-8">
      <h3 className="mb-4 text-xl font-bold text-gray-900">Ingredients</h3>
      <ul className="space-y-3">
        {items.map((item, index) => {
          const amount = formatAmount(item.quantity, item.unit);
          const isChecked = Boolean(checked[index]);

          return (
            <li
              key={item.ingredients_id || `${item.ingredient_name}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() =>
                  setChecked((prev) => ({
                    ...prev,
                    [index]: !prev[index],
                  }))
                }
                className="h-4 w-4 shrink-0 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                aria-label={`Mark ${item.ingredient_name} as ready`}
              />
              <span
                className={`min-w-0 flex-1 text-sm text-gray-800 sm:text-[15px] ${
                  isChecked ? "line-through text-gray-400" : ""
                }`}
              >
                {item.ingredient_name}
              </span>
              {amount ? (
                <span className="shrink-0 text-sm font-semibold text-[#e8924a]">
                  {amount}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
