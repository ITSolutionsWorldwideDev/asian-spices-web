"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, PackageSearch, UtensilsCrossed, ShoppingBag, X, Sparkles } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import RecipeCard from "@/components/layout/recipes/RecipeCard";

interface SearchResultsClientProps {
  query: string;
  products: any[];
  recipes: any[];
}

const POPULAR_SEARCHES = [
  "Cumin",
  "Turmeric",
  "Cardamom",
  "Curry Powder",
  "Basmati Rice",
  "Chili Flakes",
  "Garam Masala",
  "Biryani",
];

export default function SearchResultsClient({
  query,
  products,
  recipes,
}: SearchResultsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "products" | "recipes">("all");
  const [inlineQuery, setInlineQuery] = useState(query);

  const totalProducts = products.length;
  const totalRecipes = recipes.length;
  const total = totalProducts + totalRecipes;

  const handleInlineSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inlineQuery.trim();
    if (!trimmed) return;
    (document.activeElement as HTMLElement)?.blur();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSuggestionClick = (term: string) => {
    setInlineQuery(term);
    (document.activeElement as HTMLElement)?.blur();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  // 1. Empty Query State
  if (!query) {
    return (
      <div className="mx-auto max-w-2xl py-8 text-center sm:py-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 sm:h-20 sm:w-20">
          <Search className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>

        <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Search Products &amp; Recipes
        </h2>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Find authentic spices, herbs, pantry essentials, and cooking recipes.
        </p>

        {/* Inline Search Form */}
        <form onSubmit={handleInlineSearch} className="mt-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={inlineQuery}
              onChange={(e) => setInlineQuery(e.target.value)}
              placeholder="Search spices, herbs, recipes..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-11 pr-10 text-[16px] text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 sm:text-sm"
            />
            {inlineQuery.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setInlineQuery("")}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="flex min-h-[48px] shrink-0 items-center justify-center rounded-2xl bg-orange-500 px-6 font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
          >
            Search
          </button>
        </form>

        {/* Popular Tags */}
        <div className="mt-8">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            Popular Searches
          </div>
          <div className="mt-3.5 flex flex-wrap justify-center gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSuggestionClick(term)}
                className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. No Results State
  if (total === 0) {
    return (
      <div className="mx-auto max-w-2xl py-8 text-center sm:py-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 sm:h-20 sm:w-20">
          <PackageSearch className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
          No results for &ldquo;{query}&rdquo;
        </h2>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          We couldn&apos;t find any products or recipes matching your search.
          Check your spelling or try searching for another ingredient.
        </p>

        {/* Inline Search to try again */}
        <form onSubmit={handleInlineSearch} className="mt-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={inlineQuery}
              onChange={(e) => setInlineQuery(e.target.value)}
              placeholder="Try another search term..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-10 text-[16px] text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 sm:text-sm"
            />
            {inlineQuery.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setInlineQuery("")}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="flex min-h-[44px] shrink-0 items-center justify-center rounded-2xl bg-orange-500 px-5 font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
          >
            Search
          </button>
        </form>

        {/* Popular Tags */}
        <div className="mt-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Suggested Searches
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSuggestionClick(term)}
                className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-4">
          <Link
            href="/spices"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-95"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  // 3. Results Found State
  const showProducts =
    (activeTab === "all" || activeTab === "products") && totalProducts > 0;
  const showRecipes =
    (activeTab === "all" || activeTab === "recipes") && totalRecipes > 0;

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Interactive Filter Pills */}
      {totalProducts > 0 && totalRecipes > 0 && (
        <div
          className="notranslate relative z-10 -mx-4 overflow-x-auto px-4 py-1 min-w-0 max-w-[calc(100vw-1rem)] scrollbar-hide sm:mx-0 sm:max-w-full sm:overflow-visible sm:p-0"
          translate="no"
        >
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-gray-200/80">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
                activeTab === "all"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>All Results</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  activeTab === "all"
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
                activeTab === "products"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  activeTab === "products"
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {totalProducts}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("recipes")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
                activeTab === "recipes"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span>Recipes</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  activeTab === "recipes"
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {totalRecipes}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Products Section */}
      {showProducts && (
        <section aria-labelledby="products-heading">
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 sm:mb-6">
            <h2
              id="products-heading"
              className="flex items-center gap-2 text-lg font-bold text-gray-900 sm:text-xl"
            >
              <ShoppingBag className="h-5 w-5 text-orange-500" />
              <span>Products</span>
              <span className="text-xs font-normal text-gray-500 sm:text-sm">
                ({totalProducts} {totalProducts === 1 ? "product" : "products"} found)
              </span>
            </h2>
          </div>

          <ProductCard products={products} disableSlicing={true} />
        </section>
      )}

      {/* Recipes Section */}
      {showRecipes && (
        <section aria-labelledby="recipes-heading" className="pt-2">
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 sm:mb-6">
            <h2
              id="recipes-heading"
              className="flex items-center gap-2 text-lg font-bold text-gray-900 sm:text-xl"
            >
              <UtensilsCrossed className="h-5 w-5 text-orange-500" />
              <span>Recipes</span>
              <span className="text-xs font-normal text-gray-500 sm:text-sm">
                ({totalRecipes} {totalRecipes === 1 ? "recipe" : "recipes"} found)
              </span>
            </h2>

            <Link
              href={`/recipes?search=${encodeURIComponent(query)}`}
              className="text-xs font-semibold text-orange-600 hover:underline sm:text-sm"
            >
              View all recipes →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe: any, i: number) => (
              <RecipeCard key={recipe.id} recipe={recipe} priority={i < 3} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
