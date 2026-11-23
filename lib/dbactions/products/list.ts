import { pool } from "@/core/db";
import { toCleanImageUrl } from "@/lib/media/toCleanImageUrl";
import { getOrSet } from "@/lib/redis/cache";
import {
  getFirst20ProductOfEachCategoryCacheKey,
  homeExploreAllCacheKey,
  REDIS_TTL,
} from "@/lib/redis/keys";

async function fetchProductsFromDb(filters: any) {
  const {
    category,
    subcategories,
    brands,
    minPrice,
    maxPrice,
    search,
    sort = "newest",
    page = 1,
    saleOnly = false,
    limit = 20,
    countryCode = "NL",
    showUnavailable = false,
  } = filters;

  let values: any[] = [];
  let index = 0;

  index++;
  values.push(countryCode.toUpperCase());
  const countryParamIndex = index;

  let searchParamIndex: number | null = null;
  if (search) {
    index++;
    searchParamIndex = index;
    values.push(search.trim());
  }

  const rankField =
    searchParamIndex !== null
      ? `GREATEST(
          ts_rank(COALESCE(p.search_vector, ''::tsvector), plainto_tsquery('english', $${searchParamIndex})),
          CASE WHEN p.name ILIKE '%' || $${searchParamIndex} || '%' THEN 1 ELSE 0 END,
          CASE WHEN COALESCE(b.name, '') ILIKE '%' || $${searchParamIndex} || '%' THEN 0.9 ELSE 0 END,
          CASE WHEN CAST(p.weight AS TEXT) ILIKE '%' || $${searchParamIndex} || '%' THEN 0.8 ELSE 0 END,
          CASE WHEN (COALESCE(p.name, '') || ' ' || COALESCE(CAST(p.weight AS TEXT), '')) ILIKE '%' || $${searchParamIndex} || '%' THEN 1 ELSE 0 END
        ) AS rank`
      : "0 as rank";

  const joinType = showUnavailable ? "LEFT JOIN" : "INNER JOIN";

  let query = `
    SELECT 
      p.*, 
      c.slug as category_slug,
      sc.slug as subcategory_slug,
      b.name as brand_name,
      img.file_url AS image,
      cat.min_offered_price,
      cat.total_available_stock,
      cat.seller_name,
      (
        SELECT COUNT(*)::int
        FROM store_product_reviews rv
        WHERE rv.product_id = p.id
          AND rv.status = 'approved'
      ) AS reviews,
      (
        SELECT ROUND(AVG(rv.rating)::numeric, 1)
        FROM store_product_reviews rv
        WHERE rv.product_id = p.id
          AND rv.status = 'approved'
      ) AS avg_rating,
      ${rankField}
    FROM store_products p
    ${joinType} (
      SELECT 
        spc.product_id,
        MIN(spc.price) as min_offered_price,
        SUM(spc.quantity) as total_available_stock,
        (ARRAY_AGG(st.name ORDER BY spc.price ASC NULLS LAST))[1] AS seller_name
      FROM public.store_product_catalog spc
      INNER JOIN public.store_settings ss ON ss.store_id = spc.store_id
      LEFT JOIN public.stores st ON st.id = spc.store_id
      WHERE ss.country_code = $${countryParamIndex} AND spc.status = 1
      GROUP BY spc.product_id
    ) cat ON cat.product_id = p.id
    LEFT JOIN store_categories c ON c.id = p.category_id
    LEFT JOIN store_subcategories sc ON sc.id = p.subcategory_id
    LEFT JOIN store_brands b ON b.brand_id = p.brand_id
    LEFT JOIN (
      SELECT DISTINCT ON (pi.product_id) 
        pi.product_id, 
        md.file_url
      FROM store_product_images pi
      LEFT JOIN media md ON md.media_id = pi.url::int
      ORDER BY pi.product_id, pi.is_primary DESC, pi.id ASC
    ) img ON img.product_id = p.id
    WHERE p.status = 1
  `;

  if (saleOnly) {
    query += ` AND (
      (p.discount_type IS NOT NULL AND p.discount_value::text != 'NaN' AND p.discount_value > 0)
      OR (p.sale_price IS NOT NULL AND p.sale_price < p.base_price)
    ) AND (p.promo_code IS NULL OR p.promo_code = '')`;
  }

  // 🔹 Category
  if (category && category !== "all" && !saleOnly) {
    index++;
    query += ` AND c.slug = $${index}`;
    values.push(category);
  }

  // 🔹 Subcategories
  if (subcategories?.length > 0) {
    index++;
    query += ` AND p.subcategory_id = ANY($${index}::uuid[])`;
    values.push(subcategories);
  }

  // 🔹 Brands
  if (brands?.length > 0) {
    index++;
    query += ` AND p.brand_id = ANY($${index}::uuid[])`;
    values.push(brands);
  }
  // 🔹 Price (converts from user's active currency rate to base EUR)
  const conversionRate = Number((filters as any)?.rate) > 0 ? Number((filters as any)?.rate) : 1;

  if (minPrice) {
    index++;
    const effectiveMin = Number(minPrice) / conversionRate;
    query += ` AND COALESCE(cat.min_offered_price, p.base_price) >= $${index}`;
    values.push(effectiveMin);
  }

  if (maxPrice) {
    index++;
    const effectiveMax = Number(maxPrice) / conversionRate;
    query += ` AND COALESCE(cat.min_offered_price, p.base_price) <= $${index}`;
    values.push(effectiveMax);
  }

  if (searchParamIndex !== null) {
    // Match name/brand/slug/weight, or all words across "name + weight"
    // so "Samaara Premium Black Tea Jar 1kg" works when 1kg is only in weight
    query += ` AND (
      COALESCE(p.search_vector, ''::tsvector) @@ plainto_tsquery('english', $${searchParamIndex})
      OR p.name ILIKE '%' || $${searchParamIndex} || '%'
      OR COALESCE(b.name, '') ILIKE '%' || $${searchParamIndex} || '%'
      OR p.slug ILIKE '%' || $${searchParamIndex} || '%'
      OR CAST(p.weight AS TEXT) ILIKE '%' || $${searchParamIndex} || '%'
      OR (COALESCE(p.name, '') || ' ' || COALESCE(CAST(p.weight AS TEXT), '')) ILIKE '%' || $${searchParamIndex} || '%'
      OR (
        SELECT COALESCE(bool_and(
          (COALESCE(p.name, '') || ' ' || COALESCE(CAST(p.weight AS TEXT), '') || ' ' || COALESCE(b.name, ''))
            ILIKE '%' || w.word || '%'
        ), false)
        FROM unnest(regexp_split_to_array(trim($${searchParamIndex}), '[[:space:]]+')) AS w(word)
        WHERE length(trim(w.word)) > 0
      )
    )`;
  }

  // 🔥 Sorting
  switch (sort) {
    case "price_asc":
      query += ` ORDER BY COALESCE(cat.min_offered_price, p.base_price) ASC, p.id DESC`;
      break;

    case "price_desc":
      query += ` ORDER BY COALESCE(cat.min_offered_price, p.base_price) DESC, p.id DESC`;
      break;

    case "popular":
      query += ` ORDER BY p.created_at DESC, p.id DESC`;
      break;

    case "relevance":
      query += searchParamIndex !== null
        ? ` ORDER BY rank DESC, p.id DESC`
        : ` ORDER BY p.created_at DESC, p.id DESC`;
      break;

    case "newest":
      // Prefer relevance when a search query is active
      query += searchParamIndex !== null
        ? ` ORDER BY rank DESC, p.created_at DESC, p.id DESC`
        : ` ORDER BY p.created_at DESC, p.id DESC`;
      break;

    default:
      query += searchParamIndex !== null
        ? ` ORDER BY rank DESC, p.created_at DESC, p.id DESC`
        : ` ORDER BY p.created_at DESC, p.id DESC`;
  }

  // 🔥 Pagination (skip when limit is null/undefined/0 — e.g. flash sale wants all)
  if (limit != null && Number(limit) > 0) {
    const offset = (page - 1) * limit;

    index++;
    query += ` LIMIT $${index}`;
    values.push(limit);

    index++;
    query += ` OFFSET $${index}`;
    values.push(offset);
  }

  const result = await pool.query(query, values);
  return result.rows.map((row: any) => ({
    ...row,
    image: row.image ? toCleanImageUrl(row.image) : row.image,
  }));
}

