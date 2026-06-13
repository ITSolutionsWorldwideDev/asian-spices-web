// apps/web/components/layout/product_filter_search/CategoryFilter.tsx

"use client";
import { usePathname } from "next/navigation";
import { use, useEffect } from "react";
import React, { useState } from "react";
import { useCategoryFilterStore } from "@/store/useCategoryFilterStore";

interface CategoryDataProp {
  // categoriesData: (string | Category)[];
  title1: string;
}

const CategoryFilter = ({ title1 }: CategoryDataProp) => {
  const selectedCategories = useCategoryFilterStore(
    (state) => state.selectedCategories,
  );

  const toggleCategory = useCategoryFilterStore(
    (state) => state.toggleCategory,
  );

  const clearCategories = useCategoryFilterStore(
    (state) => state.clearCategories,
  );

  const data = useCategoryFilterStore((state) => state.data);
  const loading = useCategoryFilterStore((state) => state.loading);
  const fetchCategories = useCategoryFilterStore(
    (state) => state.fetchCategories,
  );

  // 🔹 Safely resolve first category

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // const [data, setData] = useState<any>(null);
  const pathname = usePathname();

  const slug = pathname.split("/").filter(Boolean).pop();

  useEffect(() => {
    if (slug) {
      fetchCategories(slug);
    }
  }, [slug, fetchCategories]);

  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const handleCategoryToggle = (categoryId: string) => {
    toggleCategory(categoryId);
  };

  return (
    <>
      <div className="mb-8">
        {/* Mobile Toggle Button */}
        <button
          onClick={toggleMobile}
          className="lg:hidden  text-sm w-full flex justify-between items-center px-2 py-1 border rounded-lg text-gray-900 font-semibold"
        >
          {title1}

          <span
            className={`transition-transform ${isMobileOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>
        {/* Title for Desktop */}
        <h2 className="hidden lg:block text-lg font-semibold text-gray-900 mb-4">
          {title1}
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
        </h2>
        {/* Category List */}
        <div
          className={`space-y-2 mt-4 lg:mt-0 ${
            isMobileOpen ? "block" : "hidden"
          } lg:block`}
        >
          {data?.map((category: any) => {
            // const isObject = typeof category === "object";
            // const categoryName = isObject ? category.name : category;
            // const hasChildren =
            // isObject && category.children && category.children.length > 0;
            // const isExpanded = expandedCategories.includes(categoryName);
            const isSelected = selectedCategories.includes(category.id);

            return (
              <div key={category.name}>
                {/* Parent Category */}
                <div className="flex items-center justify-between">
                  <label
                    className="flex items-center cursor-pointer group flex-1"
                    // onClick={() => hasChildren && toggleExpand(categoryName)}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-black"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <span className="ml-3 text-gray-600 text-sm group-hover:text-gray-900">
                      {category.name}
                    </span>
                  </label>

                  {/* Expand icon (mobile only) */}
                  {/* {hasChildren && (
                    <span className="lg:hidden text-xs">
                      {isExpanded ? "−" : "+"}
                    </span>
                  )} */}
                </div>

                {/* Child Categories */}
                {/* {hasChildren && isExpanded && (
                  <div className="ml-8 mt-2 space-y-2">
                    {category.children!.map((child: any) => (
                      <div key={child} className="text-gray-500 text-sm">
                        {child}
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
            );
          })}
        </div>
        <button
          onClick={clearCategories}
          className="mt-2 text-orange-600 cursor-pointer"
        >
          Clear
        </button>
      </div>
    </>
  );
};

export default CategoryFilter;




  // const toggleExpand = (name: string) => {
  //   setExpandedCategories((prev) =>
  //     prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
  //   );
  // };

  // const firstItem = data && data.length > 0 ? data[0] : null;

  // const firstCategory =
  //   firstItem && typeof firstItem === "object"
  //     ? firstItem.name
  //     : typeof firstItem === "string"
  //       ? firstItem
  //       : "";

  // const firstCategoryHasChildren =
  //   firstItem &&
  //   typeof firstItem === "object" &&
  //   firstItem.children &&
  //   firstItem.children.length > 0;

  // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  //   firstCategory ? [firstCategory] : [],
  // );

  // const [expandedCategories, setExpandedCategories] = useState<string[]>(
  //   firstCategory && firstCategoryHasChildren ? [firstCategory] : [],
  // );