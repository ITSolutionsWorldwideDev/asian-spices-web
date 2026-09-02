// apps/web/lib/dbactions/products.ts

import { pool } from "@/core/db";

export const getProducts = async (filters: any) => {
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
          CASE WHEN COALESCE(b.name, '') ILIKE '%' || $${searchParamIndex} || '%' THEN 0.9 ELSE 0 END
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
    WHERE 1=1
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
  // 🔹 Price (GLOBAL BASE PRICE or fallback logic later)
  if (minPrice) {
    index++;
    query += ` AND COALESCE(cat.min_offered_price, p.base_price) >= $${index}`;
    values.push(minPrice);
  }

  if (maxPrice) {
    index++;
    query += ` AND COALESCE(cat.min_offered_price, p.base_price) <= $${index}`;
    values.push(maxPrice);
  }

  if (searchParamIndex !== null) {
    query += ` AND (
      COALESCE(p.search_vector, ''::tsvector) @@ plainto_tsquery('english', $${searchParamIndex})
      OR p.name ILIKE '%' || $${searchParamIndex} || '%'
      OR COALESCE(b.name, '') ILIKE '%' || $${searchParamIndex} || '%'
      OR p.slug ILIKE '%' || $${searchParamIndex} || '%'
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

  // switch (sort) {
  //   case "price_asc":
  //     query += ` ORDER BY p.base_price ASC, p.id DESC`;
  //     break;

  //   case "price_desc":
  //     query += ` ORDER BY p.base_price DESC, p.id DESC`;
  //     break;

  //   case "popular":
  //     query += ` ORDER BY p.created_at DESC, p.id DESC`; // later replace with sales
  //     break;

  //   case "relevance":
  //     query += ` ORDER BY rank DESC, p.id DESC`;
  //     break;

  //   default:
  //     query += ` ORDER BY p.created_at DESC, p.id DESC`;
  // }

  // 🔥 Pagination
  // const limit = 20;
  const offset = (page - 1) * limit;

  index++;
  query += ` LIMIT $${index}`;
  values.push(limit);

  index++;
  query += ` OFFSET $${index}`;
  values.push(offset);

  // console.log("query ====", query);
  // console.log("values ====", values);

  const result = await pool.query(query, values);
  return result.rows;
};

// apps/web/lib/dbactions/products.ts

export const getProductBySlug = async (
  slug: string,
  countryCode: string = "NL",
) => {
  const query = `
    SELECT 
      p.id,
      p.name,
      p.slug,
      p.sku,
      p.weight,
      p.base_price,
      p.sale_price,
      p.discount_type,
      p.discount_value,
      p.promo_code,
      p.description,
      p.health_benefits,
      COALESCE(
        NULLIF(TRIM(p.country_of_origin), ''),
        origin_country.country_name
      ) AS country_of_origin,
      p.category_id,
      p.subcategory_id,
      p.brand_id,
      p.created_at,
      p.updated_at,
      p.search_vector,
      c.name AS category_name,
      c.slug AS category_slug,
      sc.name AS subcategory_name,
      sc.slug AS subcategory_slug,
      cat.min_offered_price,
      cat.total_available_stock,
      cat.seller_name,
      (
        SELECT COUNT(*)::int
        FROM store_product_reviews rv
        WHERE rv.product_id = p.id
          AND (
            rv.status IS NULL
            OR rv.status IN ('approved', 'pending', 'published')
          )
      ) AS reviews,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', pi.id,
            'url', m.file_url,
            'is_primary', pi.is_primary
          )
        ) FILTER (WHERE pi.id IS NOT NULL),
        '[]'
      ) AS images
    FROM store_products p
    LEFT JOIN (
      SELECT 
        spc.product_id,
        MIN(spc.price) as min_offered_price,
        SUM(spc.quantity) as total_available_stock,
        (ARRAY_AGG(st.name ORDER BY spc.price ASC NULLS LAST))[1] AS seller_name
      FROM public.store_product_catalog spc
      INNER JOIN public.store_settings ss ON ss.store_id = spc.store_id
      LEFT JOIN public.stores st ON st.id = spc.store_id
      WHERE ss.country_code = $2 AND spc.status = 1
      GROUP BY spc.product_id
    ) cat ON cat.product_id = p.id
    LEFT JOIN countries origin_country
      ON origin_country.country_id = p.country_id
    LEFT JOIN store_categories c 
      ON p.category_id = c.id
    LEFT JOIN store_subcategories sc
      ON sc.id = p.subcategory_id
    LEFT JOIN store_product_images pi 
      ON pi.product_id = p.id
    LEFT JOIN media m 
      ON m.media_id = pi.url::int
    WHERE p.slug = $1
    GROUP BY 
      p.id, 
      p.name, 
      p.slug,
      p.sku,
      p.weight,
      p.base_price, 
      p.sale_price, 
      p.discount_type, 
      p.discount_value, 
      p.promo_code, 
      p.description,
      p.health_benefits,
      p.country_of_origin,
      origin_country.country_name,
      p.category_id, 
      p.subcategory_id, 
      p.brand_id, 
      p.created_at, 
      p.updated_at, 
      p.search_vector,
      c.name, 
      c.slug,
      sc.name,
      sc.slug,
      cat.min_offered_price, 
      cat.total_available_stock,
      cat.seller_name
    LIMIT 1
  `;

  const result = await pool.query(query, [slug, countryCode.toUpperCase()]);
  const row = result.rows[0];

  if (!row) return null;

  return {
    ...row,
    images: row.images || [],
    highlights: row.highlights || [], // Safely fall back if column doesn't exist
  };
};

export const getRelatedProducts = async (
  category_id: string,
  countryCode: string = "NL",
) => {
  const query = `
    SELECT 
      p.id,
      p.name,
      p.slug,
      p.base_price,
      cat.min_offered_price,
      cat.seller_name,
      p.category_id,
      c.slug AS category_slug,
      sc.slug AS subcategory_slug,
      md.file_url AS image
    FROM store_products p
    LEFT JOIN (
      SELECT 
        spc.product_id,
        MIN(spc.price) as min_offered_price,
        (ARRAY_AGG(st.name ORDER BY spc.price ASC NULLS LAST))[1] AS seller_name
      FROM public.store_product_catalog spc
      INNER JOIN public.store_settings ss ON ss.store_id = spc.store_id
      LEFT JOIN public.stores st ON st.id = spc.store_id
      WHERE ss.country_code = $2 AND spc.status = 1
      GROUP BY spc.product_id
    ) cat ON cat.product_id = p.id
    LEFT JOIN store_categories c ON c.id = p.category_id
    LEFT JOIN store_subcategories sc ON sc.id = p.subcategory_id
    LEFT JOIN store_product_images pi 
      ON pi.product_id = p.id AND pi.is_primary = true
    LEFT JOIN media md ON md.media_id = pi.url::int
    WHERE p.category_id = $1
    ORDER BY p.created_at DESC
    LIMIT 12
  `;

  // Pass both the category_id ($1) and countryCode ($2)
  const result = await pool.query(query, [
    category_id,
    countryCode.toUpperCase(),
  ]);
  return result.rows;
};

export const getProductReviews = async (productId: string, page = 1) => {
  const limit = 5;
  const offset = (page - 1) * limit;

  const reviewsQuery = `
    SELECT 
      r.id,
      r.rating,
      r.title,
      r.comment,
      r.created_at,
      COALESCE(c.company_name, r.guest_name, 'Anonymous') as name
    FROM store_product_reviews r
    Left JOIN store_customers c ON r.customer_id = c.id
    WHERE r.product_id = $1
      AND (
        r.status IS NULL
        OR r.status IN ('approved', 'pending', 'published')
      )
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const statsQuery = `
    SELECT 
      COUNT(*)::int as total,
      ROUND(AVG(rating)::numeric, 1) as avg
    FROM store_product_reviews
    WHERE product_id = $1
      AND (
        status IS NULL
        OR status IN ('approved', 'pending', 'published')
      )
  `;

  const breakdownQuery = `
    SELECT rating, COUNT(*)::int as count
    FROM store_product_reviews
    WHERE product_id = $1
      AND (
        status IS NULL
        OR status IN ('approved', 'pending', 'published')
      )
    GROUP BY rating
  `;

  const [reviewsRes, statsRes, breakdownRes] = await Promise.all([
    pool.query(reviewsQuery, [productId, limit, offset]),
    pool.query(statsQuery, [productId]),
    pool.query(breakdownQuery, [productId]),
  ]);

  return {
    reviews: reviewsRes.rows,
    total: statsRes.rows[0]?.total || 0,
    average: statsRes.rows[0]?.avg || 0,
    breakdown: breakdownRes.rows,
  };
};

