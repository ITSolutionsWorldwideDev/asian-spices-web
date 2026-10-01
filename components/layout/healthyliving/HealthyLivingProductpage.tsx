import React from "react";
import ProductHeader from "./ProductHeader";
import HeadingDescription from "@/components/ui/HeadingDescription";
import Footer from "@/components/ui/Footer";
import ComingSoonCategory from "@/components/ui/ComingSoonCategory";
import GrandmasRemedyGrid from "@/components/ui/GrandmasRemedyGrid";
import CategoryGuideSection from "@/components/layout/category/CategoryGuideSection";
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
    isHerbBenefitPage && currentContent.faqs?.length
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

  return (
    <div>
      <JsonLd data={faqJsonLd} />
      {/* 1. Banner Header */}
      <ProductHeader
        heading={currentContent.heading}
        text={currentContent.text}
        imageLink={currentContent.image}
      />

      {/* 2. Herb Benefit Content */}
      {isHerbBenefitPage && (currentContent.intro || currentContent.sections) && (
        <section className="container mx-auto px-5 py-10">
          {isGrandmasPage ? (
            <GrandmasRemedyGrid sections={currentContent.sections ?? []} />
          ) : (
            <CategoryGuideSection
              sections={currentContent.sections ?? []}
              categoryName={slug}
              hideReadMore={true}
            />
          )}
        </section>
      )}

      {/* 3. Explore Our Collection Section */}
      <HeadingDescription
        heading="Explore Our Collection"
        text={`Shop All ${slug.replace(/-/g, " ").toUpperCase()}`}
        description="Discover authentic health and wellness products curated for you"
      />

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
      {isHerbBenefitPage && currentContent.faqs && currentContent.faqs.length > 0 && (
        <section className="container mx-auto px-5 py-16 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-500 text-sm">
              Got questions? Weve got answers.
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
