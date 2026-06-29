// apps/web/components/layout/productdescpage/ProductTabs.tsx
"use client";

import { useState } from "react";
import ReviewsSection from "../tetimonials/ReviewsSection";
import WriteReviewForm from "../reviews/WriteReviewForm";

interface ProductTabsProps {
  product: any;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const reviewCount = product?.reviews || 0;

  const tabs = [
    "Description",
    "Nutrition Info",
    "How to Use",
    `Reviews (${reviewCount})`,
    "Write a Review",
  ] as const;

  type Tab = (typeof tabs)[number];

  const [activeTab, setActiveTab] = useState<Tab>("Description");

  // 🔥 SAFE FALLBACKS
  const description = product?.description || "No description available";
  const sku = product?.sku || "N/A";
  const weight = product?.weight || "N/A";
  const category = product?.category_name || "N/A";
  const origin = product?.country_of_origin || "N/A";

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-full p-1 gap-1 w-full overflow-x-auto sm:overflow-visible">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer shrink-0 sm:flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap
            ${
              activeTab === tab
                ? "bg-white text-black shadow"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 text-gray-700 text-sm leading-relaxed">
        {/* 🔥 DESCRIPTION */}
        {activeTab === "Description" && (
          <>
            <p className="text-[#364153]">{description}</p>

            <h4 className="mt-6 text-black">Product Details</h4>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="SKU" value={sku} />
              <Detail label="Weight" value={weight} />
              <Detail label="Category" value={category} />
              <Detail label="Origin" value={origin} />
            </div>
          </>
        )}

        {/* 🔥 NUTRITION (optional DB later) */}
        {activeTab === "Nutrition Info" && (
          <>
            <h1 className="mb-5 font-bold text-xl">Nutritional Information</h1>

            {product?.nutrition ? (
              <div className="w-[50%] border border-gray-200 rounded-lg">
                {Object.entries(product.nutrition).map(([key, value]) => (
                  <InfoRow key={key} label={key} value={String(value)} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No nutrition info available</p>
            )}
          </>
        )}

        {/* 🔥 HOW TO USE */}
        {activeTab === "How to Use" && (
          <section className="max-w-3xl px-6 py-10 text-gray-700">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How to Use
              </h2>
              <p className="leading-relaxed text-gray-600">
                {product?.usage || "No usage instructions available"}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Storage Instructions
              </h2>
              <p className="leading-relaxed text-gray-600">
                {product?.storage || "No storage instructions available"}
              </p>
            </div>
          </section>
        )}

        {/* 🔥 REVIEWS */}
        {activeTab.startsWith("Reviews") && (
          <div className="space-y-4">
            <ReviewsSection productId={product.id} />
            {/* <ReviewsSection /> */}
          </div>
        )}

        {/* 🔥 WRITE REVIEW */}
        {activeTab === "Write a Review" && (
          // <WriteReviewForm productId={product.id} />
          <WriteReviewForm
            productId={product.id}
            onSuccess={() => {
              // 🔥 optional: refresh reviews
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between bg-white px-4 py-3 rounded-lg">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-black">{value}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-300 p-2">
      <span className="text-[#364153] capitalize">{label}</span>
      <span className="text-black">{value}</span>
    </div>
  );
}
