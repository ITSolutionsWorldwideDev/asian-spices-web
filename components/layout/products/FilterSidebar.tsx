// apps/web/components/layout/products/FilterSidebar.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

// =========================
// 🔹 COLLAPSIBLE
// =========================
function Collapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: any;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full min-h-[44px] py-2 flex items-center justify-between font-semibold text-gray-800 focus:outline-none cursor-pointer"
      >
        <span>{title}</span>

        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
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
    <label className="flex items-center min-h-[40px] py-1 cursor-pointer group select-none">
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
const clearClass =
  "text-sm text-orange-700 hover:text-orange-800 mt-2 min-h-[40px] py-2 inline-flex items-center cursor-pointer";

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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  // =========================
  // HELPERS
  // =========================
  const getArray = (key: string) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  const updateUrl = (params: URLSearchParams) => {
    params.set("page", "1");

    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    router.replace(`${currentPath}?${params.toString()}`, {
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

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("min");
    params.delete("max");
    params.delete("subcategories");
    params.delete("brands");
    params.delete("page");
    setMin("");
    setMax("");
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
  // SELECTED VALUES & ACTIVE COUNT
  // =========================
  const selectedSub = getArray("subcategories");
  const selectedBrands = getArray("brands");
  const hasPriceFilter = Boolean(min || max);
  const activeFilterCount =
    (hasPriceFilter ? 1 : 0) +
    selectedSub.length +
    selectedBrands.length +
    (showCategories && activeCategorySlug && activeCategorySlug !== "products"
      ? 1
      : 0);

  // Active filter chips for quick dismiss
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (min || max) {
    activeChips.push({
      label: `€${min || "0"} - €${max || "∞"}`,
      onRemove: () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("min");
        params.delete("max");
        setMin("");
        setMax("");
        updateUrl(params);
      },
    });
  }
  selectedBrands.forEach((bId) => {
    const brandObj = brands.find((b) => b.brand_id === bId);
    activeChips.push({
      label: brandObj?.name || bId,
      onRemove: () => updateMultiFilter("brands", bId),
    });
  });
  if (!slugLinks) {
    selectedSub.forEach((sId) => {
      const subObj = subcategories.find((s) => s.id === sId);
      activeChips.push({
        label: subObj?.name || sId,
        onRemove: () => updateMultiFilter("subcategories", sId),
      });
    });
  }

  // =========================
  // 🧩 REUSABLE FILTER CONTROLS
  // =========================
  const filterControls = (
    <div className="space-y-1">
      {/* 💰 PRICE FILTER */}
      <Collapsible title="Price Range" defaultOpen={true}>
        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block text-xs text-gray-500 mb-1 font-medium">
              Min (€)
            </label>
            <input
              type="number"
              placeholder="0"
              value={min}
              onChange={(e) => {
                setMin(e.target.value);
                updateSingle("min", e.target.value);
              }}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-xs text-gray-500 mb-1 font-medium">
              Max (€)
            </label>
            <input
              type="number"
              placeholder="Any"
              value={max}
              onChange={(e) => {
                setMax(e.target.value);
                updateSingle("max", e.target.value);
              }}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </div>
        </div>
      </Collapsible>

      {/* 📦 CATEGORIES */}
      {showCategories && (
        <Collapsible title="Categories" defaultOpen={false}>
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

      {/* 🗂️ SUBCATEGORIES */}
      {subcategories.length > 0 && (
        <Collapsible title={subcategoryTitle} defaultOpen={false}>
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

      {/* 🏷️ BRANDS */}
      {brands.length > 0 && (
        <Collapsible title="Brands" defaultOpen={false}>
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
      )}

      {/* 🔄 SORT BY */}
      <Collapsible title="Sort By" defaultOpen={false}>
        <div className="space-y-2">
          {[
            { value: "newest", label: "Sort: Newest" },
            { value: "price_asc", label: "Price: Low → High" },
            { value: "price_desc", label: "Price: High → Low" },
            { value: "popular", label: "Most Popular" },
            { value: "relevance", label: "Relevance" },
          ].map((item) => {
            const currentSort = searchParams.get("sort") || "newest";
            const checked = currentSort === item.value;
            return (
              <label
                key={item.value}
                className="flex items-center min-h-[38px] py-1 cursor-pointer select-none group"
              >
                <input
                  type="radio"
                  name="filter-sort"
                  value={item.value}
                  checked={checked}
                  onChange={() => updateSingle("sort", item.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition shrink-0 ${
                    checked
                      ? "border-orange-600 bg-orange-600"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                >
                  {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span
                  className={`ml-3 text-sm ${
                    checked
                      ? "font-semibold text-gray-900"
                      : "text-gray-700 group-hover:text-black"
                  }`}
                >
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </Collapsible>
    </div>
  );

  return (
    <>
      {/* ── Mobile Filter Trigger Bar & Drawer (Mobile Only: lg:hidden) ── */}
      <div className="block lg:hidden w-full mb-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex-1 flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm active:bg-gray-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-800" />
              <span className="text-sm font-semibold text-gray-900">Filters</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-amber-600 text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-amber-700">
              {activeFilterCount > 0 ? "Edit Filters" : "Filter by Price, Brand..."}
            </span>
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-3.5 py-3 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-red-600 shadow-sm transition active:bg-gray-50 whitespace-nowrap cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-2 mt-1">
            {activeChips.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900 shrink-0 hover:bg-amber-100 transition active:scale-95"
              >
                <span>{chip.label}</span>
                <X className="w-3 h-3 text-amber-700" />
              </button>
            ))}
          </div>
        )}

        {/* Mobile Sidebar Drawer (Side-bar type half/two-thirds screen) */}
        {mounted && mobileOpen && createPortal(
          <div
            style={{ position: "fixed", inset: 0, zIndex: 99999999 }}
            className="lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Sidebar drawer from left */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Filter Products"
              className="fixed top-0 bottom-0 left-0 w-[80vw] sm:w-[320px] max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300"
            >
              {/* Drawer Header (Top Bar with Cross & Apply) */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-white sticky top-0 z-20 shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition active:scale-95 cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-gray-900" />
                  <h3 className="text-sm font-bold text-gray-900">Filters</h3>
                  {activeFilterCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[11px] font-bold bg-amber-600 text-white rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:thin]">
                {filterControls}
              </div>

              {/* Drawer Sticky Footer */}
              <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2.5 sticky bottom-0 shrink-0">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  disabled={activeFilterCount === 0}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-[0.98] transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
      </div>

      {/* ── Desktop Sticky Sidebar (Desktop Only: hidden lg:block) ── */}
      <aside className="hidden lg:block relative z-0 self-start h-fit rounded-2xl bg-white p-6 shadow-sm lg:shadow-xl border border-gray-100 lg:sticky lg:top-28">
        {filterControls}
      </aside>
    </>
  );
}
