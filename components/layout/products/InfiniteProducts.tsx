// apps/web/components/layout/products/InfiniteProducts.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { useLoaderStore } from "@/store/useLoaderStore";
import { useGlobalStore } from "@/store/useGlobalStore";

const PAGE_SIZE = 20;

export default function InfiniteProducts({ initialProducts, filters }: any) {
  const { selectedCountry } = useGlobalStore();

  const mapProductData = (items: any[]) => {
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
        description: p.description || "",
        seller_name: p.seller_name || null,
      };
    });
  };

  const [products, setProducts] = useState(() =>
    mapProductData(initialProducts),
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    (initialProducts || []).length >= PAGE_SIZE,
  );

  const { show, hide } = useLoaderStore();
  const isFetchingRef = useRef(false);
  const isInitialMount = useRef(true);

  const serializedFilters = JSON.stringify({
    ...filters,
    country: selectedCountry,
  });

  const buildParams = (filterValues: any, targetPage: number) => {
    const params = new URLSearchParams();

    Object.entries(filterValues).forEach(([key, value]) => {
      if (!value) return;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        }
      } else {
        params.set(key, String(value));
      }
    });

    params.set("country", selectedCountry);
    params.set("page", String(targetPage));
    return params.toString();
  };

  const fetchMore = async (fetchPage = page, clearExisting = false) => {
    if (loading || isFetchingRef.current || (!hasMore && !clearExisting)) {
      return 0;
    }

    isFetchingRef.current = true;
    setLoading(true);

    try {
      show("Loading Products...");

      const query = buildParams(filters, fetchPage);
      const res = await fetch(`/api/products?${query}`);
      const data = await res.json();

      const rawNewProducts = data.data || [];

      if (rawNewProducts.length === 0) {
        if (clearExisting) {
          setProducts([]);
          setVisibleCount(PAGE_SIZE);
        }
        setHasMore(false);
        return 0;
      }

      const newProducts = mapProductData(rawNewProducts);

      setProducts((prev: any) => {
        const baseItems = clearExisting ? [] : prev;
        const map = new Map();
        [...baseItems, ...newProducts].forEach((p) => {
          if (p && p.id) map.set(p.id.toString(), p);
        });
        return Array.from(map.values());
      });

      if (clearExisting) {
        setVisibleCount(Math.min(PAGE_SIZE, newProducts.length));
      } else {
        setVisibleCount((prev) => prev + newProducts.length);
      }

      if (newProducts.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
        setPage(fetchPage + 1);
      }

      return newProducts.length;
    } catch (err) {
      console.error("Failed fetching paginated product listing items:", err);
      return 0;
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      hide();
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setPage(2);
    setHasMore(true);
    fetchMore(1, true);
  }, [serializedFilters]);

  const atEnd = !hasMore && visibleCount >= products.length;
  const showButton = products.length > PAGE_SIZE || hasMore;

  const handleToggleProducts = async () => {
    if (atEnd) {
      const resetProducts = mapProductData(initialProducts);
      setProducts(resetProducts);
      setVisibleCount(Math.min(PAGE_SIZE, resetProducts.length));
      setPage(2);
      setHasMore(resetProducts.length >= PAGE_SIZE);
      return;
    }

    if (visibleCount < products.length) {
      setVisibleCount((prev) =>
        Math.min(prev + PAGE_SIZE, products.length),
      );
      return;
    }

    if (hasMore && !loading) {
      await fetchMore();
    }
  };

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <>
      <ProductCard products={visibleProducts} disableSlicing={true} />

      {showButton && (
        <div className="mt-8 mb-10 flex justify-center">
          <button
            type="button"
            onClick={handleToggleProducts}
            disabled={loading}
            className="flex cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-10 py-2.5 font-semibold text-white shadow transition hover:from-amber-600 hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              "Loading..."
            ) : atEnd ? (
              "Show Less"
            ) : (
              <>
                Load More
                <ArrowRight className="ml-3 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
