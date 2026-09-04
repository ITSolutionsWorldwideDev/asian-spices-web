import type { Metadata } from "next";

const SITE_NAME = "AsianSpices.online";
const META_TITLE_MAX = 60;
const META_DESCRIPTION_MAX = 160;

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateAtWord(text: string, maxLength: number): string {
  const cleaned = text.trim();
  if (maxLength <= 0) return "";
  if (cleaned.length <= maxLength) return cleaned;

  const truncated = cleaned.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.6) {
    return truncated.slice(0, lastSpace).trim();
  }

  return truncated.trim();
}

function clampMeta(text: string, maxLength: number): string {
  return truncateAtWord(text, maxLength);
}

export function buildProductMetaTitle(
  productTitle: string,
  category: string,
): string {
  const title = productTitle.trim();
  const categoryLabel = category.trim() || "Products";
  const brandSuffix = ` | ${SITE_NAME}`;

  // Prefer: {Product} – {Category} | AsianSpices.online
  const withCategory = `${title} – ${categoryLabel}${brandSuffix}`;
  if (withCategory.length <= META_TITLE_MAX) {
    return withCategory;
  }

  // Next: {Product} | AsianSpices.online
  const withoutCategory = `${title}${brandSuffix}`;
  if (withoutCategory.length <= META_TITLE_MAX) {
    return withoutCategory;
  }

  // Shorten product name to fit brand suffix
  const maxTitleLength = META_TITLE_MAX - brandSuffix.length;
  const shortTitle = truncateAtWord(title, maxTitleLength);
  return clampMeta(`${shortTitle}${brandSuffix}`, META_TITLE_MAX);
}

export function buildProductMetaDescription(
  productTitle: string,
  description?: string | null,
): string {
  const title = productTitle.trim();
  const suffix = `. Fast NL delivery | ${SITE_NAME}`;
  const prefixTemplate = (name: string) =>
    `${name} online in the Netherlands. `;
  const fallbackSnippet =
    "Shop authentic Asian ingredients with trusted quality and freshness";

  const plainDescription = stripHtml(description || "");
  let snippet = (plainDescription || fallbackSnippet).replace(/[.\s]+$/, "");

  // Keep enough room for prefix + suffix; shorten product name in prefix if needed
  let nameForPrefix = title;
  let prefix = prefixTemplate(nameForPrefix);
  let maxSnippetLength =
    META_DESCRIPTION_MAX - prefix.length - suffix.length;

  if (maxSnippetLength < 20) {
    const reserved = " online in the Netherlands. ".length + suffix.length + 20;
    nameForPrefix = truncateAtWord(
      title,
      Math.max(10, META_DESCRIPTION_MAX - reserved),
    );
    prefix = prefixTemplate(nameForPrefix);
    maxSnippetLength = META_DESCRIPTION_MAX - prefix.length - suffix.length;
  }

  if (maxSnippetLength > 0) {
    snippet = truncateAtWord(snippet, maxSnippetLength).replace(/[.\s]+$/, "");
  } else {
    snippet = "";
  }

  const descriptionText = snippet
    ? `${prefix}${snippet}${suffix}`
    : `${prefix.replace(/\.\s*$/, "")}${suffix}`;

  return clampMeta(descriptionText, META_DESCRIPTION_MAX);
}

/** Preferred product URL — matches sitemap (`/{subcategory|category}/{slug}`). */
export function getProductCanonicalPath(product: {
  slug: string;
  subcategory_slug?: string | null;
  category_slug?: string | null;
}): string {
  if (product.subcategory_slug) {
    return `/${product.subcategory_slug}/${product.slug}`;
  }
  if (product.category_slug) {
    return `/${product.category_slug}/${product.slug}`;
  }
  return `/${product.slug}`;
}

export function getProductMetadata(
  product: {
    name: string;
    slug: string;
    description?: string | null;
    category_name?: string | null;
    category_slug?: string | null;
    subcategory_slug?: string | null;
  },
  categoryFallback?: string,
): Metadata {
  const category = product.category_name || categoryFallback || "Products";

  return {
    title: buildProductMetaTitle(product.name, category),
    description: buildProductMetaDescription(product.name, product.description),
    alternates: {
      canonical: getProductCanonicalPath(product),
    },
  };
}
