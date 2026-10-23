// app/foods-beverages/[slug]/page.tsx

import { cache } from "react";
import ProductDescrption from "@/components/features/products/detail/DescMain";
import ProductNotFound from "@/components/features/products/detail/ProductNotFound";
import {
  getProductBySlug,
  getProductReviewsSummary,
  getRelatedProducts,
} from "@/lib/dbactions/products";
import { resolveCountry } from "@/lib/commerce/country";
import { getProductMetadata } from "@/lib/seo/product-metadata";
import { getProductJsonLd } from "@/lib/seo/schema";
import JsonLd from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const cachedGetProduct = cache(async (slug: string, country: string) => {
  return getProductBySlug(slug, country);
});

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const country = await resolveCountry(sParams?.country);

  // const product = await getProductBySlug(slug, country);
  const product = await cachedGetProduct(slug, country);

  if (!product || !product.id) {
    return {
      title: "Product not found",
    };
  }

  return getProductMetadata(product, "Foods & Beverages");
}

export default async function FoodAndBeveragesDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const country = await resolveCountry(sParams?.country);

  // const product = await getProductBySlug(slug, country);
  const product = await cachedGetProduct(slug, country);

  if (!product || !product.id) {
    return (
      <div className="bg-gray-50">
        <ProductNotFound />
      </div>
    );
  }

  const [relatedProducts, reviewStats] = await Promise.all([
    getRelatedProducts(product.category_id, country),
    getProductReviewsSummary(product.id),
  ]);

  const enrichedProduct = {
    ...product,
    rating: Number(product.rating || reviewStats?.average || 0),
    avg_rating: Number(product.avg_rating || reviewStats?.average || 0),
    reviews: Number(product.reviews || reviewStats?.total || 0),
  };

  const serializedProduct = JSON.parse(JSON.stringify(enrichedProduct));
  const serializedRelatedProducts = JSON.parse(JSON.stringify(relatedProducts || []));

  return (
    <>
      <JsonLd data={getProductJsonLd(enrichedProduct, reviewStats)} />
      <ProductDescrption
        product={serializedProduct}
        relatedProducts={serializedRelatedProducts}
        category="Foods & Beverages"
      />
    </>
  );
}


  // return (
  //   <ProductDescrption
  //     product={product}
  //     relatedProducts={relatedProducts}
  //     category="Foods & Beverages"
  //   />
  // );