// apps/web/components/layout/product_filter_search/PriceFilter.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PriceFilter() {
  const router = useRouter();
  const params = useSearchParams();

  const [min, setMin] = useState(params.get("min") || "");
  const [max, setMax] = useState(params.get("max") || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newParams = new URLSearchParams(params.toString());

      if (min) newParams.set("min", min);
      else newParams.delete("min");

      if (max) newParams.set("max", max);
      else newParams.delete("max");

      newParams.set("page", "1");

      router.push(`?${newParams.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [min, max]);

  return (
    <div>
      <h3 className="font-semibold mb-2">Price</h3>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="w-20 border p-1 rounded"
        />
        <input
          type="number"
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="w-20 border p-1 rounded"
        />
      </div>
    </div>
  );
}

/* "use client";

import React, { useState } from "react";

const PriceFilter = () => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="mb-8 ">

      <button
        onClick={() => setIsMobileOpen((prev) => !prev)}
        className="lg:hidden ml-2 w-full flex justify-between items-center px-2 py-1 border rounded-lg font-semibold text-gray-900 text-sm"
      >
        Price
        <span
          className={`transition-transform ${isMobileOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>


      <h2 className="hidden lg:block text-lg font-semibold text-gray-900 mb-4">
        Price
      </h2>


      <div
        className={`block items-center gap-3 mt-4 ${
          isMobileOpen ? "" : "hidden"
        } lg:flex` }
      >
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-2 w-20 py-2 border border-gray-300 rounded text-sm focus:ring-orange-500 focus:border-transparent"
        />

        <span className="text-gray-400">-</span>

        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-2 w-20 py-2 border border-gray-300 rounded text-sm focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default PriceFilter;
 */
