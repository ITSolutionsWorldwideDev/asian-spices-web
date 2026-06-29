// apps/web/components/layout/product_filter_search/PriceFilter.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PriceFilter() {
  const router = useRouter();
  const params = useSearchParams();

  const [min, setMin] = useState(params.get("min") || "");
  const [max, setMax] = useState(params.get("max") || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newParams = new URLSearchParams(params.toString());

      if (min) newParams.set("min", min);
      else newParams.delete("min");

      if (max) newParams.set("max", max);
      else newParams.delete("max");

      newParams.set("page", "1");

      router.push(`?${newParams.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [min, max]);

  return (
    <div>
      <h3 className="font-semibold mb-2">Price</h3>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="w-20 border p-1 rounded"
        />
        <input
          type="number"
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="w-20 border p-1 rounded"
        />
      </div>
    </div>
  );
}

