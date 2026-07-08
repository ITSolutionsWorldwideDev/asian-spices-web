// app/spices/[slug]/page.tsx

import ProductDescrption from "@/components/layout/productdescpage/DescMain";
import ProductNotFound from "@/components/layout/productdescpage/ProductNotFound";
import { getProductBySlug, getRelatedProducts } from "@/lib/dbactions/products";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // 🟢 ADDED: Type definition for URL search queries
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const country = (sParams?.country as string) || "NL";

  const product = await getProductBySlug(slug, country);

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

export default async function SpicesDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const country = (sParams?.country as string) || "NL";

  const product = await getProductBySlug(slug, country);

  if (!product || !product.id) {
    return (
      <div className="bg-gray-50">
        <ProductNotFound />
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(product.category_id, country);

  return (
    <ProductDescrption product={product} relatedProducts={relatedProducts} />
  );
}
