// apps/web/components/layout/products/FilterSidebar.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

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

// =========================
// 🔹 CHECKBOX OPTION
// =========================
function CheckOption({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        disabled={count === 0}
        onChange={onChange}
        className="sr-only"
      />

      <div
        className={`w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition ${
          checked ? "bg-black border-black" : "border-gray-300"
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
        {label}
        {count ? <span className="ml-1 text-gray-600">({count})</span> : null}
      </span>
    </label>
  );
}

const listClass =
  "max-h-64 space-y-3 overflow-y-auto pr-2 [scrollbar-color:#d1d5db_transparent] [scrollbar-width:thin]";
const clearClass = "text-sm text-orange-700 hover:text-orange-800 mt-2";

interface Props {
  subcategories: any[];
  brands: any[];
  /** When provided, an extra Categories box lists shop categories and links to /category. */
  categories?: any[];
  /** Subcategories link to /category/subcategory instead of filtering by ?subcategories=id. */
  slugLinks?: boolean;
}

export default function FilterSidebar({
  subcategories,
  brands,
  categories,
  slugLinks = false,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const showCategories = Boolean(categories?.length);
  const subcategoryTitle = slugLinks ? "Subcategories" : "Categories";
  // Segments of /spices/aromas-colours
  const [activeCategorySlug, activeSubSlug] = pathname.split("/").filter(Boolean);

  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");

  useEffect(() => {
    setMin(searchParams.get("min") || "");
    setMax(searchParams.get("max") || "");
  }, [searchParams]);

  // =========================
  // HELPERS
  // =========================
  const getArray = (key: string) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  const updateUrl = (params: URLSearchParams) => {
    params.set("page", "1");

    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

    router.replace(`${currentPath}?${params.toString()}`, {
      scroll: false,
    });

    // router.replace(`?${params.toString()}`, {
    //   scroll: false,
    // });
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

  /** Categories and subcategories are pages, not query filters. */
  const goToPath = (path: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("subcategories");
    params.delete("page");

    const query = params.toString();
    router.push(query ? `${path}?${query}` : path, { scroll: false });
  };

  const goToCategory = (item: any | null) =>
    goToPath(item ? `/${item.slug}` : "/products");

  const goToSubcategory = (item: any | null) =>
    goToPath(
      item ? `/${item.category_slug}/${item.slug}` : `/${activeCategorySlug}`,
    );

  // =========================
  // SELECTED VALUES
  // =========================
  const selectedSub = getArray("subcategories");
  const selectedBrands = getArray("brands");

  return (
    <aside className="relative z-0 self-start h-fit rounded-2xl bg-white p-6 shadow-sm lg:shadow-xl border border-gray-100 lg:sticky lg:top-28">
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
      {showCategories && (
        <Collapsible title="Categories">
          <div className={listClass}>
            {categories!.map((item) => {
              const checked = item.slug === activeCategorySlug;

              return (
                <CheckOption
                  key={item.id}
                  label={item.name}
                  count={item.product_count}
                  checked={checked}
                  onChange={() => goToCategory(checked ? null : item)}
                />
              );
            })}
          </div>

          <button onClick={() => goToCategory(null)} className={clearClass}>
            Clear Categories
          </button>
        </Collapsible>
      )}

      {/* =========================
          🗂️ SUBCATEGORIES
      ========================= */}
      {subcategories.length > 0 && (
        <Collapsible title={subcategoryTitle}>
          <div className={listClass}>
            {subcategories.map((item) => {
              const checked = slugLinks
                ? item.slug === activeSubSlug
                : selectedSub.includes(item.id);

              return (
                <CheckOption
                  key={item.id}
                  label={item.name}
                  count={item.product_count}
                  checked={checked}
                  onChange={() =>
                    slugLinks
                      ? goToSubcategory(checked ? null : item)
                      : updateMultiFilter("subcategories", item.id)
                  }
                />
              );
            })}
          </div>

          <button
            onClick={() =>
              slugLinks ? goToSubcategory(null) : clearFilter("subcategories")
            }
            className={clearClass}
          >
            {`Clear ${subcategoryTitle}`}
          </button>
        </Collapsible>
      )}

      {/* =========================
          🏷️ BRANDS
      ========================= */}
      <Collapsible title="Brands">
        <div className={listClass}>
          {brands.map((brand) => (
            <CheckOption
              key={brand.brand_id}
              label={brand.name}
              count={brand.product_count}
              checked={selectedBrands.includes(brand.brand_id)}
              onChange={() => updateMultiFilter("brands", brand.brand_id)}
            />
          ))}
        </div>

        <button onClick={() => clearFilter("brands")} className={clearClass}>
          Clear Brands
        </button>
      </Collapsible>
    </aside>
  );
}
