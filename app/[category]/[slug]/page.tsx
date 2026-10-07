// /[category]/[slug] — subcategory listing OR product detail fallback
// e.g. /beverages/coffee  OR  /beverages/some-product-slug

import { Suspense, cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import FilterSidebar from "@/components/layout/products/FilterSidebar";
import InfiniteProducts from "@/components/layout/products/InfiniteProducts";
import SortDropdown from "@/components/layout/product_filter_search/SortDropdown";
import ProductDescrption from "@/components/layout/productdescpage/DescMain";
import ProductNotFound from "@/components/layout/productdescpage/ProductNotFound";

function formatHeroHeading(heading: string, fallbackName: string) {
  const trimmed = heading?.trim();
  if (!trimmed) return `Explore Our ${fallbackName}`;
  if (/^explore\s+our\s+/i.test(trimmed)) return trimmed;
  if (/^explore\s+/i.test(trimmed)) {
    return trimmed.replace(/^explore\s+/i, "Explore Our ");
  }
  return `Explore Our ${trimmed}`;
}
import {
  getStoreCategoryBySlug,
  getStoreSubcategoryBySlug,
} from "@/lib/dbactions/categories";
import {
  getBrands,
  getProductBySlug,
  getProductReviewsSummary,
  getProducts,
  getRelatedProducts,
  getSubcategories,
} from "@/lib/dbactions/products";
import { resolveCountry } from "@/lib/country";
import { getProductMetadata } from "@/lib/product-metadata";
import { getProductJsonLd } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";
import { subcategoryContentMap } from "@/data/categoryContent";
import CategoryHeroDescription from "@/components/layout/category/CategoryHeroDescription";
import { parseCategoryGuide } from "@/lib/category-helpers";


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
    return {
      title: subcategory.name,
      description: `Shop ${subcategory.name}`,
      alternates: { canonical: `/${category}/${slug}` },
    };
  }

  const sParams = await searchParams;
  const country = await resolveCountry(sParams?.country);
  const product = await cachedGetProduct(slug, country);
  if (!product?.id) return { title: "Not found" };
  return getProductMetadata(product, product.category_name || undefined);
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

  const [relatedProducts, reviewStats] = await Promise.all([
    getRelatedProducts(product.category_id, country),
    getProductReviewsSummary(product.id),
  ]);

  return (
    <>
      <JsonLd data={getProductJsonLd(product, reviewStats)} />
      <ProductDescrption
        product={JSON.parse(JSON.stringify(product))}
        relatedProducts={JSON.parse(JSON.stringify(relatedProducts || []))}
        category={product.category_name || categoryLabel}
      />
    </>
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

    // Subcategory ka optional content fetch karna agar map mein maujood ho
    const subContent = subcategoryContentMap[slug] || null;
    const guideData = parseCategoryGuide(subContent, subcategory.name);

    return (
      <div className="bg-white min-h-screen">
        {/* Top Floating / Fixed Nav */}
        <Nav />

        {/* 1. Dedicated Hero Section Wrapper */}
        <section className="relative w-full bg-gradient-to-b from-[#fbf9f5] via-[#faf7f2]/50 to-white pt-2 sm:pt-2 md:pt-3 xl:pt-4 pb-2 sm:pb-4 border-b border-gray-100/60">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Breadcrumb: Home Page > {category.name} > {subcategory.name} */}
            <nav aria-label="Breadcrumb" className="mb-0.5 sm:mb-1 text-[11px] sm:text-xs text-gray-500">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link href="/" className="hover:text-gray-900 transition font-normal">
                  Home Page
                </Link>
                <span className="text-gray-400">&gt;</span>
                <Link href={`/${category.slug}`} className="hover:text-gray-900 transition font-normal">
                  {category.name}
                </Link>
                <span className="text-gray-400">&gt;</span>
                <span className="text-gray-700 font-medium">{subcategory.name}</span>
              </div>
            </nav>

            {/* Hero Content */}
            <div className="text-center max-w-5xl lg:max-w-6xl mx-auto pt-0 pb-0.5">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-extrabold tracking-tight text-red-600 leading-tight">
                {formatHeroHeading(guideData.bannerHeading, subcategory.name)}
              </h1>
              <CategoryHeroDescription
                initialText={guideData.bannerText}
                extendedText={guideData.extendedText}
              />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <Suspense
          fallback={
            <div className="text-center py-20 text-gray-500">Loading products...</div>
          }
        >
          <ProductSection filters={filters} slug={category.slug} />
        </Suspense>

        <div className="container mx-auto px-5">
          {/* 4. Frequently Asked Questions (Products ke baad) */}
          {subContent && subContent.faqs && subContent.faqs.length > 0 && (
            <section className="py-16 max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-neutral-500 text-sm">
                  Got questions? We've got answers.
                </p>
              </div>

              <div className="space-y-4">
                {subContent.faqs.map((faq: { question: string; answer: string }, index: number) => (
                  <details
                    key={index}
                    className="group p-6 rounded-2xl border border-neutral-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all"
                  >
                    <summary className="font-bold text-base md:text-lg text-neutral-900 cursor-pointer list-none flex justify-between items-center outline-none">
                      <span>{faq.question}</span>
                      <span className="w-8 h-8 rounded-full bg-[#fff4ee] flex items-center justify-center text-[#ff7733] transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4">
                        ⌄
                      </span>
                    </summary>
                    <p className="text-neutral-600 text-sm md:text-base mt-4 pt-4 border-t border-neutral-100 leading-relaxed font-normal">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        <Footer />
      </div>
    );
  }

  // 2) Product detail: /{category}/{product} (legacy) or /{subcategory}/{product}
  return renderProductPage(slug, country, category.name);
}