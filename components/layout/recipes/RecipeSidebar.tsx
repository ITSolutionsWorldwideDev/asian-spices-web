// apps/web/components/layout/recipes/RecipeSidebar.tsx
"use client";

import Link from "next/link";

import { ChevronDown } from "lucide-react";

import * as Accordion from "@radix-ui/react-accordion";

interface RecipeSidebarProps {
  categories: any[];

  tags: any[];

  selectedCategory?: string;

  selectedTag?: string;
}

export default function RecipeSidebar({
  categories,
  tags,
  selectedCategory,
  selectedTag,
}: RecipeSidebarProps) {
  return (
    <aside className="sticky top-24 space-y-6">
      {/* CATEGORIES */}
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-bold text-lg mb-4">
          Categories
        </h3>

        <Accordion.Root
          type="multiple"
          className="space-y-2"
        >
          {categories.map((category) => (
            <Accordion.Item
              key={category.id}
              value={category.id}
              className="border rounded-xl overflow-hidden"
            >
              <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 text-left font-medium hover:bg-gray-50">
                <Link
                  href={`/recipes?category=${category.slug}`}
                  className={`flex-1 ${
                    selectedCategory === category.slug
                      ? "text-orange-600 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {category.name}
                </Link>

                <ChevronDown size={16} />
              </Accordion.Trigger>

              {category.children?.length > 0 && (
                <Accordion.Content className="px-4 pb-4">
                  <div className="flex flex-col gap-2">
                    {category.children.map((child: any) => (
                      <Link
                        key={child.id}
                        href={`/recipes?category=${child.slug}`}
                        className="text-sm text-gray-500 hover:text-orange-600"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </Accordion.Content>
              )}
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>

      {/* TAGS */}
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-bold text-lg mb-4">
          Popular Tags
        </h3>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/recipes?tag=${tag.slug}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                selectedTag === tag.slug
                  ? "text-white"
                  : "bg-gray-100 text-gray-700 hover:text-white"
              }`}
              style={{
                background:
                  selectedTag === tag.slug
                    ? tag.color
                    : undefined,
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