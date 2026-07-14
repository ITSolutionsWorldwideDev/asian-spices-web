// apps/web/components/layout/recipes/RecipeSearchBar.tsx

"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

interface RecipeSearchBarProps {
  defaultSearch?: string;
}

function scrollToResults() {
  const el = document.getElementById("recipes-results");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("search", search.trim());
    }

    const query = params.toString();
    const href = query
      ? `/recipes?${query}#recipes-results`
      : `/recipes#recipes-results`;

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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-w-0 bg-white rounded-2xl border shadow-sm p-2 sm:p-3 flex items-center gap-2 sm:gap-3 overflow-hidden"
    >
      <Search size={20} className="text-gray-400 shrink-0" />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search recipes..."
        className="min-w-0 flex-1 outline-none bg-transparent text-sm sm:text-base px-1"
      />

      <button
        type="submit"
        className="shrink-0 px-3 sm:px-5 py-2 rounded-xl bg-orange-600 text-white text-sm sm:text-base hover:bg-orange-700 transition whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}
