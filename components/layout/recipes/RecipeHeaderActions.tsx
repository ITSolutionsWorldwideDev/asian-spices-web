"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Share, Star } from "lucide-react";

type RecipeHeaderActionsProps = {
  recipeId: string;
  title: string;
  commentsHref?: string;
  averageRating?: number;
  reviewCount?: number;
  favoriteCount?: number;
  isFavorited?: boolean;
};

export default function RecipeHeaderActions({
  recipeId,
  title,
  averageRating = 0,
  reviewCount = 0,
  favoriteCount = 0,
  isFavorited = false,
}: RecipeHeaderActionsProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(isFavorited);
  const [likes, setLikes] = useState(favoriteCount);
  const [saving, setSaving] = useState(false);

  async function handleFavorite() {
    if (saving) return;

    setSaving(true);

    try {
      const res = await fetch("/api/recipes/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save favorite");
      }

      setSaved(Boolean(data.saved));
      setLikes(Number(data.count || 0));
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
    } catch {
      // user cancelled share — ignore
    }
  }

  const rounded = Math.round(averageRating);
  const ratingLabel =
    averageRating > 0 ? averageRating.toFixed(1) : "0.0";

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 text-white">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="inline-flex items-center gap-2">
          <div className="flex items-center gap-0.5" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${
                  i <= rounded
                    ? "fill-[#e8924a] text-[#e8924a]"
                    : "fill-none text-[#e8924a]"
                }`}
                strokeWidth={1.75}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-white sm:text-base">
            {ratingLabel}
          </span>
          <span className="text-sm text-white/90 sm:text-[15px]">
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </span>
        </div>

        <div className="inline-flex items-center gap-2 text-sm font-medium">
          <Heart
            className={`h-[18px] w-[18px] ${saved ? "fill-orange-400 text-orange-400" : ""}`}
            aria-hidden
          />
          <span>{likes}Likes</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleFavorite}
          disabled={saving}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition hover:bg-gray-50 disabled:opacity-60"
          aria-label={saved ? "Unlike recipe" : "Like recipe"}
          aria-pressed={saved}
        >
          <Heart
            className={`h-5 w-5 ${saved ? "fill-red-500 text-red-500" : "fill-none"}`}
            strokeWidth={1.75}
            aria-hidden
          />
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition hover:bg-gray-50"
          aria-label="Share recipe"
        >
          <Share className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    </div>
  );
}
