// app/products/page.tsx

import { Suspense } from "react";
import Footer from "@/components/ui/Footer";
import HeadingDescription from "@/components/ui/HeadingDescription";
import ProductPageHeader from "@/components/ui/ProductPageHeader";

import FilterSidebar from "@/components/layout/products/FilterSidebar";
import InfiniteProducts from "@/components/layout/products/InfiniteProducts";
import SortDropdown from "@/components/layout/product_filter_search/SortDropdown";

import { getBrands, getCategories, getProducts } from "@/lib/dbactions/products";

interface PageProps {
  searchParams: Promise<{
    subcategories?: string;
    brands?: string;
    min?: string;
    max?: string;
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

type Filters = {
  category: string;
  subcategories: string[];
  brands: string[];
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  page: number;
};

async function ProductSection({
  filters,
}: {
  filters: Filters & { sort: string };
}) {
  const [categories, brands, products] = await Promise.all([
    getCategories(filters),
    getBrands("all", filters),
    getProducts(filters),
  ]);

  return (
    <div className="relative z-0 grid lg:grid-cols-[260px_1fr] gap-6 container mx-auto p-5">
      <FilterSidebar
        subcategories={[]}
        categories={categories}
        brands={brands}
      />
      <div className="relative min-w-0 bg-white">
        <SortDropdown />
        <InfiniteProducts initialProducts={products} filters={filters} />
      </div>
    </div>
  );
}

export default async function AllProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const cleanArray = (val?: string) => {
    if (!val) return [];
    return val
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "" && v !== "null" && v !== "undefined");
  };

  const filters: Filters & { sort: string } = {
    category: "all",
    subcategories: cleanArray(params.subcategories),
    brands: cleanArray(params.brands),
    minPrice: params.min,
    maxPrice: params.max,
    search: params.search,
    sort: params.sort || "newest",
    page: Number(params.page || 1),
  };

  return (
    <div>
      <ProductPageHeader
        heading="Every Grain, A Burst of Taste"
        text="Discover our full collection"
        videoLink="/spices/Comp 1_10.mp4"
      />

      <HeadingDescription
        heading="Explore Our Collection"
        text="Shop All Products"
        description="Browse everything we offer across spices, foods, and more"
      />

      <Suspense
        fallback={
          <div className="text-center py-20 text-gray-500">
            Loading products...
          </div>
        }
      >
        <ProductSection filters={filters} />
      </Suspense>

      <Footer />
    </div>
  );
}
