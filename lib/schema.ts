/**
 * schema.org JSON-LD builders.
 *
 * Small pure functions that turn existing page data into structured-data
 * objects. Nothing here renders anything — pair with <JsonLd /> (see
 * components/seo/JsonLd.tsx) to emit the <script type="application/ld+json">
 * tag. Keeping this separate from generateMetadata() because Next's
 * Metadata API has no slot for raw JSON-LD.
 */
import { getSiteBaseUrl } from "@/lib/sitemap-urls";
import { getProductCanonicalPath, stripHtml } from "@/lib/product-metadata";

/** Matches the recipe URL convention used across the app (see lib/sitemap-urls.ts). */
function getRecipePath(slug: string): string {
  return `/recipes/${slug}`;
}

export const SITE_NAME = "Asian Spices";

/** Real business details — keep in sync with FooterContent.tsx / contact-us HeroSection.tsx. */
const BUSINESS = {
  name: "Asian Spices",
  legalName: "Asian Spices Online B.V.",
  streetAddress: "Slakkenveen 341",
  postalCode: "3205 GK",
  addressLocality: "Spijkenisse",
  addressCountry: "NL",
  email: "support@asianspices.online",
  telephone: "+31644844844",
  logoPath: "/assets/logo/Group 87.png",
  sameAs: [
    "https://www.facebook.com/asianspices.online/",
    "https://www.instagram.com/asianspicessocial/",
    "https://www.tiktok.com/@asianspices.online",
    "https://www.youtube.com/@AsianSpices-p5c",
    "https://x.com/asianspicee50",
  ],
};

function absoluteUrl(path: string): string {
  if (!path) return path;
  const base = getSiteBaseUrl();
  const full = /^https?:\/\//i.test(path)
    ? path
    : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  // encodeURI is idempotent on already-encoded sequences (leaves "%" alone),
  // so this is safe whether the source path has raw spaces or is pre-encoded.
  return encodeURI(full);
}

export type SchemaReviewStats = {
  average: number | string | null | undefined;
  total: number | string | null | undefined;
} | null | undefined;

function buildAggregateRating(stats: SchemaReviewStats) {
  const total = Number(stats?.total || 0);
  if (!stats || total <= 0) return undefined;

  const average = Number(stats.average || 0);
  return {
    "@type": "AggregateRating",
    ratingValue: (average || 0).toFixed(1),
    reviewCount: total,
    bestRating: "5",
    worstRating: "1",
  };
}

/**
 * Site-wide LocalBusiness schema — render once in the root layout.
 * Pass overall site review stats so AggregateRating appears on every page.
 * Product pages still emit their own Product schema with product-only ratings.
 */
export function getLocalBusinessJsonLd(reviewStats?: SchemaReviewStats) {
  const base = getSiteBaseUrl();

  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${base}/#localbusiness`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: base,
    logo: absoluteUrl(BUSINESS.logoPath),
    image: absoluteUrl(BUSINESS.logoPath),
    email: BUSINESS.email,
    telephone: BUSINESS.telephone,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.addressLocality,
      addressCountry: BUSINESS.addressCountry,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "17:00",
        closes: "17:00",
      },
    ],
    sameAs: BUSINESS.sameAs,
  };

  const aggregateRating = buildAggregateRating(reviewStats);
  if (aggregateRating) json.aggregateRating = aggregateRating;

  return json;
}

export type ProductForSchema = {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  description?: string | null;
  base_price?: number | string | null;
  sale_price?: number | string | null;
  min_offered_price?: number | string | null;
  total_available_stock?: number | string | null;
  category_name?: string | null;
  category_slug?: string | null;
  subcategory_slug?: string | null;
  country_of_origin?: string | null;
  images?: { url: string; is_primary?: boolean }[];
};

/** Product + Offer (+ AggregateRating, when there are real reviews) JSON-LD. */
export function getProductJsonLd(
  product: ProductForSchema,
  reviewStats?: SchemaReviewStats,
) {
  const path = getProductCanonicalPath(product);
  const url = absoluteUrl(path);

  const price =
    product.min_offered_price != null
      ? Number(product.min_offered_price)
      : product.sale_price != null
        ? Number(product.sale_price)
        : Number(product.base_price || 0);

  const inStock =
    product.total_available_stock === null ||
    product.total_available_stock === undefined ||
    Number(product.total_available_stock) > 0;

  const images = (product.images || [])
    .slice()
    .sort((a, b) => Number(!!b.is_primary) - Number(!!a.is_primary))
    .map((img) => img.url)
    .filter(Boolean)
    .map(absoluteUrl);

  const description =
    stripHtml(product.description || "") ||
    `${product.name} — buy online at ${SITE_NAME}.`;

  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: description.slice(0, 5000),
    sku: product.sku || product.id,
    url,
    ...(images.length ? { image: images } : {}),
    ...(product.category_name ? { category: product.category_name } : {}),
    ...(product.country_of_origin
      ? { countryOfOrigin: product.country_of_origin }
      : {}),
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "EUR",
      price: (price || 0).toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };

  const aggregateRating = buildAggregateRating(reviewStats);
  if (aggregateRating) json.aggregateRating = aggregateRating;

  return json;
}

