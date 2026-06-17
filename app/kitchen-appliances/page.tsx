// app/kitchen-appliances/page.tsx

import Footer from "@/components/ui/Footer";
import HeadingDescription from "@/components/ui/HeadingDescription";
import ProductPageHeader from "@/components/ui/ProductPageHeader";
// import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Reviews from "@/components/ui/Reviews";

import {
  getBrands,
  getProducts,
  getSubcategories,
} from "@/lib/dbactions/products";

import FilterSidebar from "@/components/layout/products/FilterSidebar";
import InfiniteProducts from "@/components/layout/products/InfiniteProducts";
import SortDropdown from "@/components/layout/product_filter_search/SortDropdown";
import ComingSoonCategory from "@/components/ui/ComingSoonCategory";

interface PageProps {
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

export const metadata = {
  title: "Kitchen Appliances - Coming Soon | Asian Spices",
  description:
    "Premium kitchen appliances are coming soon. Join our waitlist and be notified when we launch.",
};

export default async function KitchenAppliancesPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const cleanArray = (val?: string) => {
    if (!val) return [];

    return val
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "" && v !== "null" && v !== "undefined");
  };

  const filters: Filters = {
    category: "kitchen-appliances",
    subcategories: cleanArray(params.subcategories),
    brands: cleanArray(params.brands),
    minPrice: params.min,
    maxPrice: params.max,
    search: params.search,
    page: Number(params.page || 1),
  };

  const subcategories = await getSubcategories("kitchen-appliances");
  const brands = await getBrands();

  const products = await getProducts(filters);

  return (
    <div className="category-animation">
      <ProductPageHeader
        heading="Cook with Confidence, Live with Ease"
        text="From ovens to blenders, our appliances combine durability, style, and innovation to make everyday meals extraordinary."
        videoLink="/kitchens/Comp 1_9.mp4"
      />

      <HeadingDescription
        heading="Explore Our Collection"
        text="Shop By All Kitchen Appliances"
        description="Discover authentic quality appliances from across Asia"
      />

      <ComingSoonCategory />

      {/* <div className="grid lg:grid-cols-[260px_1fr] gap-6 container mx-auto p-5">
        <FilterSidebar subcategories={subcategories} brands={brands} />

        <div>
          <SortDropdown />

          <InfiniteProducts initialProducts={products} filters={filters} />
        </div>
      </div> */}

      {/* <RegisterOnApp /> */}
      {/* <Reviews /> */}
      <Footer />
    </div>
  );
}
