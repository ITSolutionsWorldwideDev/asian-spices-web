// apps/web/app/foods-beverages/[slug]/page.tsx

import ProductDescrption from "@/components/layout/productdescpage/DescMain";
import ProductNotFound from "@/components/layout/productdescpage/ProductNotFound";
import { getProductBySlug, getRelatedProducts } from "@/lib/dbactions/products";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product || !product.id) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.description || "Product details",
  };
}

export default async function FoodAndBeveragesDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.id) {
    return (
      <div className="bg-gray-50">
        <ProductNotFound />
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(product.category_id);

  return (
    <ProductDescrption product={product} relatedProducts={relatedProducts} />
  );
}

/* import FoodAndBeverages from "@/components/layout/FoodAndBeverages/FoodAndBeverages";
import FoodAndBeveragesProductDesc from "@/components/layout/productdescallpages/FoodAndBeveragesProductDesc";
import React from "react";

const page = () => {
  return (
    <div>
      <FoodAndBeveragesProductDesc />
    </div>
  );
};

export default page;
 */
