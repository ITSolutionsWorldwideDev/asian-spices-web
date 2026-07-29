// app/spices/page.tsx

import { Suspense } from "react";
import Footer from "@/components/ui/Footer";
import HeadingDescription from "@/components/ui/HeadingDescription";
import ProductPageHeader from "@/components/ui/ProductPageHeader";
// import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Reviews from "@/components/ui/Reviews";

import FilterSidebar from "@/components/layout/products/FilterSidebar";
import InfiniteProducts from "@/components/layout/products/InfiniteProducts";
import SortDropdown from "@/components/layout/product_filter_search/SortDropdown";

import {
  getBrands,
  getProducts,
  getSubcategories,
} from "@/lib/dbactions/products";

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

// 1. Move database operations into an isolated Server Component
async function ProductSection({ filters }: { filters: Filters & { sort: string } }) {
  const [subcategories, brands, products] = await Promise.all([
    getSubcategories("spices", filters),
    getBrands("spices", filters),
    getProducts(filters)
  ]);

  return (
    <div className="relative z-0 grid lg:grid-cols-[260px_1fr] gap-6 container mx-auto p-5">
      <FilterSidebar subcategories={subcategories} brands={brands} />
      <div className="relative min-w-0 bg-white">
        
        <SortDropdown />
        <InfiniteProducts initialProducts={products} filters={filters} />
      </div>
    </div>
  );
}

export default async function SpicesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const cleanArray = (val?: string) => {
    if (!val) return [];
    return val
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "" && v !== "null" && v !== "undefined");
  };

  const filters: Filters & { sort: string } = {
    category: "spices",
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
        text="Handpicked, pure spices"
        videoLink="/spices/Comp 1_10.mp4"
      />

      <HeadingDescription
        heading="Explore Our Collection"
        text="Shop By All Spices"
        description="Discover authentic spices"
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
