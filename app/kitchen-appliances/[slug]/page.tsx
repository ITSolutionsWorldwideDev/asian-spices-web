// app/kitchen-appliances/[slug]/page.tsx

import ProductDescrption from "@/components/layout/productdescpage/DescMain";
import ProductNotFound from "@/components/layout/productdescpage/ProductNotFound";
import {
  getProductBySlug,
  getProductReviewsSummary,
  getRelatedProducts,
} from "@/lib/dbactions/products";
import { getProductMetadata } from "@/lib/product-metadata";
import { getProductJsonLd } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

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

  return getProductMetadata(product, "Kitchen Appliances");
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

  const [relatedProducts, reviewStats] = await Promise.all([
    getRelatedProducts(product.category_id),
    getProductReviewsSummary(product.id),
  ]);

  return (
    <>
      <JsonLd data={getProductJsonLd(product, reviewStats)} />
      <ProductDescrption
        product={product}
        relatedProducts={relatedProducts}
        category="Kitchen Appliances"
      />
    </>
  );
}
