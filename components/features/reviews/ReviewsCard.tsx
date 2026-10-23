// components/layout/reviews/ReviewsCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { User } from "lucide-react";

interface Testimonial {
  id?: string | number;
  guest_name?: string;
  name?: string; // Fallback mapping match
  rating: number;
  stars?: number; // Fallback mapping match
  comment: string;
  text?: string; // Fallback mapping match
  role?: string;
  image?: string;
}

const DEFAULT_REVIEWS: Testimonial[] = [
  {
    id: "1",
    guest_name: "Aarav Sharma",
    rating: 5,
    comment:
      "The spices are exceptionally fresh and fragrant. Authentic flavor that reminds me of home!",
    role: "Verified Buyer",
  },
  {
    id: "2",
    guest_name: "Fatima Al-Mansoor",
    rating: 5,
    comment:
      "Fast delivery across the Netherlands and top-notch packaging. Highly recommended!",
    role: "Verified Buyer",
  },
  {
    id: "3",
    guest_name: "Sophie van den Berg",
    rating: 5,
    comment:
      "Found authentic ingredients that are impossible to find in regular Dutch grocery stores.",
    role: "Verified Buyer",
  },
  {
    id: "4",
    guest_name: "Rohan Patel",
    rating: 5,
    comment:
      "The whole spices have unmatched aroma and quality. Our family's go-to spice store now.",
    role: "Verified Buyer",
  },
];

interface ReviewsCardProps {
  productId?: string;
}

const ReviewsCard: React.FC<ReviewsCardProps> = ({ productId = "all" }) => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/reviews?productId=${productId}`);

        if (!res.ok) {
          setReviews(DEFAULT_REVIEWS);
          return;
        }

        const data = await res.json().catch(() => null);
        const fetchedReviews = Array.isArray(data) ? data : data?.reviews || [];
        setReviews(fetchedReviews.length > 0 ? fetchedReviews : DEFAULT_REVIEWS);
      } catch {
        setReviews(DEFAULT_REVIEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500 font-medium">
        Loading fresh community reviews...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-400 italic">
        No reviews posted yet. Be the first to share your story!
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden py-4">
      {/* Dynamic continuous marquee layout track */}
      <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
        {/* Render Track Set */}
        {reviews.map((item, idx) => {
          const reviewerName =
            item.guest_name || item.name || "Anonymous Guest";
          const reviewerText = item.comment || item.text || "";
          const starCount = item.rating || item.stars || 5;

          return (
            <div
              key={item.id || `review-${idx}`}
              className="relative p-6 bg-cover rounded-2xl bg-[url('/assets/reviews/Subtract.png')] bg-white shadow-md hover:shadow-xl w-[320px] md:w-[400px] flex-shrink-0 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white bg-orange-50 text-orange-500 shadow-sm"
                  aria-hidden
                >
                  <User className="h-8 w-8" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="flex text-yellow-400 text-sm mb-1">
                    {Array.from({ length: Math.min(5, starCount) }).map(
                      (_, i) => (
                        <span key={i}>★</span>
                      ),
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 leading-tight">
                    {reviewerName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {item.role || "Verified Buyer"}
                  </p>
                </div>
              </div>

              {/* Decorative Quote Background Icon */}
              <div className="absolute right-4 top-6 opacity-5 pointer-events-none">
                <img
                  src="/assets/reviews/Group95.png"
                  alt=""
                  className="w-12 h-12"
                />
              </div>

              {/* Quotes hata diye gaye hain */}
              <p className="text-gray-600 text-sm leading-relaxed mt-2 line-clamp-4">
                {reviewerText}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewsCard;