// /[category]/[slug]/[product] — product detail
// e.g. /beverages/coffee/bru-instant-coffee

import { cache } from "react";
import { notFound } from "next/navigation";
import ProductDescrption from "@/components/layout/productdescpage/DescMain";
import ProductNotFound from "@/components/layout/productdescpage/ProductNotFound";
import {
  getStoreCategoryBySlug,
  getStoreSubcategoryBySlug,
} from "@/lib/dbactions/categories";
import { getProductBySlug, getRelatedProducts } from "@/lib/dbactions/products";
import { resolveCountry } from "@/lib/country";
import { getProductMetadata } from "@/lib/product-metadata";

interface PageProps {
  params: Promise<{ category: string; slug: string; product: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const cachedGetProduct = cache(async (slug: string, country: string) =>
  getProductBySlug(slug, country),
);

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { product: productSlug } = await params;
  const sParams = await searchParams;
  const country = await resolveCountry(sParams?.country);
  const product = await cachedGetProduct(productSlug, country);
  if (!product?.id) return { title: "Product not found" };
  return getProductMetadata(product, product.category_name || undefined);
}

export default async function CategorySubcategoryProductPage({
  params,
  searchParams,
}: PageProps) {
  const {
    category: categorySlug,
    slug: subcategorySlug,
    product: productSlug,
  } = await params;

  const [category, subcategory] = await Promise.all([
    getStoreCategoryBySlug(categorySlug),
    getStoreSubcategoryBySlug(categorySlug, subcategorySlug),
  ]);

  if (!category || !subcategory) notFound();

  const sParams = await searchParams;
  const country = await resolveCountry(sParams?.country);
  const product = await cachedGetProduct(productSlug, country);

  if (!product?.id) {
    return (
      <div className="bg-gray-50">
        <ProductNotFound />
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(product.category_id, country);

  return (
    <ProductDescrption
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts || []))}
      category={product.category_name || category.name}
    />
  );
}