/** Review summary for a recipe from store_product_reviews (matched by recipe_id). */
export const getRecipeReviewsSummary = async (recipeId: string) => {
  const { rows } = await pool.query(
    `
    SELECT
      COUNT(*)::int AS total,
      COALESCE(ROUND(AVG(rating)::numeric, 1), 0)::float AS average
    FROM store_product_reviews
    WHERE rating IS NOT NULL
      AND recipe_id = $1
      AND (
        status IS NULL
        OR status IN ('approved', 'pending', 'published')
      )
    `,
    [recipeId],
  );

  return {
    total: rows[0]?.total || 0,
    average: Number(rows[0]?.average || 0),
  };
};

export const getRecipeReviews = async (recipeId: string, page = 1) => {
  const limit = 9;
  const offset = (page - 1) * limit;

  const reviewsQuery = `
    SELECT
      r.id,
      r.rating,
      r.title,
      r.comment,
      r.created_at,
      r.status,
      COALESCE(c.company_name, r.guest_name, 'Anonymous') AS name
    FROM store_product_reviews r
    LEFT JOIN store_customers c ON r.customer_id = c.id
    WHERE r.recipe_id = $1
      AND (
        r.status IS NULL
        OR r.status IN ('approved', 'pending', 'published')
      )
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const statsQuery = `
    SELECT
      COUNT(*)::int AS total,
      COALESCE(ROUND(AVG(rating)::numeric, 1), 0)::float AS average
    FROM store_product_reviews
    WHERE recipe_id = $1
      AND rating IS NOT NULL
      AND (
        status IS NULL
        OR status IN ('approved', 'pending', 'published')
      )
  `;

  const [reviewsRes, statsRes] = await Promise.all([
    pool.query(reviewsQuery, [recipeId, limit, offset]),
    pool.query(statsQuery, [recipeId]),
  ]);

  return {
    reviews: reviewsRes.rows,
    total: statsRes.rows[0]?.total || 0,
    average: Number(statsRes.rows[0]?.average || 0),
  };
};

export const getSubcategories = async (category: string, filters: any = {}) => {
  const { brands, minPrice, maxPrice, search } = filters;
  const isAllCategories = !category || category === "all";

  let values: any[] = isAllCategories ? [] : [category];
  let index = values.length;

  // Base conditions for filtering the counted products
  let productConditions = `p.status = 1`;

  // 🔹 Brand Constraint (Scoped strictly to product selection)
  if (brands?.length > 0) {
    index++;
    productConditions += ` AND p.brand_id = ANY($${index}::uuid[])`;
    values.push(brands);
  }

  // 🔹 Price Range Constraints
  if (minPrice) {
    index++;
    productConditions += ` AND p.base_price >= $${index}`;
    values.push(minPrice);
  }

  if (maxPrice) {
    index++;
    productConditions += ` AND p.base_price <= $${index}`;
    values.push(maxPrice);
  }

  // 🔹 Text Search Constraint — name, brand, slug, or full-text vector
  if (search) {
    index++;
    productConditions += ` AND (
      COALESCE(p.search_vector, ''::tsvector) @@ plainto_tsquery('english', $${index})
      OR p.name ILIKE '%' || $${index} || '%'
      OR p.slug ILIKE '%' || $${index} || '%'
      OR EXISTS (
        SELECT 1 FROM store_brands sb
        WHERE sb.brand_id = p.brand_id
          AND sb.name ILIKE '%' || $${index} || '%'
      )
    )`;
    values.push(search.trim());
  }

  // We build a clean query where c.slug filter is absolute,
  // and the dynamic product filters ONLY apply inside the join predicate.
  const categoryFilter = isAllCategories ? "1=1" : "c.slug = $1";
  const query = `
    SELECT 
      sc.id,
      sc.name,
      sc.slug,
      c.slug AS category_slug,
      COUNT(DISTINCT p.id) AS product_count
    FROM store_subcategories sc
    INNER JOIN store_categories c 
      ON sc.category_id = c.id
    LEFT JOIN store_products p 
      ON p.subcategory_id = sc.id 
      AND ${productConditions}
    WHERE ${categoryFilter}
    GROUP BY sc.id, sc.name, sc.slug, c.slug
    ORDER BY sc.name;
  `;

  // console.log("productConditions ==== ", productConditions);
  // console.log("query ==== ", query);
  // console.log("values ==== ", values);

  const result = await pool.query(query, values);
  return result.rows;
};

/** Top-level shop categories with counts, for the sidebar filter. */
export const getCategories = async (filters: any = {}) => {
  const { brands, minPrice, maxPrice, search } = filters;

  const values: any[] = [];
  let index = 0;
  let productConditions = `p.status = 1`;

  if (brands?.length > 0) {
    index++;
    productConditions += ` AND p.brand_id = ANY($${index}::uuid[])`;
    values.push(brands);
  }

  if (minPrice) {
    index++;
    productConditions += ` AND p.base_price >= $${index}`;
    values.push(minPrice);
  }

  if (maxPrice) {
    index++;
    productConditions += ` AND p.base_price <= $${index}`;
    values.push(maxPrice);
  }

  if (search) {
    index++;
    productConditions += ` AND (
      COALESCE(p.search_vector, ''::tsvector) @@ plainto_tsquery('english', $${index})
      OR p.name ILIKE '%' || $${index} || '%'
      OR p.slug ILIKE '%' || $${index} || '%'
    )`;
    values.push(search.trim());
  }

  const query = `
    SELECT
      c.id,
      c.name,
      c.slug,
      COUNT(DISTINCT p.id) AS product_count
    FROM store_categories c
    LEFT JOIN store_products p
      ON p.category_id = c.id
      AND ${productConditions}
    WHERE c.status = 1
      AND LOWER(c.slug) <> 'healthy-living'
    GROUP BY c.id, c.name, c.slug
    ORDER BY c.name;
  `;

  const result = await pool.query(query, values);
  return result.rows;
};

export const getBrands = async (category: string, filters: any = {}) => {
  const { subcategories, minPrice, maxPrice, search } = filters;
  const isAllCategories = !category || category === "all";

  let values: any[] = isAllCategories ? [] : [category];
  let index = values.length;

  // Base product conditions
  let productConditions = `p.status = 1`;

  // 🔹 Selected subcategories
  if (subcategories?.length > 0) {
    index++;
    productConditions += ` AND p.subcategory_id = ANY($${index}::uuid[])`;
    values.push(subcategories);
  }

  // 🔹 Price filters
  if (minPrice !== undefined && minPrice !== "") {
    index++;
    productConditions += ` AND p.base_price >= $${index}`;
    values.push(minPrice);
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    index++;
    productConditions += ` AND p.base_price <= $${index}`;
    values.push(maxPrice);
  }

  // 🔹 Search — name, brand, slug, or full-text vector
  if (search) {
    index++;
    productConditions += ` AND (
      COALESCE(p.search_vector, ''::tsvector) @@ plainto_tsquery('english', $${index})
      OR p.name ILIKE '%' || $${index} || '%'
      OR p.slug ILIKE '%' || $${index} || '%'
      OR EXISTS (
        SELECT 1 FROM store_brands sb
        WHERE sb.brand_id = p.brand_id
          AND sb.name ILIKE '%' || $${index} || '%'
      )
    )`;
    values.push(search.trim());
  }

  const categoryFilter = isAllCategories ? "1=1" : "c.slug = $1";
  const query = `
    SELECT
      b.brand_id,
      b.name,
      COUNT(DISTINCT p.id) AS product_count
    FROM store_brands b

    LEFT JOIN store_products p
      ON p.brand_id = b.brand_id
      AND ${productConditions}

    INNER JOIN store_categories c
      ON c.id = p.category_id

    WHERE ${categoryFilter}

    GROUP BY
      b.brand_id,
      b.name

    ORDER BY
      b.name;
  `;

  // console.log("Brands Query:", query);
  // console.log("Brands Values:", values);

  const result = await pool.query(query, values);

  return result.rows;
};

/* 
export const getProductBySlug = async (slug: string, countryCode: string = "NL") => {
  const query = `
    SELECT 
      p.*,
      c.name AS category_name,
      cat.min_offered_price,
      cat.total_available_stock,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', pi.id,
            'url', m.file_url,
            'is_primary', pi.is_primary
          )
        ) FILTER (WHERE pi.id IS NOT NULL),
        '[]'
      ) AS images
    FROM store_products p
    LEFT JOIN (
      SELECT 
        spc.product_id,
        MIN(spc.price) as min_offered_price,
        SUM(spc.quantity) as total_available_stock
      FROM public.store_product_catalog spc
      INNER JOIN public.store_settings ss ON ss.store_id = spc.store_id
      WHERE ss.country_code = $2 AND spc.status = 1
      GROUP BY spc.product_id
    ) cat ON cat.product_id = p.id
    LEFT JOIN store_categories c 
      ON p.category_id = c.id
    LEFT JOIN store_product_images pi 
      ON pi.product_id = p.id
    LEFT JOIN media m 
      ON m.media_id = pi.url::int
    WHERE p.slug = $1
    GROUP BY p.id, c.name, cat.min_offered_price, cat.total_available_stock
    LIMIT 1
  `;

  // Pass both the slug ($1) and countryCode ($2)
  const result = await pool.query(query, [slug, countryCode.toUpperCase()]);
  const row = result.rows[0];

  if (!row) return null;

  return {
    ...row,
    images: row.images || [],
    highlights: row.highlights || [],
  };
};
*/

// 2️⃣ Use a DISTINCT ON subquery on store_product_images to force a single row match per product
// let query = `
//   SELECT
//     p.*,
//     c.slug as category_slug,
//     img.file_url AS image,
//     ${rankField}
//   FROM store_products p
//   LEFT JOIN store_categories c ON c.id = p.category_id
//   LEFT JOIN (
//     SELECT DISTINCT ON (pi.product_id)
//       pi.product_id,
//       md.file_url
//     FROM store_product_images pi
//     LEFT JOIN media md ON md.media_id = pi.url::int
//     ORDER BY pi.product_id, pi.is_primary DESC, pi.id ASC
//   ) img ON img.product_id = p.id
//   WHERE 1=1
// `;

