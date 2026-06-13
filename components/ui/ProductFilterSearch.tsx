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

/* import React from "react";
import CategoryFilter from "../layout/product_filter_search/CategoryFilter";
// import StoreFilter from "../layout/product_filter_search/StoreFilter";
import PriceFilter from "../layout/product_filter_search/PriceFilter";


interface ProductFilterSearchProps {
  // categoriesData: (string | Category)[];
  // storesData: (string | Stores)[];
  title1: string;
  title2: string;
}

export default function ProductFilterSearch({
  // storesData,
  title1,
  title2,
}: ProductFilterSearchProps) {
  return (
    <div className=" mx-auto  lg:shadow-xl p-5">
      <div className=" rounded-lg flex justify-center lg:block  space-x-5">


        <input
  type="text"
  placeholder="Search products..."
  onChange={(e) => setSearch(e.target.value)}
  className="w-full border p-2 rounded"
/>

        <CategoryFilter  title1={title1} />

        <StoreFilter storesData={storesData} title2={title2} />

        <PriceFilter />
        <button
          className="hidden lg:block  w-full bg-amber-400 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      <button
        // onClick={handleSearch}
        className="lg:hidden w-full bg-amber-400 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
      >
        Search
      </button>
    </div>
  );
} */


// interface Category {
//   name: string;
//   children?: string[];
// }


// interface Stores {
//   name: string;
//   children?: string[];
// }
