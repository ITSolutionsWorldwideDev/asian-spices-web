// /[category]/[slug] — subcategory listing OR product detail fallback
// e.g. /beverages/coffee  OR  /beverages/some-product-slug

import { Suspense, cache } from "react";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import HeadingDescription from "@/components/ui/HeadingDescription";
import ProductPageHeader from "@/components/ui/ProductPageHeader";
import FilterSidebar from "@/components/layout/products/FilterSidebar";
import InfiniteProducts from "@/components/layout/products/InfiniteProducts";
import SortDropdown from "@/components/layout/product_filter_search/SortDropdown";
import ProductDescrption from "@/components/layout/productdescpage/DescMain";
import ProductNotFound from "@/components/layout/productdescpage/ProductNotFound";
import {
  getStoreCategoryBySlug,
  getStoreSubcategoryBySlug,
} from "@/lib/dbactions/categories";
import {
  getBrands,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  getSubcategories,
} from "@/lib/dbactions/products";
import { resolveCountry } from "@/lib/country";

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

const cachedGetProduct = cache(async (slug: string, country: string) =>
  getProductBySlug(slug, country),
);

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

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, slug } = await params;
  const subcategory = await getStoreSubcategoryBySlug(category, slug);
  if (subcategory) {
    return { title: subcategory.name, description: `Shop ${subcategory.name}` };
  }

  const sParams = await searchParams;
  const country = await resolveCountry(sParams?.country);
  const product = await cachedGetProduct(slug, country);
  if (!product?.id) return { title: "Not found" };
  return { title: product.name, description: product.description || "Product details" };
}

async function renderProductPage(
  slug: string,
  country: string,
  categoryLabel: string,
) {
  const product = await cachedGetProduct(slug, country);

  if (!product?.id) {
    return (
      <div className="bg-gray-50">
        <ProductNotFound />
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(product.category_id, country);

  return (
    <ProductDescrption
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts || []))}
      category={product.category_name || categoryLabel}
    />
  );
}

export default async function CategorySlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<{
    brands?: string;
    min?: string;
    max?: string;
    search?: string;
    page?: string;
    sort?: string;
    country?: string;
  }>;
}) {
  const { category: categorySlug, slug } = await params;
  const query = await searchParams;
  const country = await resolveCountry(query.country);

  const category = await getStoreCategoryBySlug(categorySlug);

  // /{subcategory}/{product} when first segment is not a category slug
  if (!category) {
    const product = await cachedGetProduct(slug, country);
    if (
      product?.id &&
      product.subcategory_slug &&
      product.subcategory_slug.toLowerCase() === categorySlug.toLowerCase()
    ) {
      return renderProductPage(slug, country, product.category_name || "");
    }
    notFound();
  }

  // 1) Subcategory listing: /beverages/coffee
  const subcategory = await getStoreSubcategoryBySlug(categorySlug, slug);
  if (subcategory) {
    const clean = (val?: string) =>
      (val ?? "")
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v && v !== "null" && v !== "undefined");

    const filters: Filters = {
      category: category.slug,
      subcategories: [subcategory.id],
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
          heading={subcategory.name}
          text={`Shop ${category.name}`}
          videoLink="/spices/Comp 1_10.mp4"
        />
        <HeadingDescription
          heading="Explore Our Collection"
          text={`Shop By ${subcategory.name}`}
          description={`Discover products in ${subcategory.name}`}
        />
        <Suspense
          fallback={
            <div className="text-center py-20 text-gray-500">Loading products...</div>
          }
        >
          <ProductSection filters={filters} slug={category.slug} />
        </Suspense>
        <Footer />
      </div>
    );
  }

  // 2) Product detail: /{category}/{product} (legacy) or /{subcategory}/{product}
  return renderProductPage(slug, country, category.name);
}
