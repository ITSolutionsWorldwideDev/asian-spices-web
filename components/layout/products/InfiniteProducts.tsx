// apps/web/components/layout/products/InfiniteProducts.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { useLoaderStore } from "@/store/useLoaderStore";
import { useGlobalStore } from "@/store/useGlobalStore";

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
        ...p, // Keep categories, slugs, IDs intact
        id: p.id,
        name: p.name,
        image: p.image,
        base_price: salePrice, // Current purchase price
        oldPrice: rawSave > 0 ? basePrice : null, // Original price strike-through
        off: offBadge, // Fixed valid badge text
        description: p.description || "",
        seller_name: p.seller_name || null,
      };
    });
  };

  // Initialize and transform initial products
  const [products, setProducts] = useState(() =>
    mapProductData(initialProducts),
  );
  // const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { show, hide } = useLoaderStore();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const isInitialMount = useRef(true);
  const limit = 20;

  // const serializedFilters = JSON.stringify(filters);
  const serializedFilters = JSON.stringify({ ...filters, country: selectedCountry });

  // console.log(' serializedFilters -==== ',serializedFilters);

  const buildParams = (filters: any, targetPage: number) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
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

    console.log("fetchMore  == ", fetchPage);
    // if (loading || !hasMore || isFetchingRef.current) return;
    if (loading || isFetchingRef.current || (!hasMore && !clearExisting)) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      show("Loading Products...");

      const query = buildParams(filters, fetchPage);

      // console.log(' InfiniteProducts query -==== ',query);
      const res = await fetch(`/api/products?${query}`);
      const data = await res.json();

      const rawNewProducts = data.data || [];

      if (rawNewProducts.length === 0) {
        if (clearExisting) setProducts([]);
        setHasMore(false);
        return;
      }

      // Map incoming batch items through the transformation schema
      const newProducts = mapProductData(rawNewProducts);

      setProducts((prev: any) => {
        
        const baseItems = clearExisting ? [] : prev;
        const map = new Map();
        [...baseItems, ...newProducts].forEach((p) => {
          if (p && p.id) map.set(p.id.toString(), p);
        });
        return Array.from(map.values());
      });

      // setProducts((prev: any) => {
      //   const map = new Map();
      //   [...prev, ...newProducts].forEach((p) => {
      //     if (p && p.id) map.set(p.id.toString(), p);
      //   });
      //   return Array.from(map.values());
      // });

      if (newProducts.length < limit) {
        setHasMore(false);
      } else {
        // setPage((prev) => prev + 1);
        setHasMore(true);
        setPage(fetchPage + 1);
      }
    } catch (err) {
      console.error("Failed fetching paginated product listing items:", err);
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

    // Explicitly wipe state and fetch refreshed records matching the chosen country setting
    setPage(2);
    fetchMore(1, true);
  }, [serializedFilters]);

  // useEffect(() => {
  //   setProducts(mapProductData(initialProducts));
  //   setPage(2);
  //   setHasMore((initialProducts || []).length >= limit);
  //   isFetchingRef.current = false;
  // }, [serializedFilters, initialProducts]);

  useEffect(() => {
    const currentTarget = observerRef.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (
          entry?.isIntersecting &&
          !isFetchingRef.current &&
          hasMore &&
          !loading
        ) {
          fetchMore();
        }
      },
      {
        threshold: 0.1, // Triggers as soon as 10% of the target element is visible
        rootMargin: "150px", // Start pre-fetching 50px before touching the container absolute bottom
      },
    );

    observer.observe(currentTarget);

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [page, hasMore, loading, serializedFilters]);

  return (
    <>
      <ProductCard products={products} disableSlicing={true} />

      {hasMore && (
        <div
          ref={observerRef}
          className="h-20 flex items-center justify-center w-full mt-6"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className="text-center py-10 text-gray-400 text-sm font-medium">
          You've viewed all available products
        </p>
      )}
    </>
  );
}
