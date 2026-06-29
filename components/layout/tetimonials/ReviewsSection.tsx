// apps/web/components/layout/tetimonials/ReviewsSection.tsx

"use client";

import { useEffect, useState } from "react";
import Stars from "./Stars";

export default function ReviewsSection({ productId }: { productId: string }) {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);

  const fetchReviews = async () => {
    const res = await fetch(
      `/api/products/reviews?productId=${productId}&page=${page}`
    );
    const json = await res.json();

    if (page === 1) {
      setData(json);
    } else {
      setData((prev: any) => ({
        ...json,
        reviews: [...prev.reviews, ...json.reviews],
      }));
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  if (!data) return <p>Loading reviews...</p>;

  const breakdownMap: any = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  data.breakdown.forEach((b: any) => {
    breakdownMap[b.rating] = b.count;
  });

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {/* SUMMARY */}
      <div className="flex gap-10 border-b pb-8">
        <div>
          <h2 className="text-5xl font-semibold">{data.average}</h2>
          <Stars rating={Math.round(data.average)} />
          <p className="text-sm text-gray-500">{data.total} reviews</p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <span>{star} star</span>
              <div className="flex-1 h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-orange-500"
                  style={{
                    width: `${(breakdownMap[star] / data.total) * 100 || 0}%`,
                  }}
                />
              </div>
              <span>{breakdownMap[star]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="divide-y">
        {data.reviews.map((r: any) => (
          <div key={r.id} className="py-6">
            <p className="font-medium">{r.name}</p>
            <Stars rating={r.rating} />
            <p className="text-sm text-gray-500">
              {new Date(r.created_at).toDateString()}
            </p>
            <p className="mt-2">{r.comment}</p>
          </div>
        ))}
      </div>

      {/* LOAD MORE */}
      {data.reviews.length < data.total && (
        <div className="text-center mt-6">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="border px-6 py-2 rounded-lg"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}
