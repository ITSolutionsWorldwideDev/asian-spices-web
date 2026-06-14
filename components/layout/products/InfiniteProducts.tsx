// apps/web/components/layout/products/InfiniteProducts.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { useLoaderStore } from "@/store/useLoaderStore";

export default function InfiniteProducts({ initialProducts, filters }: any) {

  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { show, hide } = useLoaderStore();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const limit = 20;

  const buildParams = (filters: any, page: number) => {
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
    params.set("page", String(page));
    return params.toString();
  };

  const fetchMore = async () => {
    if (loading || !hasMore || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      show("Loading Products...");

      const query = buildParams(filters, page);

      const res = await fetch(`/api/products?${query}`);
      const data = await res.json();

      const newProducts = data.data || [];

      if (newProducts.length === 0) {
        setHasMore(false);
        return;
      }

      setProducts((prev: any) => {
        const map = new Map();

        [...prev, ...newProducts].forEach((p) => {
          if (p && p.id) map.set(p.id, p);
        });

        // [...prev, ...newProducts].forEach((p) => {
        //   map.set(p.id, p); // ensures unique by id
        // });

        return Array.from(map.values());
      });

      if (newProducts.length < limit) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }

      // setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      hide();
    }
  };

  useEffect(() => {
    const currentTarget = observerRef.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        // Only fetch when element enters the viewport and we aren't currently loading items
        if (entry.isIntersecting && !isFetchingRef.current && hasMore) {
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
  }, [page, hasMore, filters, loading]);


  useEffect(() => {
    setProducts(initialProducts || []);
    setPage(2);
    setHasMore(initialProducts?.length >= limit);
    isFetchingRef.current = false;
  }, [initialProducts, filters]);

  return (
    <>
      <ProductCard products={products} disableSlicing={true} />

      {hasMore && (
        <div ref={observerRef} className="h-20 flex items-center justify-center w-full mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className="text-center py-10 text-gray-400 text-sm font-medium">
          You've viewed all available products
        </p>
      )}

      {/* {hasMore && (
        <div
          ref={observerRef}
          className="h-10 flex items-center justify-center"
        >
          {loading && <p>Loading...</p>}
        </div>
      )}

      {!hasMore && (
        <p className="text-center py-6 text-gray-500">No more products</p>
      )} */}
    </>
  );
}