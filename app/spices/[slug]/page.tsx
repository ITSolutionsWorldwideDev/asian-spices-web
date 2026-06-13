// apps/web/app/spices/[slug]/page.tsx

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

export default async function SpicesDetailPage({ params }: PageProps) {
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

/* import SpicesProductDesc from "@/components/layout/productdescallpages/SpicesProductDesc";
import React from "react";

const spicesDetailPage = () => {
  return (
    <div>
      <SpicesProductDesc />
    </div>
  );
};

export default spicesDetailPage;
 */
