import React from "react";
import ProductHeader from "./ProductHeader";
import HeadingDescription from "@/components/ui/HeadingDescription";

import Reviews from "@/components/ui/Reviews";
import Footer from "@/components/ui/Footer";

import {
  getBrands,
  getProducts,
  getSubcategories,
} from "@/lib/dbactions/products";

import FilterSidebar from "@/components/layout/products/FilterSidebar";
import InfiniteProducts from "@/components/layout/products/InfiniteProducts";
import SortDropdown from "@/components/layout/product_filter_search/SortDropdown";

interface PageProps {
  slug: string;
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

// type props = {
//   slug: string;
// };

type AllowedSlug =
  | "supports-immunity"
  | "aids-digestion"
  | "promotes-relaxation"
  | "enhances-energy-levels"
  | "capsules"
  | "powders"
  | "teas"
  | "face-oils"
  | "creams"
  | "cleansers"
  | "hair-oils"
  | "shampoos"
  | "hair-masks";

// const HealthyLivingProductpage = ({ slug }: props) => {

export default async function HealthyLivingProductpage({
  slug,
  searchParams,
}: PageProps) {
  const resolvedParams = await searchParams;

  const allowedSlugs: AllowedSlug[] = [
    "supports-immunity",
    "aids-digestion",
    "promotes-relaxation",
    "enhances-energy-levels",
    "capsules",
    "powders",
    "teas",
    "face-oils",
    "creams",
    "cleansers",
    "hair-oils",
    "shampoos",
    "hair-masks",
  ];

  const slugToImage: Record<AllowedSlug, string> = {
    "supports-immunity": "supports-immunity.png",
    "aids-digestion": "aids-digestion.png",
    "promotes-relaxation": "promotes-relaxation.png",
    "enhances-energy-levels": "enhances-energy-levels.png",

    capsules: "capsules.png",
    powders: "powders.png",
    teas: "teas.png",

    "face-oils": "face-oils.png",
    creams: "creams.png",
    cleansers: "cleansers.png",

    "hair-oils": "hair-oils.png",
    shampoos: "shampoos.png",
    "hair-masks": "hair-masks.png",
  };

  if (!allowedSlugs.includes(slug as AllowedSlug)) {
    return (
      <div className="p-10 text-center font-bold text-red-500">
        Invalid slug
      </div>
    );
  }

  const image = slugToImage[slug as AllowedSlug];

  const cleanArray = (val?: string) => {
    if (!val) return [];

    return val
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "" && v !== "null" && v !== "undefined");
  };

  const filters: Filters = {
    category: "healthy-living",
    subcategories: cleanArray(resolvedParams.subcategories),
    brands: cleanArray(resolvedParams.brands),
    minPrice: resolvedParams.min,
    maxPrice: resolvedParams.max,
    search: resolvedParams.search,
    page: Number(resolvedParams.page || 1),
  };

  const subcategories = await getSubcategories("healthy-living", filters);
  const brands:any = [];// await getBrands();

  const products = await getProducts(filters);

  return (
    <div>
      <ProductHeader
        heading="Every Grain, A Burst of Taste"
        text="Handpicked, pure, and powerful  our spices bring depth, warmth, and character to every recipe"
        imageLink={image}
      />
      <HeadingDescription
        heading="Explore Our Collection"
        text="Shop By All Health Products"
        description="Discover authentic Health Products from across Asia"
      />

      <div className="relative z-0 grid lg:grid-cols-[260px_1fr] gap-6 container mx-auto p-5">
        <FilterSidebar subcategories={subcategories} brands={brands} />

        <div className="relative z-0 min-w-0 bg-white">
          <SortDropdown />

          <InfiniteProducts initialProducts={products} filters={filters} />
        </div>
      </div>

      {/* <Reviews /> */}
      <Footer />
    </div>
  );
}

// export default HealthyLivingProductpage;
