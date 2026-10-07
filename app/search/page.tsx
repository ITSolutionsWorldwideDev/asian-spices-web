import { Suspense } from "react";
import { getProducts } from "@/lib/dbactions/products";
import { getRecipes } from "@/lib/dbactions/recipes";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import { Search } from "lucide-react";
import SearchResultsClient from "@/components/layout/search/SearchResultsClient";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}"` : "Search Products & Recipes",
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
    // Keep catalog base_price (flash / ProductCard VAT + discount need this)
    base_price: Number(p.base_price || 0),
    oldPrice: rawSave > 0 ? basePrice : null,
    min_offered_price:
      p.min_offered_price != null && p.min_offered_price !== ""
        ? Number(p.min_offered_price)
        : null,
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
  if (!query) {
    return <SearchResultsClient query="" products={[]} recipes={[]} />;
  }

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

  return (
    <SearchResultsClient
      query={query}
      products={products}
      recipes={recipes}
    />
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-44 rounded-xl bg-gray-200" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-80 rounded-2xl bg-gray-200/70" />
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
        <div className="border-b bg-white px-4 py-5 sm:py-8">
          <div className="container mx-auto">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  {query ? (
                    <>
                      Results for{" "}
                      <span className="text-orange-500">&quot;{query}&quot;</span>
                    </>
                  ) : (
                    "Search Products & Recipes"
                  )}
                </h1>
                {query ? (
                  <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
                    Showing products and recipes matching your search
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
                    Find your favorite spices, ingredients, and authentic recipes
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-6 sm:py-10 pb-28 xl:pb-16">
          <Suspense fallback={<ResultsSkeleton />}>
            <SearchResults query={query} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
