"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Check, Clock3, ShoppingCart, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import type { RecipeIngredient } from "./RecipeIngredientsList";
import type { RecipeInstruction } from "./RecipeInstructionsList";
import type { IngredientProductMatch } from "@/lib/ingredientProductMatch";

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

function toCartItem(product: IngredientProductMatch) {
  const currentPrice = Number(
    product.min_offered_price || product.base_price || 0,
  );
  const discountValue = Number(product.discount_value);
  let oldPrice = 0;

  if (currentPrice > 0 && discountValue > 0) {
    const type = (product.discount_type || "").toLowerCase();
    if (type === "percentage" || type === "bulk") {
      oldPrice = Number((currentPrice / (1 - discountValue / 100)).toFixed(2));
    } else if (type === "fixed") {
      oldPrice = Number((currentPrice + discountValue).toFixed(2));
    }
  }

  return {
    id: product.id,
    title: product.name,
    base_price: currentPrice,
    oldPrice,
    discount_value: discountValue,
    discount_type: product.discount_type || undefined,
    image: product.image || "/images/placeholder.png",
    slug: product.slug,
    category_slug: product.category_slug || undefined,
    category_id: product.category_id || undefined,
    promo_code: product.promo_code || undefined,
  };
}

export default function RecipeIngredientsInstructionsSection({
  ingredients = [],
  instructions = [],
}: RecipeIngredientsInstructionsSectionProps) {
  const ingredientItems = Array.isArray(ingredients) ? ingredients : [];
  const instructionItems = Array.isArray(instructions) ? instructions : [];
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [matchedProducts, setMatchedProducts] = useState<
    Array<IngredientProductMatch | null>
  >([]);
  const [matchesReady, setMatchesReady] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedCount, setAddedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const selectedCountry = useGlobalStore((s) => s.selectedCountry);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showSuccess) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSuccess(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showSuccess]);

  const ingredientNamesKey = ingredientItems
    .map((item) => item.ingredient_name || "")
    .join("\u0001");

  useEffect(() => {
    const ingredientNames = ingredientNamesKey
      ? ingredientNamesKey.split("\u0001")
      : [];

    if (!ingredientNames.length) {
      setMatchedProducts([]);
      setMatchesReady(true);
      return;
    }

    let cancelled = false;
    setMatchesReady(false);

    const loadMatches = async () => {
      try {
        const res = await fetch("/api/products/ingredient-matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            names: ingredientNames,
            country: selectedCountry || "NL",
          }),
        });
        const data = await res.json();
        if (cancelled) return;
        setMatchedProducts(
          Array.isArray(data.products) ? data.products : ingredientNames.map(() => null),
        );
      } catch (error) {
        console.error("[Recipe ingredients] Failed to match products:", error);
        if (!cancelled) {
          setMatchedProducts(ingredientNames.map(() => null));
        }
      } finally {
        if (!cancelled) setMatchesReady(true);
      }
    };

    loadMatches();
    return () => {
      cancelled = true;
    };
  }, [ingredientNamesKey, selectedCountry]);

  const selectedCount = ingredientItems.reduce((count, _, index) => {
    return count + (checked[index] && matchedProducts[index] ? 1 : 0);
  }, 0);

  const handleAddSelectedToCart = async () => {
    const selectedProducts = ingredientItems
      .map((_, index) => (checked[index] ? matchedProducts[index] : null))
      .filter((product): product is IngredientProductMatch => Boolean(product));

    const uniqueById = new Map<string, IngredientProductMatch>();
    for (const product of selectedProducts) {
      uniqueById.set(product.id, product);
    }

    if (!uniqueById.size) return;

    setAdding(true);
    try {
      for (const product of uniqueById.values()) {
        await addToCart(toCartItem(product), isLoggedIn);
      }
      setAddedCount(uniqueById.size);
      setChecked({});
      setShowSuccess(true);
    } finally {
      setAdding(false);
    }
  };

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
                  onClick={handleAddSelectedToCart}
                  disabled={!selectedCount || adding}
                  className="inline-flex items-center gap-2 rounded-full bg-[#e8924a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d97d35] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span aria-hidden>+</span>
                  {adding ? "Adding..." : "Add to Shopping Cart"}
                </button>
              </div>

              <ul className="space-y-2">
                {ingredientItems.map((item, index) => {
                  const amount = formatAmount(item.quantity, item.unit);
                  const matchedProduct = matchedProducts[index] ?? null;
                  const canAdd = matchesReady && Boolean(matchedProduct);
                  const isChecked = Boolean(checked[index]);

                  return (
                    <li
                      key={item.ingredients_id || `${item.ingredient_name}-${index}`}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3.5 transition ${
                        canAdd
                          ? isChecked
                            ? "bg-orange-50/80"
                            : "bg-white border border-gray-100"
                          : "border border-gray-100 bg-gray-50 opacity-60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={!canAdd}
                        onChange={() =>
                          setChecked((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                        className="h-4 w-4 shrink-0 rounded border-gray-300 text-[#e8924a] focus:ring-[#e8924a] disabled:cursor-not-allowed"
                        aria-label={
                          canAdd
                            ? `Add ${item.ingredient_name} to cart`
                            : `${item.ingredient_name} is not available in our shop`
                        }
                        title={
                          canAdd
                            ? `Add ${item.ingredient_name} to cart`
                            : "Not available in our shop"
                        }
                      />
                      <span
                        className={`min-w-0 flex-1 text-sm sm:text-[15px] ${
                          canAdd
                            ? isChecked
                              ? "text-gray-800"
                              : "text-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {item.ingredient_name}
                        {!canAdd && matchesReady ? (
                          <span className="ml-2 text-xs font-medium text-gray-400">
                            Not in shop
                          </span>
                        ) : null}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1.5">
                        {canAdd ? (
                          <ShoppingCart
                            className="h-4 w-4 text-[#e8924a]"
                            aria-label="Available in our shop"
                          />
                        ) : null}
                        {amount ? (
                          <span
                            className={`text-sm font-semibold ${
                              canAdd ? "text-[#e8924a]" : "text-gray-400"
                            }`}
                          >
                            {amount}
                          </span>
                        ) : null}
                      </span>
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

      {mounted &&
        showSuccess &&
        createPortal(
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cart-success-title"
            aria-describedby="cart-success-description"
            onClick={() => setShowSuccess(false)}
            style={{ zIndex: 1000001 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                aria-label="Close"
                className="absolute top-3 right-3 rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <Check className="h-7 w-7 text-green-600" />
              </div>

              <h3
                id="cart-success-title"
                className="text-xl font-bold text-gray-900"
              >
                Added to cart successfully
              </h3>
              <p
                id="cart-success-description"
                className="mt-2 text-sm text-gray-600"
              >
                {addedCount === 1
                  ? "Your ingredient has been added to the shopping cart."
                  : `${addedCount} ingredients have been added to the shopping cart.`}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Continue
                </button>
                <Link
                  href="/cart"
                  className="flex-1 rounded-xl bg-[#e8924a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d97d35]"
                >
                  View cart
                </Link>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
