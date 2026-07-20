// apps/web/components/layout/recipes/RecipeSidebar.tsx

import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface RecipeSidebarProps {
  categories: any[];
  tags: any[];
  selectedCategory?: string;
  selectedTag?: string;
}

/** Server Component — no Radix client bundle on first paint. */
export default function RecipeSidebar({
  categories,
  tags,
  selectedCategory,
  selectedTag,
}: RecipeSidebarProps) {
  return (
    <aside className="self-start space-y-6 lg:sticky lg:top-24 lg:z-10">
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-bold text-lg mb-4">Categories</h3>

        <div className="space-y-2">
          {categories.map((category) => {
            const hasChildren = category.children?.length > 0;
            const isSelected = selectedCategory === category.slug;

            if (!hasChildren) {
              return (
                <Link
                  key={category.id}
                  href={`/recipes?category=${category.slug}`}
                  className={`block rounded-xl border px-4 py-3 font-medium hover:bg-gray-50 ${
                    isSelected
                      ? "text-orange-600 font-bold border-orange-200 bg-orange-50"
                      : "text-gray-700"
                  }`}
                >
                  {category.name}
                </Link>
              );
            }

            return (
              <details
                key={category.id}
                className="group border rounded-xl overflow-hidden"
                open={
                  isSelected ||
                  category.children?.some(
                    (child: any) => child.slug === selectedCategory,
                  )
                }
              >
                <summary className="flex list-none items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
                  <Link
                    href={`/recipes?category=${category.slug}`}
                    className={`flex-1 font-medium ${
                      isSelected
                        ? "text-orange-600 font-bold"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </Link>
                  <ChevronDown
                    size={16}
                    className="text-gray-500 transition group-open:rotate-180 shrink-0"
                    aria-hidden
                  />
                </summary>

                <div className="flex flex-col gap-2 px-4 pb-4">
                  {category.children.map((child: any) => (
                    <Link
                      key={child.id}
                      href={`/recipes?category=${child.slug}`}
                      className={`text-sm hover:text-orange-600 ${
                        selectedCategory === child.slug
                          ? "text-orange-600 font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-bold text-lg mb-4">Popular Tags</h3>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/recipes?tag=${tag.slug}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                selectedTag === tag.slug
                  ? "text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{
                background:
                  selectedTag === tag.slug ? tag.color : undefined,
              }}
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
