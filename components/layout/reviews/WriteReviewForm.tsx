// apps/web/components/layout/reviews/WriteReviewForm.tsx

"use client";

import { useLoaderStore } from "@/store/useLoaderStore";
import { useState } from "react";

interface WriteReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export default function WriteReviewForm({
  productId,
  onSuccess,
}: WriteReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const { show, hide } = useLoaderStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
    rating: 0,
  });

  // 🔹 handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setMessage("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 validation
    if (!formData.rating) {
      setMessage("Please select a rating ⭐");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      show("Adding Reviews...");

      const res = await fetch("/api/products/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          product_id: productId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }

      // ✅ reset form
      setFormData({
        name: "",
        email: "",
        comment: "",
        rating: 0,
      });

      setMessage("✅ Review submitted (pending approval)");

      // 🔥 trigger parent refresh (optional)
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Failed to submit review");
    } finally {
      hide(); 
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Leave a Review ⭐</h2>

      {/* 🔥 MESSAGE */}
      {message && (
        <div className="mb-4 text-center text-sm text-gray-600">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* ⭐ STAR RATING */}
        <div>
          <p className="mb-2 font-medium">Your Rating:</p>

          <div className="flex gap-2 text-3xl cursor-pointer select-none">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hover || formData.rating) >= star;

              return (
                <span
                  key={star}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      rating: star,
                    }))
                  }
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className={`transition ${
                    active ? "text-yellow-400 scale-110" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              );
            })}
          </div>
        </div>

        {/* COMMENT */}
        <textarea
          name="comment"
          placeholder="Write your review..."
          value={formData.comment}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
