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

  let rankField = "0 as rank";
  if (search) {
    index++;
    values.push(search);
    rankField = `ts_rank(p.search_vector, plainto_tsquery($${index})) AS rank`;
  }


  const joinType = showUnavailable ? "LEFT JOIN" : "INNER JOIN";

  let query = `
    SELECT 
      p.*, 
      c.slug as category_slug,
      img.file_url AS image,
      cat.min_offered_price,
      cat.total_available_stock,
      ${rankField}
    FROM store_products p
    ${joinType} (
      SELECT 
        spc.product_id,
        MIN(spc.price) as min_offered_price,
        SUM(spc.quantity) as total_available_stock
      FROM public.store_product_catalog spc
      INNER JOIN public.store_settings ss ON ss.store_id = spc.store_id
      WHERE ss.country_code = $${countryParamIndex} AND spc.status = 1
      GROUP BY spc.product_id
    ) cat ON cat.product_id = p.id
    LEFT JOIN store_categories c ON c.id = p.category_id
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
  if (category && !saleOnly) {
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

  if (search) {
    index++;
    query += ` AND p.search_vector @@ plainto_tsquery($${index})`;
    values.push(search);
  }

  // 🔥 Sorting
  const currentRankPlaceholder = search ? "$1" : "0";

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
      query += ` ORDER BY ts_rank(p.search_vector, plainto_tsquery($${search ? values.indexOf(search) + 1 : 1})) DESC, p.id DESC`;
      break;

    default:
      query += ` ORDER BY p.created_at DESC, p.id DESC`;
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

export const getRelatedProducts = async (category_id: string, countryCode: string = "NL") => {
  const query = `
    SELECT 
      p.id,
      p.name,
      p.slug,
      p.base_price,
      cat.min_offered_price,
      p.category_id,
      c.slug AS category_slug,
      md.file_url AS image
    FROM store_products p
    LEFT JOIN (
      SELECT 
        spc.product_id,
        MIN(spc.price) as min_offered_price
      FROM public.store_product_catalog spc
      INNER JOIN public.store_settings ss ON ss.store_id = spc.store_id
      WHERE ss.country_code = $2 AND spc.status = 1
      GROUP BY spc.product_id
    ) cat ON cat.product_id = p.id
    LEFT JOIN store_categories c ON c.id = p.category_id
    LEFT JOIN store_product_images pi 
      ON pi.product_id = p.id AND pi.is_primary = true
    LEFT JOIN media md ON md.media_id = pi.url::int
    WHERE p.category_id = $1
    ORDER BY p.created_at DESC
    LIMIT 12
  `;

  // Pass both the category_id ($1) and countryCode ($2)
  const result = await pool.query(query, [category_id, countryCode.toUpperCase()]);
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
      AND r.status = 'approved'
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const statsQuery = `
    SELECT 
      COUNT(*)::int as total,
      ROUND(AVG(rating)::numeric, 1) as avg
    FROM store_product_reviews
    WHERE product_id = $1 AND status = 'approved'
  `;

  const breakdownQuery = `
    SELECT rating, COUNT(*)::int as count
    FROM store_product_reviews
    WHERE product_id = $1 AND status = 'approved'
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

export const getSubcategories = async (category: string, filters: any = {}) => {
  const { brands, minPrice, maxPrice, search } = filters;

  let values: any[] = [category];
  let index = 1;

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

  // 🔹 Text Search Constraint
  if (search) {
    index++;
    productConditions += ` AND p.search_vector @@ plainto_tsquery($${index})`;
    values.push(search);
  }

  // We build a clean query where c.slug filter is absolute,
  // and the dynamic product filters ONLY apply inside the join predicate.
  const query = `
    SELECT 
      sc.id,
      sc.name,
      COUNT(DISTINCT p.id) AS product_count
    FROM store_subcategories sc
    INNER JOIN store_categories c 
      ON sc.category_id = c.id
    LEFT JOIN store_products p 
      ON p.subcategory_id = sc.id 
      AND ${productConditions}
    WHERE c.slug = $1
    GROUP BY sc.id, sc.name
    ORDER BY sc.name;
  `;

  // console.log("productConditions ==== ", productConditions);
  // console.log("query ==== ", query);
  // console.log("values ==== ", values);

  const result = await pool.query(query, values);
  return result.rows;
};

export const getBrands = async (category: string, filters: any = {}) => {
  const { subcategories, minPrice, maxPrice, search } = filters;

  let values: any[] = [category];
  let index = 1;

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
    productConditions += ` AND p.price >= $${index}`;
    values.push(minPrice);
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    index++;
    productConditions += ` AND p.base_price <= $${index}`;
    values.push(maxPrice);
  }

  // 🔹 Search
  if (search) {
    index++;
    productConditions += ` AND p.search_vector @@ plainto_tsquery($${index})`;
    values.push(search);
  }

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

    WHERE c.slug = $1

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