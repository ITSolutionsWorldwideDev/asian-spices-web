// apps/web/components/layout/products/FilterSidebar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// =========================
// 🔹 COLLAPSIBLE
// =========================
function Collapsible({ title, children }: any) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-gray-200 pb-5 mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between font-semibold text-gray-800"
      >
        <span>{title}</span>

        <span
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          ⌄
        </span>
      </button>

      {open && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
}

interface Props {
  subcategories: any[];
  brands: any[];
}

export default function FilterSidebar({
  subcategories,
  brands,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");

  // =========================
  // HELPERS
  // =========================
  const getArray = (key: string) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  const updateUrl = (params: URLSearchParams) => {
    params.set("page", "1");

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  const updateSingle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    updateUrl(params);
  };

  const updateMultiFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    let current = getArray(key);

    if (current.includes(value)) {
      current = current.filter((v) => v !== value);
    } else {
      current.push(value);
    }

    if (current.length > 0) {
      params.set(key, current.join(","));
    } else {
      params.delete(key);
    }

    updateUrl(params);
  };

  const clearFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(key);

    updateUrl(params);
  };

  // =========================
  // SELECTED VALUES
  // =========================
  const selectedSub = getArray("subcategories");
  const selectedBrands = getArray("brands");

  return (
    <div className="sticky top-24 h-fit rounded-2xl bg-white p-6 shadow-sm lg:shadow-xl border border-gray-100">
      {/* =========================
          💰 PRICE FILTER
      ========================= */}
      <Collapsible title="Price Range">
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            value={min}
            onChange={(e) => {
              setMin(e.target.value);
              updateSingle("min", e.target.value);
            }}
            className="w-1/2 h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          />

          <input
            type="number"
            placeholder="Max"
            value={max}
            onChange={(e) => {
              setMax(e.target.value);
              updateSingle("max", e.target.value);
            }}
            className="w-1/2 h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          />
        </div>
      </Collapsible>

      {/* =========================
          📦 CATEGORIES
      ========================= */}
      <Collapsible title="Categories">
        {subcategories.map((item) => {
          const checked = selectedSub.includes(item.id);

          return (
            <label
              key={item.id}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={item.product_count === 0}
                onChange={() =>
                  updateMultiFilter("subcategories", item.id)
                }
                className="sr-only"
              />

              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                  checked
                    ? "bg-black border-black"
                    : "border-gray-300"
                }`}
              >
                {checked && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <span className="ml-3 text-sm text-gray-700 group-hover:text-black">
                {item.name}

                {item.product_count ? (
                  <span className="ml-1 text-gray-400">
                    ({item.product_count})
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}

        <button
          onClick={() => clearFilter("subcategories")}
          className="text-sm text-orange-500 hover:text-orange-600 mt-2"
        >
          Clear Categories
        </button>
      </Collapsible>

      {/* =========================
          🏷️ BRANDS
      ========================= */}
      <Collapsible title="Brands">
        {brands.map((brand) => {
          const checked = selectedBrands.includes(brand.brand_id);

          return (
            <label
              key={brand.brand_id}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={brand.product_count === 0}
                onChange={() =>
                  updateMultiFilter("brands", brand.brand_id)
                }
                className="sr-only"
              />

              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                  checked
                    ? "bg-black border-black"
                    : "border-gray-300"
                }`}
              >
                {checked && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <span className="ml-3 text-sm text-gray-700 group-hover:text-black">
                {brand.name}

                {brand.product_count ? (
                  <span className="ml-1 text-gray-400">
                    ({brand.product_count})
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}

        <button
          onClick={() => clearFilter("brands")}
          className="text-sm text-orange-500 hover:text-orange-600 mt-2"
        >
          Clear Brands
        </button>
      </Collapsible>
    </div>
  );
}
