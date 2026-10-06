// apps/web/components/layout/recipes/RecipeSearchBar.tsx

"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useRef } from "react";

interface RecipeSearchBarProps {
  defaultSearch?: string;
}

function scrollToResults() {
  const el =
    document.getElementById("recipes-products") ||
    document.getElementById("recipes-results");
  if (!el) return false;

  const y =
    el.getBoundingClientRect().top +
    window.scrollY -
    96;

  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  return true;
}

export default function RecipeSearchBar({
  defaultSearch = "",
}: RecipeSearchBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState(defaultSearch);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inputRef.current?.blur();
    (document.activeElement as HTMLElement)?.blur();

    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("search", search.trim());
    }

    const query = params.toString();
    const href = query
      ? `/recipes?${query}#recipes-products`
      : `/recipes#recipes-products`;

    // Prevent Next.js from jumping to the top/header
    router.push(href, { scroll: false });

    // Retry scroll until the results section is ready
    let attempts = 0;
    const tick = () => {
      attempts += 1;
      if (scrollToResults() || attempts >= 25) return;
      window.setTimeout(tick, 80);
    };
    window.setTimeout(tick, 50);
  };

  const handleClear = () => {
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-w-0 bg-white rounded-2xl border shadow-sm p-2 sm:p-3 flex items-center gap-2 sm:gap-3 overflow-hidden"
    >
      <Search size={20} className="text-gray-400 shrink-0 ml-1" />

      <input
        ref={inputRef}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search recipes..."
        className="min-w-0 flex-1 outline-none bg-transparent text-[16px] sm:text-base px-1 text-gray-800"
      />

      {search.trim().length > 0 && (
        <button
          type="button"
          aria-label="Clear recipe search"
          onClick={handleClear}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 active:scale-90"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <button
        type="submit"
        className="shrink-0 min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl bg-orange-600 text-white text-sm sm:text-base font-medium hover:bg-orange-700 transition active:scale-95 whitespace-nowrap flex items-center justify-center"
      >
        Search
      </button>
    </form>
  );
}
