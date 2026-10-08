"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "react-feather";
import ProductCard from "@/components/ui/ProductCard";
import { mapProductCardData } from "@/lib/product/map-product-card";
import { useGlobalStore } from "@/store/useGlobalStore";

type ShopCategory = {
  id: string;
  name: string;
  slug: string;
};

export default function ExploreTheCollection() {
  const { selectedCountry } = useGlobalStore();
  const sliderRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [activeSlug, setActiveSlug] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setCategories(
          (json.categories || []).map((c: ShopCategory) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
          })),
        );
      })
      .catch((err) => console.error("Failed to load categories:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const checkTabsScroll = () => {
    if (!tabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    checkTabsScroll();
    const el = tabsRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkTabsScroll, { passive: true });
    window.addEventListener("resize", checkTabsScroll);
    return () => {
      el.removeEventListener("scroll", checkTabsScroll);
      window.removeEventListener("resize", checkTabsScroll);
    };
  }, [categories]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({
      category: activeSlug || "all",
      limit: "10",
      page: "1",
      country: selectedCountry || "NL",
      sort: "newest",
    });

    fetch(`/api/products?${params}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setProducts(mapProductCardData(json.data || []).slice(0, 10));
      })
      .catch((err) => {
        console.error("Failed to load collection products:", err);
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeSlug, selectedCountry]);

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const amount = sliderRef.current.clientWidth * 0.75;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleCategorySelect = (
    slug: string,
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setActiveSlug(slug);
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const activeCategoryName =
    activeSlug === "all"
      ? "All"
      : categories.find((c) => c.slug === activeSlug)?.name || "";

  const seeAllHref = activeSlug === "all" ? "/products" : `/${activeSlug}`;

  return (
    <section className="w-full py-8 sm:py-10 md:py-12">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6 sm:items-end">
        <div className="min-w-0">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
            Explore The Collection
          </h2>
          <p className="mt-0.5 text-xs font-medium text-orange-500 sm:mt-1 sm:text-base">
            Shop by Categories
          </p>
        </div>
        <Link
          href={seeAllHref}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 hover:text-orange-700 sm:bg-transparent sm:p-0 sm:text-sm sm:font-medium sm:text-orange-500 sm:hover:bg-transparent sm:hover:text-orange-600"
        >
          <span>See all</span>
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Category Tabs: strictly contained to prevent horizontal blowout on mobile */}
      <div className="relative mb-6 w-full max-w-full min-w-0 sm:mb-8">
        {/* Mobile scroll hints */}
        <div
          aria-hidden
          className={`pointer-events-none absolute left-0 top-0 bottom-1.5 z-10 w-6 bg-gradient-to-r from-white via-white/80 to-transparent transition-opacity duration-300 sm:hidden ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute right-0 top-0 bottom-1.5 z-10 w-8 bg-gradient-to-l from-white via-white/80 to-transparent transition-opacity duration-300 sm:hidden ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          ref={tabsRef}
          className="flex w-full max-w-full min-w-0 gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-hide sm:gap-2.5 touch-pan-x"
          style={{
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorX: "contain",
          }}
        >
          <button
            type="button"
            onClick={(e) => handleCategorySelect("all", e)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium whitespace-nowrap transition active:scale-95 ${
              activeSlug === "all"
                ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                : "border-orange-300 bg-white text-stone-800 hover:border-orange-400"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={(e) => handleCategorySelect(cat.slug, e)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium whitespace-nowrap transition active:scale-95 ${
                activeSlug === cat.slug
                  ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                  : "border-orange-300 bg-white text-stone-800 hover:border-orange-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 w-[min(280px,78vw)] shrink-0 animate-pulse rounded-2xl bg-stone-200/80"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500">
          No products found in this category.
        </p>
      ) : (
        <div className="group relative w-full min-w-0">
          <button
            type="button"
            aria-label="Previous products"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-100 bg-white p-2 shadow-md transition hover:bg-stone-50 hidden sm:flex md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next products"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-100 bg-white p-2 shadow-md transition hover:bg-stone-50 hidden sm:flex md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight size={18} />
          </button>

          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-3 py-2 scrollbar-hide sm:px-1 sm:gap-5 touch-pan-x"
            style={{
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[280px] sm:w-[300px] shrink-0 snap-start flex flex-col [&>div]:h-full [&>div>div]:h-full [&>div>div]:mt-0 [&>div>div]:grid-cols-1 [&>div>div]:sm:grid-cols-1 [&>div>div]:md:grid-cols-1 [&>div>div]:lg:grid-cols-1 [&>div>div]:gap-0"
              >
                <ProductCard products={[product]} disableSlicing />
              </div>
            ))}

            {/* End of slider card to quickly explore the entire category collection on mobile & desktop */}
            {products.length > 0 && (
              <div className="w-[220px] sm:w-[260px] shrink-0 snap-start flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 p-6 text-center transition hover:border-orange-400 hover:bg-orange-50/80">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 mb-3 shadow-sm">
                  <ChevronRight size={22} />
                </div>
                <span className="font-semibold text-stone-900 text-sm sm:text-base">
                  {activeCategoryName ? `${activeCategoryName}` : "Collection"}
                </span>
                <p className="mt-1 text-xs text-stone-500">
                  Explore all items
                </p>
                <Link
                  href={seeAllHref}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
                >
                  <span>View All</span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Quick link below collection for mobile shoppers */}
          <div className="mt-4 flex justify-center sm:hidden">
            <Link
              href={seeAllHref}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2 text-xs font-semibold text-orange-600 shadow-sm transition active:scale-95"
            >
              <span>Explore all {activeSlug === "all" ? "products" : activeCategoryName}</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