export type FaqItem = { question: string; answer: string };

/** FAQPage JSON-LD from a flat list of visible Q&A pairs. */
export function getFaqPageJsonLd(faqs: FaqItem[]) {
  const items = (faqs || []).filter((f) => f?.question && f?.answer);
  if (!items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function minutesToIsoDuration(minutes?: number | string | null): string | undefined {
  const value = Number(minutes);
  if (!value || value <= 0) return undefined;
  return `PT${Math.round(value)}M`;
}

export type RecipeForSchema = {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  seo_description?: string | null;
  content?: string | null;
  thumbnail_url?: string | null;
  origin?: string | null;
  preparation_time?: number | string | null;
  cooking_time?: number | string | null;
  servings?: number | string | null;
  category_name?: string | null;
  created_at?: string | Date | null;
  ingredients?: {
    ingredient_name: string;
    quantity?: number | string | null;
    unit?: string | null;
  }[];
  instructions?: {
    step_number?: number | null;
    step_title?: string | null;
    step_description?: string | null;
  }[];
};

export type RecipeNutrientForSchema = {
  nutrient_name: string;
  value: number | string | null;
  unit: string | null;
};

/** Recipe (+ AggregateRating, when there are real reviews) JSON-LD. */
export function getRecipeJsonLd(
  recipe: RecipeForSchema,
  nutrition?: RecipeNutrientForSchema[] | null,
  reviewStats?: SchemaReviewStats,
) {
  const url = absoluteUrl(getRecipePath(recipe.slug));

  const description =
    stripHtml(recipe.short_description || recipe.seo_description || "") ||
    recipe.title;

  const prepTime = minutesToIsoDuration(recipe.preparation_time);
  const cookTime = minutesToIsoDuration(recipe.cooking_time);
  const totalMinutes =
    Number(recipe.preparation_time || 0) + Number(recipe.cooking_time || 0);
  const totalTime =
    totalMinutes > 0 ? `PT${Math.round(totalMinutes)}M` : undefined;

  const recipeIngredient = (recipe.ingredients || [])
    .map((ing) =>
      [ing.quantity, ing.unit, ing.ingredient_name]
        .filter((part) => part !== null && part !== undefined && part !== "")
        .join(" ")
        .trim(),
    )
    .filter(Boolean);

  const recipeInstructions = (recipe.instructions || [])
    .slice()
    .sort((a, b) => Number(a.step_number || 0) - Number(b.step_number || 0))
    .map((step, index) => ({
      "@type": "HowToStep",
      position: step.step_number || index + 1,
      name: step.step_title || `Step ${step.step_number || index + 1}`,
      text: stripHtml(step.step_description || step.step_title || ""),
    }))
    .filter((step) => step.text);

  const calories = (nutrition || []).find((n) =>
    /calor/i.test(n.nutrient_name || ""),
  );

  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "@id": `${url}#recipe`,
    name: recipe.title,
    description: description.slice(0, 5000),
    url,
    ...(recipe.thumbnail_url
      ? { image: [absoluteUrl(recipe.thumbnail_url)] }
      : {}),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    ...(recipe.created_at
      ? { datePublished: new Date(recipe.created_at).toISOString() }
      : {}),
    ...(prepTime ? { prepTime } : {}),
    ...(cookTime ? { cookTime } : {}),
    ...(totalTime ? { totalTime } : {}),
    ...(recipe.servings ? { recipeYield: String(recipe.servings) } : {}),
    ...(recipe.category_name
      ? { recipeCategory: recipe.category_name }
      : {}),
    recipeCuisine: recipe.origin || "Asian",
    ...(recipeIngredient.length ? { recipeIngredient } : {}),
    ...(recipeInstructions.length
      ? { recipeInstructions }
      : {}),
    ...(calories && calories.value
      ? {
          nutrition: {
            "@type": "NutritionInformation",
            calories: `${calories.value} ${calories.unit || "kcal"}`,
          },
        }
      : {}),
  };

  const aggregateRating = buildAggregateRating(reviewStats);
  if (aggregateRating) json.aggregateRating = aggregateRating;

  return json;
}
