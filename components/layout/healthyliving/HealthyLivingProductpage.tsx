import React from "react";
import Link from "next/link";
import Nav from "@/components/ui/Nav";
import CategoryHeroDescription from "@/components/layout/category/CategoryHeroDescription";
import Footer from "@/components/ui/Footer";
import ComingSoonCategory from "@/components/ui/ComingSoonCategory";
import GrandmasRemedyGrid from "@/components/ui/GrandmasRemedyGrid";
import {
  getProducts,
  getSubcategories,
} from "@/lib/dbactions/products";

import FilterSidebar from "@/components/layout/products/FilterSidebar";
import InfiniteProducts from "@/components/layout/products/InfiniteProducts";
import SortDropdown from "@/components/layout/product_filter_search/SortDropdown";
import Reviews from "@/components/ui/Reviews";

import {
  slugContent,
  herbBenefitSlugs,
  AllowedSlug,
} from "@/data/healthyLivingData";
import { getFaqPageJsonLd } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

interface CatalogMatch {
  categorySlug: string;
  categoryName: string;
  subcategoryId: string | null;
  subcategorySlug: string | null;
  subcategoryName: string | null;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    subcategories?: string;
    brands?: string;
    min?: string;
    max?: string;
    search?: string;
    page?: string;
  }>;
  catalogMatch: CatalogMatch | null;
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

export default async function HealthyLivingProductpage({
  params,
  searchParams,
  catalogMatch,
}: PageProps) {
  const resolvedParams = params ? await params : { slug: "" };
  const resolvedSearch = searchParams ? await searchParams : {};
  const slug = resolvedParams?.slug;

  const allowedSlugs = Object.keys(slugContent) as AllowedSlug[];
  const hasSlugContent = allowedSlugs.includes(slug as AllowedSlug);
  const currentSlugTyped = hasSlugContent ? (slug as AllowedSlug) : null;
  const currentContent = currentSlugTyped
    ? slugContent[currentSlugTyped]
    : {
        heading:
          catalogMatch?.subcategoryName ||
          catalogMatch?.categoryName ||
          slug.replace(/-/g, " "),
        text: `Shop ${
          catalogMatch?.subcategoryName ||
          catalogMatch?.categoryName ||
          slug.replace(/-/g, " ")
        }`,
        image: "capsules.png",
      };
  const isHerbBenefitPage = currentSlugTyped
    ? herbBenefitSlugs.includes(currentSlugTyped)
    : false;
  const isGrandmasPage = slug === "grandmas-kitchen-remedies";
  const faqJsonLd =
    currentContent.faqs?.length
      ? getFaqPageJsonLd(currentContent.faqs)
      : null;

  const cleanArray = (val?: string) => {
    if (!val) return [];

    return val
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "" && v !== "null" && v !== "undefined");
  };

  const urlSubcategories = cleanArray(resolvedSearch.subcategories);
  const filters: Filters | null = catalogMatch
    ? {
        category: catalogMatch.categorySlug,
        subcategories:
          urlSubcategories.length > 0
            ? urlSubcategories
            : catalogMatch.subcategoryId
              ? [catalogMatch.subcategoryId]
              : [],
        brands: cleanArray(resolvedSearch.brands),
        minPrice: resolvedSearch.min,
        maxPrice: resolvedSearch.max,
        search: resolvedSearch.search,
        page: Number(resolvedSearch.page || 1),
      }
    : null;

  const [subcategories, products] = filters
    ? await Promise.all([
        getSubcategories(catalogMatch!.categorySlug, filters),
        getProducts(filters),
      ])
    : [[], []];
  const brands: string[] = [];
  const showProductsComingSoon = !filters || products.length === 0;
  const collectionTitle =
    catalogMatch?.subcategoryName ||
    catalogMatch?.categoryName ||
    slug.replace(/-/g, " ");

  const extendedText =
    !isGrandmasPage && currentContent.sections && currentContent.sections.length > 0
      ? currentContent.sections
          .map((s) => `${s.title}\n${s.description}`)
          .join("\n\n")
      : "";

  return (
    <div className="bg-white min-h-screen">
      <JsonLd data={faqJsonLd} />

      {/* Top Floating / Fixed Nav */}
      <Nav />

      {/* 1. Dedicated Hero Section Wrapper (Category Design) */}
      <section className="relative w-full bg-gradient-to-b from-[#fbf9f5] via-[#faf7f2]/50 to-white pt-2 sm:pt-2 md:pt-3 xl:pt-4 pb-2 sm:pb-4 border-b border-gray-100/60">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Breadcrumb: Home Page > Healthy Living > Title */}
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
              <span className="text-gray-500">Healthy Living</span>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-700 font-medium">
                {collectionTitle}
              </span>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-5xl lg:max-w-6xl mx-auto pt-0 pb-0.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-extrabold tracking-tight text-red-600 leading-tight">
              {currentContent.heading || collectionTitle}
            </h1>
            <CategoryHeroDescription
              initialText={currentContent.text}
              extendedText={extendedText}
            />
          </div>
        </div>
      </section>

      {/* 2. Grandma's Kitchen Remedies Grid (Special Interactive Card Layout) */}
      {isGrandmasPage && currentContent.sections && currentContent.sections.length > 0 && (
        <section className="container mx-auto px-5 py-8">
          <GrandmasRemedyGrid sections={currentContent.sections} />
        </section>
      )}

      {/* 4. Products Grid with Sidebar Filters — or Coming Soon when no products */}
      {showProductsComingSoon ? (
        <ComingSoonCategory
          title={collectionTitle}
          description={`We're preparing products for ${collectionTitle}. The rest of this guide is ready — stay tuned for the collection.`}
          features={["Curated Selection", "Natural Wellness", "Coming Soon"]}
        />
      ) : (
        <div className="relative z-0 grid lg:grid-cols-[260px_1fr] gap-6 container mx-auto p-5">
          <FilterSidebar subcategories={subcategories} brands={brands} />

          <div className="relative z-0 min-w-0 bg-white">
            <SortDropdown />
            <InfiniteProducts initialProducts={products} filters={filters!} />
          </div>
        </div>
      )}

      {/* 5. Frequently Asked Questions */}
      {currentContent.faqs && currentContent.faqs.length > 0 && (
        <section className="container mx-auto px-5 py-16 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-500 text-sm">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {currentContent.faqs.map((faq, index) => (
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

      {/* 6. Customer Reviews Component */}
      {isHerbBenefitPage && (
        <section className="container mx-auto px-5 py-12">
          <Reviews />
        </section>
      )}

      {isHerbBenefitPage && (
        <section className="bg-neutral-100 border-t border-neutral-200 py-6">
          <div className="container mx-auto px-5 max-w-5xl">
            <div className="flex items-start gap-4 border-l-4 border-[#ff7733] pl-4">
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-normal">
                <span className="font-bold text-neutral-900">Disclaimer:</span>{" "}
                Always consult with a qualified healthcare professional or
                clinical herbalist before introducing new botanical remedies into
                your wellness routine, particularly if taking prescription
                medications or during pregnancy.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
