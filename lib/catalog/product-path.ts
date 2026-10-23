type ProductPathInput = {
  slug: string;
  subcategory_slug?: string | null;
  category_slug?: string | null;
};

/**
 * Returns the base URL dynamically based on environment:
 * - Client-side: window.location.origin (e.g. http://localhost:3002, https://asian-spices-dev-web.vercel.app, https://asianspices.online)
 * - Server-side (Vercel preview/dev): VERCEL_URL (e.g. https://asian-spices-dev-web.vercel.app)
 * - Server-side (Local): NEXT_PUBLIC_SITE_URL or http://localhost:3002
 * - Server-side (Production): NEXT_PUBLIC_SITE_URL or https://asianspices.online
 */
export function getProductBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  // Vercel preview / dev deployments
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim()}`.replace(/\/+$/, "");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    const withProto = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
    return withProto.replace(/\/+$/, "");
  }

  const vercelUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    const withProto = vercelUrl.startsWith("http")
      ? vercelUrl
      : `https://${vercelUrl}`;
    return withProto.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3002";
  }

  return "https://asianspices.online";
}

/** Product relative path: /{subcategory}/{product-slug}, or category slug when no subcategory. */
export function getProductRelativePath(
  product: ProductPathInput,
  fallbackSegment = "products",
): string {
  const segment =
    product?.subcategory_slug?.trim() ||
    product?.category_slug?.trim() ||
    fallbackSegment;
  const slug = product?.slug?.trim() || "";
  return `/${segment}/${slug}`.replace(/\/+/g, "/");
}

/** Product detail full URL: {origin}/{subcategory}/{product-slug} */
export function getProductPath(
  product: ProductPathInput,
  fallbackSegment = "products",
): string {
  const relativePath = getProductRelativePath(product, fallbackSegment);
  const baseUrl = getProductBaseUrl();
  return `${baseUrl}${relativePath}`;
}

