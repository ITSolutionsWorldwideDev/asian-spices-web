"use client";

import { useState } from "react";
import { Clock3, ShoppingCart } from "lucide-react";
import type { RecipeIngredient } from "./RecipeIngredientsList";
import type { RecipeInstruction } from "./RecipeInstructionsList";

type RecipeIngredientsInstructionsSectionProps = {
  ingredients?: RecipeIngredient[] | null;
  instructions?: RecipeInstruction[] | null;
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

function formatStepDuration(minutes?: number | null) {
  const value = Number(minutes);
  if (!Number.isFinite(value) || value <= 0) return null;
  if (value >= 60) {
    const h = Math.floor(value / 60);
    const m = value % 60;
    return m ? `${h} hour${h === 1 ? "" : "s"}` : `${h} hour${h === 1 ? "" : "s"}`;
  }
  return `${value} min`;
}

export default function RecipeIngredientsInstructionsSection({
  ingredients = [],
  instructions = [],
}: RecipeIngredientsInstructionsSectionProps) {
  const ingredientItems = Array.isArray(ingredients) ? ingredients : [];
  const instructionItems = Array.isArray(instructions) ? instructions : [];
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  if (!ingredientItems.length && !instructionItems.length) return null;

  return (
    <section className="bg-[#faf7f2]">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Ingredients */}
          {ingredientItems.length > 0 && (
            <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-md sm:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Ingredients
                </h2>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-[#e8924a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d97d35]"
                >
                  <span aria-hidden>+</span>
                  Add to Shopping Cart
                </button>
              </div>

              <ul className="space-y-2">
                {ingredientItems.map((item, index) => {
                  const amount = formatAmount(item.quantity, item.unit);
                  const isChecked = Boolean(checked[index]);
                  const isHighlighted = index >= ingredientItems.length - 2;

                  return (
                    <li
                      key={item.ingredients_id || `${item.ingredient_name}-${index}`}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3.5 transition ${
                        isHighlighted
                          ? "bg-orange-50/80"
                          : "bg-white border border-gray-100"
                      }`}
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
                        className="h-4 w-4 shrink-0 rounded border-gray-300 text-[#e8924a] focus:ring-[#e8924a]"
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
                        <span className="inline-flex shrink-0 items-center gap-1.5">
                          {index % 3 === 0 ? (
                            <ShoppingCart
                              className="h-4 w-4 text-[#e8924a]"
                              aria-hidden
                            />
                          ) : null}
                          <span className="text-sm font-semibold text-[#e8924a]">
                            {amount}
                          </span>
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {instructionItems.length > 0 && (
            <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-md sm:p-8">
              <h2 className="mb-5 text-2xl font-bold text-gray-900 sm:text-3xl">
                Instructions
              </h2>

              <ol className="relative space-y-0">
                {instructionItems.map((item, index) => {
                  const step = item.step_number ?? index + 1;
                  const duration = formatStepDuration(item.duration_minutes);
                  const isLast = index === instructionItems.length - 1;

                  return (
                    <li
                      key={item.instruction_id || `step-${step}-${index}`}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {!isLast ? (
                        <span
                          className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-orange-200"
                          aria-hidden
                        />
                      ) : null}

                      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8924a] text-sm font-bold text-white">
                        {step}
                      </span>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                          <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                            {item.step_title || `Step ${step}`}
                          </h3>
                          {duration ? (
                            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-gray-400">
                              <Clock3 className="h-4 w-4" aria-hidden />
                              {duration}
                            </span>
                          ) : null}
                        </div>
                        {item.step_description ? (
                          <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-[15px]">
                            {item.step_description}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
