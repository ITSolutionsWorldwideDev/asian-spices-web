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
    "supports-immunity": "2d9352553931e5c819d797c2021f90b6cc5487cb (1).webp",
    "aids-digestion": "2d9352553931e5c819d797c2021f90b6cc5487cb (1).webp",
    "promotes-relaxation": "2d9352553931e5c819d797c2021f90b6cc5487cb (1).webp",
    "enhances-energy-levels":
      "2d9352553931e5c819d797c2021f90b6cc5487cb (1).webp",

    capsules: "2d9352553931e5c819d797c2021f90b6cc5487cb (1).webp",
    powders: "4777fae28bf8c8529b660c5ef85ae3659de6d557.webp",
    teas: "b4158a315fa57749b144b6d49c4f448d4a4d7249.webp",

    "face-oils": "d2cb8935bb558e99e2e4b28b0b9676798515ab77.webp",
    creams: "820d80edf257bfaaafaf9f554b155a673f1442d5 (1).webp",
    cleansers: "06e813a64e3ac39522ae949f8180359993726b4d.webp",

    "hair-oils": "58fc0fa164ef0ee9e82f34ad3160c3b9c3e8657c.webp",
    shampoos: "58fc0fa164ef0ee9e82f34ad3160c3b9c3e8657c (1).webp",
    "hair-masks": "fecb41921011cc0e5db4dbd75df119f1ea19d248.webp",
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

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 container mx-auto p-5">
        <FilterSidebar subcategories={subcategories} brands={brands} />

        <div>
          <SortDropdown />

          <InfiniteProducts initialProducts={products} filters={filters} />
        </div>
      </div>

      <Reviews />
      <Footer />
    </div>
  );
}

// export default HealthyLivingProductpage;
