// apps/web/components/layout/recipes/RecipeSearchBar.tsx

"use client";

import { useRouter } from "next/navigation";

import { Search } from "lucide-react";

import { useState } from "react";

interface RecipeSearchBarProps {
  defaultSearch?: string;
}

export default function RecipeSearchBar({
  defaultSearch = "",
}: RecipeSearchBarProps) {
  const router = useRouter();

  const [search, setSearch] = useState(defaultSearch);

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    router.push(`/recipes?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border shadow-sm p-3 flex items-center gap-3"
    >
      <Search
        size={20}
        className="text-gray-400"
      />

      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search recipes..."
        className="flex-1 outline-none bg-transparent"
      />

      <button
        type="submit"
        className="px-5 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition"
      >
        Search
      </button>
    </form>
  );
}