type ProductPathInput = {
  slug: string;
  subcategory_slug?: string | null;
  category_slug?: string | null;
};

/** Product detail URL: /{subcategory}/{product-slug}, or category slug when no subcategory. */
export function getProductPath(
  product: ProductPathInput,
  fallbackSegment = "products",
): string {
  const segment =
    product.subcategory_slug?.trim() ||
    product.category_slug?.trim() ||
    fallbackSegment;
  return `/${segment}/${product.slug}`.replace(/\/+/g, "/");
}
