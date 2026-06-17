// app/recipes/page.tsx

import RecipeGrid from "@/components/layout/recipes/RecipeGrid";
import RecipePagination from "@/components/layout/recipes/RecipePagination";
import RecipeSearchBar from "@/components/layout/recipes/RecipeSearchBar";
import RecipeSidebar from "@/components/layout/recipes/RecipeSidebar";
import HeadingDescription from "@/components/ui/HeadingDescription";

import ProductPageHeader from "@/components/ui/ProductPageHeader";
// import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Reviews from "@/components/ui/Reviews";
import Footer from "@/components/ui/Footer";

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

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;

  const [recipesData, categories, tags] = await Promise.all([
    getRecipes(params),
    getRecipeCategories(),
    getRecipeTags(),
  ]);

  const recipes = recipesData.items || [];

  const pagination = recipesData.pagination;

  return (
    <>
      <ProductPageHeader
        heading="A World of Recipes, One Pinch of Spice"
        text="Explore a diverse collection of recipes where every dish tells a flavorful story, from street‑style bites to homely classics, all elevated by the essence of spices."
        videoLink="/recipes/Comp 1_11.mp4"
      />

      <HeadingDescription
        heading="Explore Our Collection"
        text="All the flavors now you finger tips "
        description="Diverse  Collection But Taste So Yummy...!"
      />

      <div className="container mx-auto px-4 py-10">
        {/* SEARCH */}
        <div className="mb-8">
          <RecipeSearchBar defaultSearch={params.search || ""} />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* SIDEBAR */}
          <RecipeSidebar
            categories={categories}
            tags={tags}
            selectedCategory={params.category}
            selectedTag={params.tag}
          />

          {/* RIGHT CONTENT */}
          <div className="space-y-8">
            {/* RESULTS INFO */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Explore Recipes
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {pagination.total} recipes found
                </p>
              </div>
            </div>

            {/* RECIPES GRID */}
            <RecipeGrid recipes={recipes} />

            {/* PAGINATION */}
            <RecipePagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
            />
          </div>
        </div>
      </div>

      {/* <RegisterOnApp /> */}
      <Reviews />
      <Footer />
    </>
  );
}
