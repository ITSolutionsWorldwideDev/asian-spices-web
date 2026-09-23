import { Suspense } from "react";
import Image from "next/image";
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
      {/* 1. Header Banner */}
      <ProductPageHeader
        heading={category.name}
        text={`Shop ${category.name}`}
        videoLink="/spices/Comp 1_10.mp4"
      />

      {/* Breadcrumb / Title */}
      <div className="container mx-auto px-5 pt-6 text-sm sm:text-base">
        <p className="font-medium text-gray-900">{category.name}</p>
      </div>

      {/* 2. SECTION 2 (Hero ke foran baad - Intro Content & Image) */}
      {currentContent && currentContent.sections && (
        <section className="container mx-auto px-5 py-12">
          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-12 lg:gap-16">
            {/* Left Side: Text Content */}
            <div className="flex-1 flex flex-col justify-between gap-6">
              {currentContent.sections.map((section: { title: string; description: string }, index: number) => (
                <div key={index} className="flex flex-col items-start">
                  <span className="inline-block border border-[#f2ab92] text-[#d95325] text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full mb-3">
                    GUIDE
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

            {/* Right Side: Image */}
            {currentContent.image && (
              <div className="w-full lg:w-[45%] flex">
                <div className="relative w-full h-full min-h-[350px] rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] bg-neutral-100">
                  <Image
                    src={currentContent.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Explore Our Collection */}
      <HeadingDescription
        heading="Explore Our Collection"
        text={`Shop By ${category.name}`}
        description={`Discover products in ${category.name}`}
      />

      {/* Products Section */}
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading products...</div>}>
        <ProductSection filters={filters} slug={category.slug} />
      </Suspense>

      {/* 4. Frequently Asked Questions (Products ke baad) */}
      {currentContent && currentContent.faqs && currentContent.faqs.length > 0 && (
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

      <Footer />
    </div>
  );
}