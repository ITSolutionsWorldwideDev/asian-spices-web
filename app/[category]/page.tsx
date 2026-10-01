import type { Metadata } from "next";
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
import { categoryContent } from "@/data/categoryContent"; // Content data import kiya
import CategoryGuideSection from "@/components/layout/category/CategoryGuideSection";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;

  if (slug === "spices") {
    return {
      title: "Buy Asian Spices Online | Heera & Premium Brands - NL",
      description:
        "Browse our full range of authentic Asian spices - whole, ground & blended. Trusted brands like Heera, delivered fast across the Netherlands.",
      alternates: {
        canonical: "/spices",
      },
    };
  }

  if (slug === "foods-beverages") {
    return {
      title: "Asian Groceries & Foods Online | Rice, Lentils, Snacks - NL",
      description:
        "Shop authentic Asian food & beverages online: rice, lentils, flours, snacks and more. Trusted Indian & Asian grocery brands delivered in the Netherlands.",
      alternates: {
        canonical: "/foods-beverages",
      },
    };
  }

  const category = await getStoreCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: `${category.name} | Asian Spices Online`,
    description: `Shop authentic ${category.name} online at Asian Spices. Quality ingredients, fast delivery across the Netherlands.`,
    alternates: {
      canonical: `/${slug}`,
    },
  };
}

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

  // Category ke mutabiq content fetch karna (jaise "beverages")
  const currentContent = categoryContent[slug] || null;

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
      {/* 1. Header Banner — Full Width Across Viewport */}
      <div className="w-full">
        <ProductPageHeader
          heading={category.name}
          text={`Shop ${category.name}`}
          imageSrc="/assets/categories/cat-banner.webp"
        />
      </div>

      {/* Container wrapper for padded content */}
      <div className="container mx-auto px-5">
        {/* Breadcrumb / Title */}
        <div className="pt-6 text-sm sm:text-base">
          <p className="font-medium text-gray-900">{category.name}</p>
        </div>

        {/* 2. SECTION 2 — Collapsible Guide + Image */}
        {currentContent && currentContent.sections && (
          <CategoryGuideSection
            sections={currentContent.sections}
            image={currentContent.image}
            categoryName={category.name}
          />
        )}

        {/* 3. Explore Our Collection */}
        <HeadingDescription
          heading="Explore Our Collection"
          text={`Shop By ${category.name}`}
          description={`Discover products in ${category.name}`}
        />
      </div>

      {/* Products Section */}
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading products...</div>}>
        <ProductSection filters={filters} slug={category.slug} />
      </Suspense>

      <div className="container mx-auto px-5">
        {/* 4. Frequently Asked Questions (Products ke baad) */}
        {currentContent && currentContent.faqs && currentContent.faqs.length > 0 && (
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
              {currentContent.faqs.map((faq: { question: string; answer: string }, index: number) => (
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