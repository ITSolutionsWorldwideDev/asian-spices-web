// app/products/page.tsx

import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import CategoryHeroDescription from "@/components/features/category/CategoryHeroDescription";
import { allProductsContent, allProductsFaqs } from "@/data/allProductsContent";
import { getFaqPageJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Shop All Products | Asian Spices & Groceries - Netherlands",
  description:
    "Explore our full product range - spices, rice, lentils, snacks and pantry staples. Authentic Asian groceries delivered across the Netherlands.",
  alternates: {
    canonical: "/products",
  },
};

import FilterSidebar from "@/components/features/products/FilterSidebar";
import InfiniteProducts from "@/components/features/products/InfiniteProducts";
import SortDropdown from "@/components/features/products/filters/SortDropdown";

import { getBrands, getCategories, getProducts } from "@/lib/dbactions/products";

interface PageProps {
  searchParams: Promise<{
    subcategories?: string;
    brands?: string;
    min?: string;
    max?: string;
    rate?: string;
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
  rate?: string | number;
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
    rate: params.rate,
    search: params.search,
    sort: params.sort || "newest",
    page: Number(params.page || 1),
  };

  const faqJsonLd = getFaqPageJsonLd(allProductsFaqs);

  return (
    <div className="bg-white min-h-screen">
      <Nav />

      {/* 1. Dedicated Hero Section Wrapper (Matching Category Page Architecture) */}
      <section className="relative w-full bg-gradient-to-b from-[#fbf9f5] via-[#faf7f2]/50 to-white pt-2 sm:pt-2 md:pt-3 xl:pt-4 pb-2 sm:pb-4 border-b border-gray-100/60">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Breadcrumb: Home Page > All Products */}
          <nav
            aria-label="Breadcrumb"
            className="mb-0.5 sm:mb-1 text-[11px] sm:text-xs text-gray-500"
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href="/"
                className="hover:text-gray-900 transition font-normal"
              >
                Home Page
              </Link>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-700 font-medium">All Products</span>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-5xl lg:max-w-6xl mx-auto pt-0 pb-0.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-extrabold tracking-tight text-red-600 leading-tight">
              {allProductsContent.heading}
            </h1>
            <CategoryHeroDescription
              initialText={allProductsContent.initialText}
              extendedText={allProductsContent.extendedText}
            />
          </div>
        </div>
      </section>

      {/* 2. Products Section */}
      <Suspense
        fallback={
          <div className="text-center py-20 text-gray-500">
            Loading products...
          </div>
        }
      >
        <ProductSection filters={filters} />
      </Suspense>

      {/* 3. Frequently Asked Questions (Below Products) */}
      <div className="container mx-auto px-5">
        <section className="py-16 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-500 text-sm">
              Got questions? We&apos;ve got answers.
            </p>
          </div>

          <div className="space-y-4">
            {allProductsFaqs.map((faq, index) => (
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
      </div>

      <Footer />

      {/* 4. FAQPage Schema */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </div>
  );
}
