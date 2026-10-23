"use client";

import React, { useState } from "react";

interface Store {
  name: string;
  children?: string[];
}

interface StoreDataProp {
  storesData: (string | Store)[];
  title2: string;
}

const StoreFilter = ({ storesData, title2 }: StoreDataProp) => {
  const firstItem = storesData[0];

  const firstStore =
    firstItem && typeof firstItem === "object"
      ? firstItem.name
      : typeof firstItem === "string"
        ? firstItem
        : "";

  const firstStoreHasChildren =
    firstItem &&
    typeof firstItem === "object" &&
    firstItem.children &&
    firstItem.children.length > 0;

  const [selectedStores, setSelectedStores] = useState<string[]>(
    firstStore ? [firstStore] : []
  );

  const [expandedStores, setExpandedStores] = useState<string[]>(
    firstStore && firstStoreHasChildren ? [firstStore] : []
  );

  const [showAllStores, setShowAllStores] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleStoreToggle = (store: string) => {
    if (selectedStores.includes(store)) {
      setSelectedStores((prev) => prev.filter((s) => s !== store));
      setExpandedStores((prev) => prev.filter((s) => s !== store));
    } else {
      setSelectedStores((prev) => [...prev, store]);

      const storeObj = storesData.find(
        (st) => typeof st === "object" && st.name === store
      ) as Store | undefined;

      if (storeObj?.children?.length) {
        setExpandedStores((prev) => [...prev, store]);
      }
    }
  };

  const toggleExpandStore = (store: string) => {
    setExpandedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  const visibleStores = showAllStores ? storesData : storesData.slice(0, 8);

  return (
    <div className="mb-8">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen((prev) => !prev)}
        className="lg:hidden text-sm w-full flex justify-between items-center px-2 py-1 border rounded-lg font-semibold text-gray-900"
      >
        {title2}
        <span
          className={`transition-transform ${isMobileOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {/* Desktop Title */}
      <h2 className="hidden lg:block text-lg font-semibold text-gray-900 mb-4">
        {title2}
      </h2>

      {/* Store List */}
      <div
        className={`space-y-2 mt-4 md:mt-0 ${
          isMobileOpen ? "block" : "hidden"
        } lg:block`}
      >
        {visibleStores.map((store) => {
          const isObject = typeof store === "object";
          const storeName = isObject ? store.name : store;
          const hasChildren =
            isObject && store.children && store.children.length > 0;
          const isExpanded = expandedStores.includes(storeName);
          const isSelected = selectedStores.includes(storeName);

          return (
            <div key={storeName}>
              <div className="flex items-center justify-between">
                <label
                  className="flex items-center cursor-pointer group flex-1"
                  onClick={() => hasChildren && toggleExpandStore(storeName)}
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleStoreToggle(storeName)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-black border-black"
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
                    {storeName}
                  </span>
                </label>

                {/* Expand icon for mobile */}
                {hasChildren && (
                  <span className="lg:hidden text-xs pr-1">
                    {isExpanded ? "−" : "+"}
                  </span>
                )}
              </div>

              {/* Child Stores */}
              {hasChildren && isExpanded && (
                <div className="ml-2 mt-2 space-y-1.5">
                  {store.children!.map((child) => (
                    <div
                      key={child}
                      className="text-gray-500 text-sm py-1 ml-7"
                    >
                      {child}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* View More / Less */}
        {storesData.length > 8 && (
          <button
            onClick={() => setShowAllStores(!showAllStores)}
            className="mt-3 text-orange-500 text-sm font-medium hover:text-orange-600"
          >
            {showAllStores ? "View less" : "View more"}
          </button>
        )}
      </div>
    </div>
  );
};

export default StoreFilter;
