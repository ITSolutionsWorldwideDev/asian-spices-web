import { Suspense } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/dbactions/products";
import { getRecipes } from "@/lib/dbactions/recipes";
import ProductCard from "@/components/ui/ProductCard";
import RecipeCard from "@/components/layout/recipes/RecipeCard";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import { Search, PackageSearch } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}"` : "Search",
    robots: {
      index: false,
      follow: true,
    },
  };
}

function mapProduct(p: any) {
  const basePrice = Number(p.min_offered_price || p.base_price || 0);
  const salePrice = Number(p.sale_price || basePrice);
  const rawSave = basePrice - salePrice;
  let offBadge = "";
  if (rawSave > 0) {
    if (p.discount_type === "percentage" || p.discount_type === "Bulk") {
      offBadge = p.discount_value && p.discount_value !== "NaN"
        ? `${p.discount_value}% OFF`
        : `${Math.round((rawSave / basePrice) * 100)}% OFF`;
    } else if (p.discount_type === "fixed") {
      offBadge = `€${p.discount_value} OFF`;
    } else {
      offBadge = `${Math.round((rawSave / basePrice) * 100)}% OFF`;
    }
  }
  return {
    ...p,
    id: p.id,
    name: p.name,
    image: p.image,
    slug: p.slug,
    category_slug: p.category_slug,
    base_price: basePrice,
    oldPrice: rawSave > 0 ? basePrice : null,
    min_offered_price: salePrice,
    tag: p.is_new ? "NEW" : "",
    off: offBadge,
    rating: Number(p.average_rating || 0),
    reviews: Number(p.review_count || 0),
    left: Number(p.total_available_stock || 0),
    quantity: 1,
    seller_name: p.seller_name || null,
  };
}

async function SearchResults({ query }: { query: string }) {
  const [productsData, recipesData] = await Promise.all([
    getProducts({
      category: "",
      search: query,
      page: 1,
      limit: 40,
      sort: "newest",
      countryCode: "NL",
      showUnavailable: true,
      subcategories: [],
      brands: [],
    }),
    getRecipes({ search: query, page: "1" }),
  ]);

  const products = (productsData || []).map(mapProduct);
  const recipes = recipesData?.items || [];
  const totalProducts = products.length;
  const totalRecipes = recipes.length;
  const total = totalProducts + totalRecipes;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageSearch className="mb-4 h-16 w-16 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-800">No results found</h2>
        <p className="mt-2 text-gray-500">
          We couldn&apos;t find anything for &quot;{query}&quot;. Try a different search term.
        </p>
        <Link
          href="/spices"
          className="mt-6 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {/* Products */}
      {totalProducts > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Products
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalProducts} found)
              </span>
            </h2>
          </div>
          <ProductCard products={products} disableSlicing={true} />
        </section>
      )}

      {/* Recipes */}
      {totalRecipes > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Recipes
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalRecipes} found)
              </span>
            </h2>
            <Link
              href={`/recipes?search=${encodeURIComponent(query)}`}
              className="text-sm font-medium text-orange-500 hover:underline"
            >
              View all recipes →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe: any, i: number) => (
              <RecipeCard key={recipe.id} recipe={recipe} priority={i < 3} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-7 w-48 rounded bg-gray-200" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Nav */}
        <div className="bg-white shadow-sm">
          <Nav />
        </div>

        {/* Header */}
        <div className="bg-white border-b px-4 py-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-3">
              <Search className="h-6 w-6 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {query ? (
                    <>
                      Results for{" "}
                      <span className="text-orange-500">&quot;{query}&quot;</span>
                    </>
                  ) : (
                    "Search"
                  )}
                </h1>
                {query && (
                  <p className="mt-0.5 text-sm text-gray-500">
                    Showing products and recipes matching your search
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-10">
          {!query ? (
            <p className="text-center text-gray-500">
              Enter a search term to find products and recipes.
            </p>
          ) : (
            <Suspense fallback={<ResultsSkeleton />}>
              <SearchResults query={query} />
            </Suspense>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
