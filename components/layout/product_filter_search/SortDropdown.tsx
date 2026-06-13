// apps/web/components/layout/product_filter_search/SortDropdown.tsx
"use client";

import { Search } from "lucide-react";
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
  }, [search]);

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
    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
      {/* =========================
          🔍 SEARCH BAR
      ========================= */}
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 shadow-sm"
        />
      </div>

      {/* =========================
          🔽 SORT DROPDOWN
      ========================= */}
      <select
        defaultValue={params.get("sort") || "newest"}
        onChange={(e) => handleSortChange(e.target.value)}
        className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 shadow-sm min-w-[220px]"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price Low → High</option>
        <option value="price_desc">Price High → Low</option>
        <option value="popular">Popular</option>
        <option value="relevance">Relevance</option>
      </select>
    </div>
  );
}

/* "use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const params = useSearchParams();

  const handleChange = (value: string) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("sort", value);
    // router.push(`?${newParams.toString()}`);
    router.replace(`?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <select
      onChange={(e) => handleChange(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="newest">Newest</option>
      <option value="price_asc">Price Low → High</option>
      <option value="price_desc">Price High → Low</option>
      <option value="popular">Popular</option>
      <option value="relevance">Relevance</option>
    </select>
  );
} */