// let query = `
//   SELECT
//     p.*,
//     c.slug as category_slug,
//     img.file_url AS image,
//     cat.min_offered_price,
//     cat.total_available_stock,
//     ${rankField}
//   FROM store_products p
//   INNER JOIN (
//     SELECT
//       spc.product_id,
//       MIN(spc.price) as min_offered_price,
//       SUM(spc.quantity) as total_available_stock
//     FROM public.store_product_catalog spc
//     INNER JOIN public.store_settings ss ON ss.store_id = spc.store_id
//     WHERE ss.country_code = $${countryParamIndex} AND spc.status = 1
//     GROUP BY spc.product_id
//   ) cat ON cat.product_id = p.id
//   LEFT JOIN store_categories c ON c.id = p.category_id
//   LEFT JOIN (
//     SELECT DISTINCT ON (pi.product_id)
//       pi.product_id,
//       md.file_url
//     FROM store_product_images pi
//     LEFT JOIN media md ON md.media_id = pi.url::int
//     ORDER BY pi.product_id, pi.is_primary DESC, pi.id ASC
//   ) img ON img.product_id = p.id
//   WHERE 1=1
// `;
/* 
export const getProductBySlug = async (slug: string) => {
  const query = `
    SELECT 
      p.*,
      c.name AS category_name,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', pi.id,
            'url', m.file_url,
            'is_primary', pi.is_primary
          )
        ) FILTER (WHERE pi.id IS NOT NULL),
        '[]'
      ) AS images

    FROM store_products p
    LEFT JOIN store_categories c 
      ON p.category_id = c.id

    LEFT JOIN store_product_images pi 
      ON pi.product_id = p.id

    LEFT JOIN media m 
      ON m.media_id = pi.url::int

    WHERE p.slug = $1
    GROUP BY p.id, c.name
    LIMIT 1
  `;

  const result = await pool.query(query, [slug]);

  const row = result.rows[0];

  if (!row) return null;

  return {
    ...row,
    images: row.images || [],
    highlights: row.highlights || [],
  };
};

export const getRelatedProducts = async (category_id: string) => {
  const query = `
    SELECT 
      p.id,
      p.name,
      p.slug,
      p.base_price,
      p.category_id,
      c.slug AS category_slug,
      md.file_url AS image
    FROM store_products p
    LEFT JOIN store_categories c ON c.id = p.category_id
    LEFT JOIN store_product_images pi 
      ON pi.product_id = p.id AND pi.is_primary = true
    LEFT JOIN media md ON md.media_id = pi.url::int
    WHERE p.category_id = $1
    ORDER BY p.created_at DESC
    LIMIT 12
  `;

  const result = await pool.query(query, [category_id]);
  return result.rows;
};
*/
