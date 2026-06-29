// apps/web/components/ui/ProductFilterSearch.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PriceFilter from "../layout/product_filter_search/PriceFilter";

export default function ProductFilterSearch() {
  const router = useRouter();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("search") || "");

  // 🔥 Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newParams = new URLSearchParams(params.toString());

      if (search) {
        newParams.set("search", search);
      } else {
        newParams.delete("search");
      }

      newParams.set("page", "1");

      router.push(`?${newParams.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="mb-6 p-4 border rounded-xl bg-white shadow-sm">
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search spices..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      {/* 💰 Price */}
      <PriceFilter />
    </div>
  );
}

