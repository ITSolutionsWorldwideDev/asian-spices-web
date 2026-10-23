// apps/web/components/layout/product_filter_search/BrandFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function BrandFilter({ items, title }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = searchParams.get("brands")?.split(",") || [];

  const toggle = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());

    let updated = [...selected];

    if (updated.includes(id)) {
      updated = updated.filter((i) => i !== id);
    } else {
      updated.push(id);
    }

    if (updated.length > 0) {
      params.set("brands", updated.join(","));
    } else {
      params.delete("brands");
    }

    params.set("page", "1");

    router.push(`/spices?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-3">{title}</h2>

      {items.map((brand: any) => {
        const isChecked = selected.includes(brand.brand_id);

        return (
          <label key={brand.brand_id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggle(brand.brand_id)}
            />
            {brand.name} ({brand.product_count})
          </label>
        );
      })}
    </div>
  );
}
