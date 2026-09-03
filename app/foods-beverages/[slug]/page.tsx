// app/foods-beverages/[slug]/page.tsx

import { cache } from "react";
import ProductDescrption from "@/components/layout/productdescpage/DescMain";
import ProductNotFound from "@/components/layout/productdescpage/ProductNotFound";
import { getProductBySlug, getRelatedProducts } from "@/lib/dbactions/products";
import { resolveCountry } from "@/lib/country";
import { getProductMetadata } from "@/lib/product-metadata";

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

  const relatedProducts = await getRelatedProducts(
    product.category_id,
    country,
  );

  const serializedProduct = JSON.parse(JSON.stringify(product));
  const serializedRelatedProducts = JSON.parse(JSON.stringify(relatedProducts || []));

  return (
    <ProductDescrption
      product={serializedProduct}
      relatedProducts={serializedRelatedProducts}
      category="Foods & Beverages"
    />
  );
}


  // return (
  //   <ProductDescrption
  //     product={product}
  //     relatedProducts={relatedProducts}
  //     category="Foods & Beverages"
  //   />
  // );