import React from "react";
import ProductHeader from "./ProductHeader";
import HeadingDescription from "@/components/ui/HeadingDescription";
import Footer from "@/components/ui/Footer";
import Image from "next/image"; // 1. Sabse upar yeh import lazmi hona chahiye

import {
  getBrands,
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
  AllowedSlug 
} from "@/data/healthyLivingData";
import { getFaqPageJsonLd } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

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
}: PageProps) {
  const resolvedParams = params ? await params : { slug: "" };
  const resolvedSearch = searchParams ? await searchParams : {};
  const slug = resolvedParams?.slug;

  const allowedSlugs = Object.keys(slugContent) as AllowedSlug[];

  if (!allowedSlugs.includes(slug as AllowedSlug)) {
    return (
      <div className="p-10 text-center font-bold text-red-500">
        Invalid slug
      </div>
    );
  }

  const currentSlugTyped = slug as AllowedSlug;
  const currentContent = slugContent[currentSlugTyped];
  const isHerbBenefitPage = herbBenefitSlugs.includes(currentSlugTyped);
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

  const filters: Filters = {
    category: "healthy-living",
    subcategories: cleanArray(resolvedSearch.subcategories),
    brands: cleanArray(resolvedSearch.brands),
    minPrice: resolvedSearch.min,
    maxPrice: resolvedSearch.max,
    search: resolvedSearch.search,
    page: Number(resolvedSearch.page || 1),
  };

  const subcategories = await getSubcategories("healthy-living", filters);
  const brands: string[] = [];
  const products = await getProducts(filters);

  return (
    <div>
      <JsonLd data={faqJsonLd} />
      {/* 1. Banner Header */}
      <ProductHeader
        heading={currentContent.heading}
        text={currentContent.text}
        imageLink={currentContent.image}
      />

      {/* 2. Herb Benefit Content — Cards Grid for Grandma's Page (5 per row) / Standard Layout for Others */}
      {isHerbBenefitPage && (currentContent.intro || currentContent.sections) && (
        <section className="container mx-auto px-5 py-16">
          {isGrandmasPage ? (
            /* --- GRANDMA'S PAGE: 10 Cards layout in 5-column grid rows --- */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {currentContent.sections?.map((section, index) => (
                <div 
                  key={index} 
                  className="p-5 rounded-2xl border border-neutral-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-md"
                >
                  <div>
                    <span className="inline-block border border-[#f2ab92] text-[#d95325] text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full mb-3">
                      REMEDY {index + 1}
                    </span>
                    <h3 className="text-base font-bold text-neutral-900 mb-2 leading-snug">
                      {section.title}
                    </h3>
                  </div>

                  {/* Popup / Expandable Details for full recipe and tradition */}
                  <details className="group mt-4 pt-3 border-t border-neutral-100">
                    <summary className="text-[#d95325] font-semibold text-xs cursor-pointer list-none flex items-center justify-between hover:underline">
                      <span>View Recipe</span>
                      <span className="transition-transform group-open:rotate-180 text-xs">▼</span>
                    </summary>
                    <div className="mt-3 text-neutral-600 text-xs leading-relaxed whitespace-pre-line bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                      {section.description}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          ) : (
<div className="flex flex-col lg:flex-row items-stretch justify-between gap-12 lg:gap-16">
  {/* Left Side: Text Content */}
  <div className="flex-1 flex flex-col justify-between gap-10">
    {currentContent.sections?.map((section, index) => (
      <div key={index} className="flex flex-col items-start">
        <span className="inline-block border border-[#f2ab92] text-[#d95325] text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full mb-3">
          WELLNESS GUIDE
        </span>
        
        <h2 className="text-xl md:text-2xl font-bold text-[#111111] leading-snug mb-3">
          {section.title}
        </h2>
        
        <p className="text-[#666666] text-xs md:text-sm leading-relaxed mb-3 whitespace-pre-line">
          {section.description}
        </p>
      </div>
    ))}
  </div>

  {/* Right Side: Image matching full text height */}
  <div className="w-full lg:w-[45%] flex">
    <div className="relative w-full h-full min-h-[400px] rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] bg-neutral-100">
      <Image
        src={`/assets/herbs/${currentContent.sectionImage || currentContent.image}`}
        alt="Herbal ingredients"
        fill
        sizes="(max-width: 768px) 100vw, 45vw"
        className="object-cover"
      />
    </div>
  </div>
</div>
          )}
        </section>
      )}

      {/* 3. Explore Our Collection Section */}
      <HeadingDescription
        heading="Explore Our Collection"
        text={`Shop All ${slug.replace(/-/g, " ").toUpperCase()}`}
        description="Discover authentic health and wellness products curated for you"
      />

      {/* 4. Products Grid with Sidebar Filters */}
      <div className="relative z-0 grid lg:grid-cols-[260px_1fr] gap-6 container mx-auto p-5">
        <FilterSidebar subcategories={subcategories} brands={brands} />

        <div className="relative z-0 min-w-0 bg-white">
          <SortDropdown />
          <InfiniteProducts initialProducts={products} filters={filters} />
        </div>
      </div>

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
                <span className="font-bold text-neutral-900">Disclaimer:</span> Always consult with a qualified healthcare professional or clinical herbalist before introducing new botanical remedies into your wellness routine, particularly if taking prescription medications or during pregnancy.
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