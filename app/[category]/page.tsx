import type { Metadata } from "next";
import { Suspense } from "react";

import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import FilterSidebar from "@/components/layout/products/FilterSidebar";
import InfiniteProducts from "@/components/layout/products/InfiniteProducts";
import SortDropdown from "@/components/layout/product_filter_search/SortDropdown";
import { getStoreCategoryBySlug } from "@/lib/dbactions/categories";
import { getBrands, getProducts, getSubcategories } from "@/lib/dbactions/products";
import { categoryContent } from "@/data/categoryContent"; // Content data import kiya
import CategoryHeroDescription from "@/components/layout/category/CategoryHeroDescription";
import { parseCategoryGuide } from "@/lib/category-helpers";

function formatHeroHeading(heading: string, fallbackName: string) {
  const trimmed = heading?.trim();
  if (!trimmed) return `Explore Our ${fallbackName}`;
  if (/^explore\s+our\s+/i.test(trimmed)) return trimmed;
  if (/^explore\s+/i.test(trimmed)) {
    return trimmed.replace(/^explore\s+/i, "Explore Our ");
  }
  return `Explore Our ${trimmed}`;
}

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
  const guideData = parseCategoryGuide(currentContent, category.name);

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
    <div className="bg-white min-h-screen">
      {/* Top Floating / Fixed Nav */}
      <Nav />

      {/* 1. Dedicated Hero Section Wrapper */}
      <section className="relative w-full bg-gradient-to-b from-[#fbf9f5] via-[#faf7f2]/50 to-white pt-2 sm:pt-2 md:pt-3 xl:pt-4 pb-2 sm:pb-4 border-b border-gray-100/60">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Breadcrumb: Home Page > {category.name} */}
          <nav aria-label="Breadcrumb" className="mb-0.5 sm:mb-1 text-[11px] sm:text-xs text-gray-500">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-gray-900 transition font-normal">
                Home Page
              </Link>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-700 font-medium">{category.name}</span>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-5xl lg:max-w-6xl mx-auto pt-0 pb-0.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-extrabold tracking-tight text-red-600 leading-tight">
              {formatHeroHeading(guideData.bannerHeading, category.name)}
            </h1>
            <CategoryHeroDescription
              initialText={guideData.bannerText}
              extendedText={guideData.extendedText}
            />
          </div>
        </div>
      </section>

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