function hasNoListingFilters(filters: any) {
  return (
    (filters?.subcategories?.length ?? 0) === 0 &&
    (filters?.brands?.length ?? 0) === 0 &&
    !filters?.minPrice &&
    !filters?.maxPrice &&
    !filters?.search
  );
}

/** Home Explore → Shop by Categories → All only (screenshot case). */
function shouldCacheHomeExploreAll(filters: any) {
  const category = filters?.category || "all";
  const isAll = !category || category === "all";
  const limit = Number(filters?.limit);
  const page = Number(filters?.page ?? 1);
  const sort = filters?.sort || "newest";

  return (
    !filters?.saleOnly &&
    isAll &&
    limit === 10 &&
    page === 1 &&
    sort === "newest" &&
    hasNoListingFilters(filters)
  );
}

/**
 * First listing page only (category pages + /products all).
 * No sort/brands/subcategories/price/search filters.
 */
function shouldCacheListingFirstPage(filters: any) {
  const limit = Number(filters?.limit ?? 20);
  const page = Number(filters?.page ?? 1);
  const sort = filters?.sort || "newest";

  return (
    !filters?.saleOnly &&
    limit === 20 &&
    page === 1 &&
    sort === "newest" &&
    hasNoListingFilters(filters)
  );
}

export const getProducts = async (filters: any) => {
  if (shouldCacheHomeExploreAll(filters)) {
    return getOrSet(
      homeExploreAllCacheKey(filters?.countryCode || "NL"),
      REDIS_TTL.HOME_EXPLORE_ALL,
      () => fetchProductsFromDb(filters),
    );
  }

  if (shouldCacheListingFirstPage(filters)) {
    const categoryKey =
      filters?.category && filters.category !== "all"
        ? filters.category
        : "all";

    return getOrSet(
      getFirst20ProductOfEachCategoryCacheKey(
        categoryKey,
        filters?.countryCode || "NL",
      ),
      REDIS_TTL.GET_FIRST_20_PRODUCT_OF_EACH_CATEGORY,
      () => fetchProductsFromDb(filters),
    );
  }

  return fetchProductsFromDb(filters);
};
