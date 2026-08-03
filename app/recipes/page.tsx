// app/recipes/page.tsx

import { Suspense } from "react";
import RecipeGrid from "@/components/layout/recipes/RecipeGrid";
import RecipePagination from "@/components/layout/recipes/RecipePagination";
import RecipeSearchBar from "@/components/layout/recipes/RecipeSearchBar";
import RecipeSidebar from "@/components/layout/recipes/RecipeSidebar";
import ScrollToRecipesResults from "@/components/layout/recipes/ScrollToRecipesResults";
import HeadingDescription from "@/components/ui/HeadingDescription";
import ProductPageHeader from "@/components/ui/ProductPageHeader";
import Reviews from "@/components/ui/Reviews";
import Footer from "@/components/ui/Footer";
import DeferredMount from "@/components/ui/DeferredMount";

import {
  getRecipes,
  getRecipeCategories,
  getRecipeTags,
} from "@/lib/dbactions/recipes";

interface RecipesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    tag?: string;
  }>;
}

export async function generateMetadata() {
  return {
    title: "Recipes",
    description:
      "Explore delicious recipes with categories, tags, and cooking inspiration.",
  };
}

function ResultsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden>
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 bg-gray-100 rounded-3xl border" />
        ))}
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden>
      <div className="h-64 bg-gray-100 rounded-2xl border" />
      <div className="h-40 bg-gray-100 rounded-2xl border" />
    </div>
  );
}

async function RecipesSidebarSection({
  selectedCategory,
  selectedTag,
}: {
  selectedCategory?: string;
  selectedTag?: string;
}) {
  const [categories, tags] = await Promise.all([
    getRecipeCategories(),
    getRecipeTags(),
  ]);

  return (
    <RecipeSidebar
      categories={categories}
      tags={tags}
      selectedCategory={selectedCategory}
      selectedTag={selectedTag}
    />
  );
}

async function RecipesGridSection({
  params,
}: {
  params: {
    page?: string;
    search?: string;
    category?: string;
    tag?: string;
  };
}) {
  const recipesData = await getRecipes(params);
  const recipes = recipesData.items || [];
  const pagination = recipesData.pagination;

  return (
    <div
      id="recipes-products"
      className="relative z-20 min-w-0 space-y-8 bg-white"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Explore Recipes</h2>
        <p className="text-sm text-gray-600 mt-1">
          {pagination.total} recipes found
        </p>
      </div>

      <RecipeGrid recipes={recipes} />

      <RecipePagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        searchParams={{
          search: params.search,
          category: params.category,
          tag: params.tag,
        }}
      />
    </div>
  );
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;

  return (
    <>
      {/* Streams immediately — not blocked by recipe DB queries */}
      <ProductPageHeader
        heading="A World of Recipes, One Pinch of Spice"
        text="Explore a diverse collection of recipes where every dish tells a flavorful story, from street‑style bites to homely classics, all elevated by the essence of spices."
        videoLink="/recipes/Comp 1_11.mp4"
      />

      <HeadingDescription
        heading="Explore Our Collection"
        text="All the flavors now at your fingertips"
        description="Diverse Collection But Taste So Yummy...!"
      />

      <div
        id="recipes-results"
        className="scroll-mt-28 container mx-auto px-4 py-10"
      >
        <Suspense fallback={null}>
          <ScrollToRecipesResults />
        </Suspense>

        <div className="mb-8">
          <RecipeSearchBar defaultSearch={params.search || ""} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          <Suspense fallback={<SidebarSkeleton />}>
            <RecipesSidebarSection
              selectedCategory={params.category}
              selectedTag={params.tag}
            />
          </Suspense>

          <Suspense fallback={<ResultsSkeleton />}>
            <RecipesGridSection params={params} />
          </Suspense>
        </div>
      </div>

      {/* Below-fold reviews — don't compete with first paint */}
      <DeferredMount
        fallback={<div className="h-48" aria-hidden />}
        rootMargin="300px"
      >
        <Reviews />
      </DeferredMount>

      <Footer />
    </>
  );
}
