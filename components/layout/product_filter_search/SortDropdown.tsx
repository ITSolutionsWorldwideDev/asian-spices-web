// apps/web/components/layout/product_filter_search/SortDropdown.tsx
"use client";

import { ArrowUpDown, ChevronDown, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SortDropdown() {
  const router = useRouter();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("search") || "");

  // =========================
  // 🔍 DEBOUNCED SEARCH
  // =========================
  useEffect(() => {
    // Skip on mount / after our own replace, so a clean URL doesn't gain ?page=1
    if (search === (params.get("search") || "")) return;

    const timeout = setTimeout(() => {
      const newParams = new URLSearchParams(params.toString());

      if (search.trim()) {
        newParams.set("search", search);
      } else {
        newParams.delete("search");
      }

      newParams.set("page", "1");

      router.replace(`?${newParams.toString()}`, {
        scroll: false,
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, params, router]);

  // =========================
  // 🔄 SORT CHANGE
  // =========================
  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(params.toString());

    newParams.set("sort", value);
    newParams.set("page", "1");

    router.replace(`?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div
      className="notranslate flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5"
      translate="no"
    >
      {/* =========================
          🔍 SEARCH BAR
      ========================= */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 sm:h-12 rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100 shadow-sm"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full transition"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* =========================
          🔽 SORT DROPDOWN
      ========================= */}
      <div className="relative w-full sm:w-auto shrink-0 hidden sm:block">
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
          <select
            defaultValue={params.get("sort") || "newest"}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full sm:w-auto h-11 sm:h-12 appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm font-medium text-gray-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100 shadow-sm sm:min-w-[210px] cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="popular">Most Popular</option>
            <option value="relevance">Relevance</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
