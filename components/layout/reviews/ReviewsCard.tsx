// components/layout/reviews/ReviewsCard.tsx

"use client";

import React, { useEffect, useState } from "react";

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
          // Pull down the exact server message text to see what database field is breaking
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            errData.error || `Server responded with status code: ${res.status}`,
          );
        }

        const data = await res.json();
        // Handle variations between database array formats and your fallback mock array
        const fetchedReviews = Array.isArray(data) ? data : data.reviews || [];
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error updating review feedback track:", error);
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
          const imageSrc = item.image
            ? `/assets/reviews/${item.image}`
            : "/assets/reviews/966bdcc20de9d1146da18068833210d399cd593e.jpg";

          return (
            <div
              key={item.id || `review-${idx}`}
              className="relative p-6 bg-cover rounded-2xl bg-[url('/assets/reviews/Subtract.png')] bg-white shadow-md hover:shadow-xl w-[320px] md:w-[400px] flex-shrink-0 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={imageSrc}
                  alt={reviewerName}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
                />
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

              <p className="text-gray-600 text-sm leading-relaxed mt-2 line-clamp-4">
                "{reviewerText}"
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewsCard;

/* "use client";

import React, { useEffect, useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  image: string;
  stars: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Home Chef",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `The quality of spices from Asian Spices is exceptional! 
    The turmeric has such a vibrant color and the aroma is incredible. 
    My curries have never tasted better.`,
  },
  {
    name: "Chef Michael Rodriguez",
    role: "Restaurant Owner",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `As a professional chef, I demand the best ingredients. 
    Asian Spices consistently delivers authentic, high-quality spices 
    that elevate every dish we serve.`,
  },
  {
    name: "Priya Patel",
    role: "Food Blogger",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `I've tried many spice brands, but Asian Spices stands out. 
    The freshness is unmatched and knowing they support sustainable farming 
    makes me feel good about every purchase.`,
  },
  {
    name: "dsadas",
    role: "Home Chef",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `The quality of spices from Asian Spices is exceptional! 
    The turmeric has such a vibrant color and the aroma is incredible. 
    My curries have never tasted better.`,
  },
  {
    name: "dsda",
    role: "Restaurant Owner",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `As a professional chef, I demand the best ingredients. 
    Asian Spices consistently delivers authentic, high-quality spices 
    that elevate every dish we serve.`,
  },
  {
    name: "czxcxzc",
    role: "Food Blogger",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `I've tried many spice brands, but Asian Spices stands out. 
    The freshness is unmatched and knowing they support sustainable farming 
    makes me feel good about every purchase.`,
  },

  {
    name: "ds",
    role: "Food Blogger",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `I've tried many spice brands, but Asian Spices stands out. 
    The freshness is unmatched and knowing they support sustainable farming 
    makes me feel good about every purchase.`,
  },

  {
    name: "veveo",
    role: "Food Blogger",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `I've tried many spice brands, but Asian Spices stands out. 
    The freshness is unmatched and knowing they support sustainable farming 
    makes me feel good about every purchase.`,
  },

  {
    name: "veveo",
    role: "Food Blogger",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `I've tried many spice brands, but Asian Spices stands out. 
    The freshness is unmatched and knowing they support sustainable farming 
    makes me feel good about every purchase.`,
  },
];

const ReviewsCard: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = right, -1 = left

  const getVisibleCount = (width: number) => {
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  };

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount(window.innerWidth));
    };

    handleResize(); // initial run
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => {
        let next = prev + 3 * direction;

        // Reverse direction at bounds
        if (next + visibleCount > testimonials.length) {
          setDirection(-1);
          next = prev - 3;
        } else if (next < 0) {
          setDirection(1);
          next = prev + 3;
        }

        return (next + testimonials.length) % testimonials.length;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [direction, visibleCount]);

  return (
    <div className="relative overflow-hidden ">
      <div
        className="flex  md:gap-3 container mx-auto transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${(startIndex * 100) / visibleCount}%)`,
        }}
      >
        {testimonials.map((item, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden shrink-0 sm:p-4  bg-cover rounded-2xl  bg-[url('/assets/reviews/Subtract.png')]
             hover:shadow-2xl   ${visibleCount === 1 ? "w-full" : visibleCount === 2 ? "w-1/2" : "w-1/3"}
            `}
          >
            <div className="flex items-center md:gap-4 md:mb-4">
              <img
                src={`/assets/reviews/${item.image}`}
                alt={item.name}
                className="w-25 h-25 rounded-full  object-cover border-8 border-white"
              />
              <div className="ml-10">
                <div className="flex justify-start space-x-1  text-yellow-500">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.role}</p>
              </div>
            </div>
            <div className="absolute right-0  md:top-20 h-full opacity-5">
              <img src="/assets/reviews/Group95.png" alt="" className="" />
            </div>

            <p className="text-gray-700 mt-10">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsCard;
 */
