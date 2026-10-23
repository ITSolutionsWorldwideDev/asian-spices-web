// apps/web/components/layout/product_filter_search/SubcategoryFilter.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SubcategoryFilter({ items, title }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = searchParams.get("subcategories")?.split(",") || [];

  const toggle = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());

    let updated = [...selected];

    if (updated.includes(id)) {
      updated = updated.filter((i) => i !== id);
    } else {
      updated.push(id);
    }

    if (updated.length > 0) {
      params.set("subcategories", updated.join(","));
    } else {
      params.delete("subcategories");
    }

    params.set("page", "1"); // reset page

    router.push(`/spices?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-3">{title}</h2>

      <div className="space-y-2">
        {items.map((item: any) => {
          const isChecked = selected.includes(item.id);

          return (
            <label key={item.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(item.id)}
              />
              <span>{item.name} ({item.product_count})</span>
            </label>
          );
        })}
      </div>

      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("subcategories");
          router.push(`/spices?${params.toString()}`);
        }}
        className="text-sm text-orange-500 mt-2"
      >
        Clear
      </button>
    </div>
  );
}