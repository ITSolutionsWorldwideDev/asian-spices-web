"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag, CheckCircle2 } from "lucide-react";
import { useRecipeDiscountStore } from "@/store/useRecipeDiscountStore";

type RecipeLikeDiscountBannerProps = {
  recipeId: string;
  recipeTitle: string;
  likesCount?: number;
  discount: {
    id: string;
    discount_type: string;
    discount_value: number;
    label: string;
  };
};

export default function RecipeLikeDiscountBanner({
  recipeId,
  recipeTitle,
  likesCount = 0,
  discount,
}: RecipeLikeDiscountBannerProps) {
  const { appliedDiscount, applyDiscount, clearDiscount } =
    useRecipeDiscountStore();
  const [message, setMessage] = useState<string | null>(null);

  const isApplied =
    appliedDiscount?.id === discount.id &&
    appliedDiscount?.recipeId === recipeId;

  function handleApply() {
    applyDiscount({
      id: discount.id,
      recipeId,
      recipeTitle,
      discount_type: discount.discount_type,
      discount_value: discount.discount_value,
      label: discount.label,
    });
    setMessage("Discount applied! Use it at checkout.");
  }

  function handleRemove() {
    clearDiscount();
    setMessage(null);
  }

  return (
    <section className="bg-[#faf7f2]">
      <div className="container mx-auto px-4 pb-2 sm:px-6">
        <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Tag className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
                  Like reward unlocked
                </p>
                <h3 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
                  You earned {discount.label} on your next order
                </h3>
                {recipeTitle ? (
                  <p className="mt-0.5 text-sm font-medium text-gray-800">
                    {recipeTitle}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-gray-600">
                  Your recipe received {likesCount}{" "}
                  {likesCount === 1 ? "like" : "likes"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isApplied ? (
                <>
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Applied
                  </span>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleApply}
                  className="rounded-lg bg-[#e8924a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Apply discount
                </button>
              )}

              <Link
                href="/checkout"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
              >
                Go to checkout
              </Link>
            </div>
          </div>

          {message && (
            <p className="mt-4 text-sm font-medium text-green-700">{message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
