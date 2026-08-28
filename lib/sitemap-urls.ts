import { pool } from "@/core/db";
import { slugContent } from "@/data/healthyLivingData";

export function getSiteBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    "https://www.asianspices.online";

  const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

export type SitemapEntry = {
  path: string;
  lastModified?: Date;
};

const STATIC_PATHS: { path: string; changePriority?: "high" | "medium" | "low" }[] = [
  { path: "/", changePriority: "high" },
  { path: "/about", changePriority: "medium" },
  { path: "/contact-us", changePriority: "medium" },
  { path: "/recipes", changePriority: "high" },
  { path: "/products", changePriority: "high" },
  { path: "/privacy", changePriority: "low" },
  { path: "/terms", changePriority: "low" },
  { path: "/cookies", changePriority: "low" },
  { path: "/partner-registration", changePriority: "medium" },
  { path: "/partnerplatform", changePriority: "medium" },
  { path: "/foods-beverages", changePriority: "medium" },
  { path: "/kitchen-appliances", changePriority: "medium" },
  ...Object.keys(slugContent).map((slug) => ({
    path: `/healthyliving/${slug}`,
    changePriority: "medium" as const,
  })),
];

export async function getStaticSitemapEntries(): Promise<SitemapEntry[]> {
  return STATIC_PATHS.map(({ path }) => ({ path }));
}

export async function getCategorySitemapEntries(): Promise<SitemapEntry[]> {
  const { rows } = await pool.query<{ slug: string }>(
    `SELECT slug
     FROM store_categories
     WHERE status = 1
     ORDER BY slug ASC`,
  );

  return rows.map(({ slug }) => ({ path: `/${slug}` }));
}

export async function getSubcategorySitemapEntries(): Promise<SitemapEntry[]> {
  const { rows } = await pool.query<{
    category_slug: string;
    subcategory_slug: string;
  }>(
    `SELECT c.slug AS category_slug, sc.slug AS subcategory_slug
     FROM store_subcategories sc
     JOIN store_categories c ON c.id = sc.category_id
     WHERE c.status = 1
     ORDER BY c.slug ASC, sc.slug ASC`,
  );

  return rows.map(({ category_slug, subcategory_slug }) => ({
    path: `/${category_slug}/${subcategory_slug}`,
  }));
}

export async function getProductSitemapEntries(): Promise<SitemapEntry[]> {
  const { rows } = await pool.query<{
    product_slug: string;
    category_slug: string;
    subcategory_slug: string | null;
    updated_at: Date | null;
    created_at: Date | null;
  }>(
    `SELECT
       p.slug AS product_slug,
       c.slug AS category_slug,
       sc.slug AS subcategory_slug,
       p.updated_at,
       p.created_at
     FROM store_products p
     JOIN store_categories c ON c.id = p.category_id AND c.status = 1
     LEFT JOIN store_subcategories sc ON sc.id = p.subcategory_id
     WHERE p.status = 1
     ORDER BY c.slug ASC, p.slug ASC`,
  );

  return rows.map((row) => {
    const path = row.subcategory_slug
      ? `/${row.category_slug}/${row.subcategory_slug}/${row.product_slug}`
      : `/${row.category_slug}/${row.product_slug}`;

    const lastModified = row.updated_at ?? row.created_at ?? undefined;

    return { path, lastModified: lastModified ? new Date(lastModified) : undefined };
  });
}

export async function getRecipeSitemapEntries(): Promise<SitemapEntry[]> {
  const { rows } = await pool.query<{
    slug: string;
    created_at: Date | null;
  }>(
    `SELECT slug, created_at
     FROM recipes
     WHERE status = 'published'
     ORDER BY slug ASC`,
  );

  return rows.map((row) => ({
    path: `/recipes/${row.slug}`,
    lastModified: row.created_at ? new Date(row.created_at) : undefined,
  }));
}

export async function getAllSitemapEntries(): Promise<SitemapEntry[]> {
  const [staticPages, categories, subcategories, products, recipes] =
    await Promise.all([
      getStaticSitemapEntries(),
      getCategorySitemapEntries(),
      getSubcategorySitemapEntries(),
      getProductSitemapEntries(),
      getRecipeSitemapEntries(),
    ]);

  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];

  for (const entry of [
    ...staticPages,
    ...categories,
    ...subcategories,
    ...products,
    ...recipes,
  ]) {
    if (seen.has(entry.path)) continue;
    seen.add(entry.path);
    entries.push(entry);
  }

  return entries;
}
