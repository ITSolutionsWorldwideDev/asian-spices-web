"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "react-feather";
import ProductCard from "@/components/ui/ProductCard";
import { useGlobalStore } from "@/store/useGlobalStore";

type ShopCategory = {
  id: string;
  name: string;
  slug: string;
};

function mapProducts(items: any[]) {
  return (items || []).map((p: any) => {
    const basePrice = Number(p.min_offered_price || p.base_price || 0);
    const salePrice = Number(p.sale_price || basePrice);
    const rawSave = basePrice - salePrice;

    let offBadge = "";
    if (rawSave > 0) {
      if (p.discount_type === "percentage" || p.discount_type === "Bulk") {
        offBadge =
          p.discount_value && p.discount_value !== "NaN"
            ? `${p.discount_value}% OFF`
            : `${Math.round((rawSave / basePrice) * 100)}% OFF`;
      } else if (p.discount_type === "fixed") {
        offBadge = `€${p.discount_value} OFF`;
      } else {
        offBadge = `${Math.round((rawSave / basePrice) * 100)}% OFF`;
      }
    }

    return {
      ...p,
      id: p.id,
      name: p.name,
      image: p.image,
      base_price: salePrice,
      oldPrice: rawSave > 0 ? basePrice : null,
      off: offBadge,
      tag: p.tag || "",
      description: p.description || "",
      seller_name: p.seller_name || null,
    };
  });
}

export default function ExploreTheCollection() {
  const { selectedCountry } = useGlobalStore();
  const sliderRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [activeSlug, setActiveSlug] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        setProducts(mapProducts(json.data || []).slice(0, 10));
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

  const seeAllHref = activeSlug === "all" ? "/products" : `/${activeSlug}`;

  return (
    <section className="w-full py-8 sm:py-10 md:py-12">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 sm:text-4xl md:text-5xl">
            Explore The Collection
          </h2>
          <p className="mt-1 text-sm font-medium text-orange-500 sm:text-base">
            Shop by Categories
          </p>
        </div>
        <Link
          href={seeAllHref}
          className="shrink-0 text-sm font-medium text-orange-500 transition hover:text-orange-600"
        >
          See all →
        </Link>
      </div>

      <div
        className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:mb-8 sm:gap-2.5"
        style={{ scrollbarWidth: "none" }}
      >
        <button
          type="button"
          onClick={() => setActiveSlug("all")}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
            activeSlug === "all"
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-orange-300 bg-white text-stone-800 hover:border-orange-400"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveSlug(cat.slug)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeSlug === cat.slug
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-orange-300 bg-white text-stone-800 hover:border-orange-400"
            }`}
          >
            {cat.name}
          </button>
        ))}
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
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-100 bg-white p-2 shadow-md transition hover:bg-stone-50 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next products"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-100 bg-white p-2 shadow-md transition hover:bg-stone-50 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight size={18} />
          </button>

          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 py-2 scrollbar-hide sm:gap-5"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[min(280px,78vw)] shrink-0 snap-start sm:w-[300px] [&>div>div]:mt-0 [&>div>div]:grid-cols-1 [&>div>div]:gap-0"
              >
                <ProductCard products={[product]} disableSlicing />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
