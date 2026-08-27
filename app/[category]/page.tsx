import { Suspense } from "react";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import HeadingDescription from "@/components/ui/HeadingDescription";
import ProductPageHeader from "@/components/ui/ProductPageHeader";
import FilterSidebar from "@/components/layout/products/FilterSidebar";
import InfiniteProducts from "@/components/layout/products/InfiniteProducts";
import SortDropdown from "@/components/layout/product_filter_search/SortDropdown";
import { getStoreCategoryBySlug } from "@/lib/dbactions/categories";
import { getBrands, getProducts, getSubcategories } from "@/lib/dbactions/products";

type Filters = {
  category: string;
  subcategories: string[];
  brands: string[];
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  page: number;
  sort: string;
};

async function ProductSection({ filters, slug }: { filters: Filters; slug: string }) {
  const [subcategories, brands, products] = await Promise.all([
    getSubcategories(slug, filters),
    getBrands(slug, filters),
    getProducts(filters),
  ]);

  return (
    <div className="relative z-0 grid lg:grid-cols-[260px_1fr] gap-6 container mx-auto p-5">
      <FilterSidebar subcategories={subcategories} brands={brands} slugLinks />
      <div className="relative min-w-0 bg-white">
        <SortDropdown />
        <InfiniteProducts initialProducts={products} filters={filters} />
      </div>
    </div>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    subcategories?: string;
    brands?: string;
    min?: string;
    max?: string;
    search?: string;
    page?: string;
    sort?: string;
  }>;
}) {
  const { category: slug } = await params;
  const category = await getStoreCategoryBySlug(slug);
  if (!category) notFound();

  const query = await searchParams;
  const clean = (val?: string) =>
    (val ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v && v !== "null" && v !== "undefined");

  const filters: Filters = {
    category: category.slug,
    subcategories: clean(query.subcategories),
    brands: clean(query.brands),
    minPrice: query.min,
    maxPrice: query.max,
    search: query.search,
    sort: query.sort || "newest",
    page: Number(query.page || 1),
  };

  return (
    <div>
      <ProductPageHeader
        heading={category.name}
        text={`Shop ${category.name}`}
        videoLink="/spices/Comp 1_10.mp4"
      />
      <HeadingDescription
        heading="Explore Our Collection"
        text={`Shop By ${category.name}`}
        description={`Discover products in ${category.name}`}
      />
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading products...</div>}>
        <ProductSection filters={filters} slug={category.slug} />
      </Suspense>
      <Footer />
    </div>
  );
}
