"use client";

import { useEffect, useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import WriteReviewForm from "@/components/layout/reviews/WriteReviewForm";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
  status?: string | null;
};

type RecipeReviewsSectionProps = {
  recipeId: string;
  initialAverage?: number;
  initialTotal?: number;
};

function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "A";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function ReviewStars({ rating }: { rating: number }) {
  const value = Math.round(Number(rating) || 0);

  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= value
              ? "fill-[#e8924a] text-[#e8924a]"
              : "fill-none text-gray-300"
          }`}
          strokeWidth={1.75}
        />
      ))}
    </div>
  );
}

export default function RecipeReviewsSection({
  recipeId,
  initialAverage = 0,
  initialTotal = 0,
}: RecipeReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(initialTotal);
  const [average, setAverage] = useState(initialAverage);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [helpful, setHelpful] = useState<Record<string, number>>({});

  const loadReviews = async (nextPage = 1, replace = true) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/products/reviews?recipeId=${recipeId}&page=${nextPage}`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load reviews");
      }

      setTotal(data.total || 0);
      setAverage(Number(data.average || 0));
      setReviews((prev) =>
        replace ? data.reviews || [] : [...prev, ...(data.reviews || [])],
      );
      setPage(nextPage);
    } catch (err) {
      console.error(err);
      if (replace) setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews(1, true);
  }, [recipeId]);

  return (
    <section id="recipe-reviews" className="bg-[#faf7f2]">
      <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Reviews
            </h2>
            <p className="mt-1 text-sm text-gray-500 sm:text-[15px]">
              What our community says about this recipe
              {total > 0
                ? ` · ${average.toFixed(1)} avg · ${total} review${total === 1 ? "" : "s"}`
                : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#e8924a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d97d35]"
          >
            {showForm ? "Close" : "Write a Review"}
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <WriteReviewForm
              recipeId={recipeId}
              onSuccess={() => {
                setShowForm(false);
                loadReviews(1, true);
              }}
            />
          </div>
        )}

        {loading && reviews.length === 0 ? (
          <p className="text-sm text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
            <p className="text-base font-medium text-gray-800">
              No reviews yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to share your experience with this recipe.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {reviews.map((review) => {
                const count = helpful[review.id] || 0;

                return (
                  <article
                    key={review.id}
                    className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-[#e8924a]">
                          {getInitials(review.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {review.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatRelativeTime(review.created_at)}
                          </p>
                        </div>
                      </div>
                      <ReviewStars rating={review.rating} />
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-6 text-gray-700">
                      {review.comment}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setHelpful((prev) => ({
                          ...prev,
                          [review.id]: (prev[review.id] || 0) + 1,
                        }))
                      }
                      className="mt-4 inline-flex items-center gap-1.5 self-start text-sm text-gray-500 transition hover:text-[#e8924a]"
                    >
                      <ThumbsUp className="h-4 w-4" aria-hidden />
                      Helpful
                      {count > 0 ? (
                        <span className="text-gray-400">({count})</span>
                      ) : null}
                    </button>
                  </article>
                );
              })}
            </div>

            {reviews.length < total && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => loadReviews(page + 1, false)}
                  disabled={loading}
                  className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-orange-200 hover:text-[#e8924a] disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load more reviews"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
