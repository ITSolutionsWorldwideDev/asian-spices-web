import { pool } from "@/core/db";

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
  const conversionRate = Number((filters as any)?.rate) > 0 ? Number((filters as any)?.rate) : 1;

  if (minPrice) {
    index++;
    const effectiveMin = Number(minPrice) / conversionRate;
    productConditions += ` AND p.base_price >= $${index}`;
    values.push(effectiveMin);
  }

  if (maxPrice) {
    index++;
    const effectiveMax = Number(maxPrice) / conversionRate;
    productConditions += ` AND p.base_price <= $${index}`;
    values.push(effectiveMax);
  }

  // 🔹 Text Search Constraint — name, brand, slug, weight, or full-text vector
  if (search) {
    index++;
    productConditions += ` AND (
      COALESCE(p.search_vector, ''::tsvector) @@ plainto_tsquery('english', $${index})
      OR p.name ILIKE '%' || $${index} || '%'
      OR p.slug ILIKE '%' || $${index} || '%'
      OR CAST(p.weight AS TEXT) ILIKE '%' || $${index} || '%'
      OR (COALESCE(p.name, '') || ' ' || COALESCE(CAST(p.weight AS TEXT), '')) ILIKE '%' || $${index} || '%'
      OR (
        SELECT COALESCE(bool_and(
          (COALESCE(p.name, '') || ' ' || COALESCE(CAST(p.weight AS TEXT), ''))
            ILIKE '%' || w.word || '%'
        ), false)
        FROM unnest(regexp_split_to_array(trim($${index}), '[[:space:]]+')) AS w(word)
        WHERE length(trim(w.word)) > 0
      )
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

  const subcategoryConversionRate = Number((filters as any)?.rate) > 0 ? Number((filters as any)?.rate) : 1;

  if (minPrice) {
    index++;
    const effectiveMin = Number(minPrice) / subcategoryConversionRate;
    productConditions += ` AND p.base_price >= $${index}`;
    values.push(effectiveMin);
  }

  if (maxPrice) {
    index++;
    const effectiveMax = Number(maxPrice) / subcategoryConversionRate;
    productConditions += ` AND p.base_price <= $${index}`;
    values.push(effectiveMax);
  }

  if (search) {
    index++;
    productConditions += ` AND (
      COALESCE(p.search_vector, ''::tsvector) @@ plainto_tsquery('english', $${index})
      OR p.name ILIKE '%' || $${index} || '%'
      OR p.slug ILIKE '%' || $${index} || '%'
      OR CAST(p.weight AS TEXT) ILIKE '%' || $${index} || '%'
      OR (COALESCE(p.name, '') || ' ' || COALESCE(CAST(p.weight AS TEXT), '')) ILIKE '%' || $${index} || '%'
      OR (
        SELECT COALESCE(bool_and(
          (COALESCE(p.name, '') || ' ' || COALESCE(CAST(p.weight AS TEXT), ''))
            ILIKE '%' || w.word || '%'
        ), false)
        FROM unnest(regexp_split_to_array(trim($${index}), '[[:space:]]+')) AS w(word)
        WHERE length(trim(w.word)) > 0
      )
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
  const subcategoryListConversionRate = Number((filters as any)?.rate) > 0 ? Number((filters as any)?.rate) : 1;

  if (minPrice !== undefined && minPrice !== "") {
    index++;
    const effectiveMin = Number(minPrice) / subcategoryListConversionRate;
    productConditions += ` AND p.base_price >= $${index}`;
    values.push(effectiveMin);
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    index++;
    const effectiveMax = Number(maxPrice) / subcategoryListConversionRate;
    productConditions += ` AND p.base_price <= $${index}`;
    values.push(effectiveMax);
  }

  // 🔹 Search — name, brand, slug, weight, or full-text vector
  if (search) {
    index++;
    productConditions += ` AND (
      COALESCE(p.search_vector, ''::tsvector) @@ plainto_tsquery('english', $${index})
      OR p.name ILIKE '%' || $${index} || '%'
      OR p.slug ILIKE '%' || $${index} || '%'
      OR CAST(p.weight AS TEXT) ILIKE '%' || $${index} || '%'
      OR (COALESCE(p.name, '') || ' ' || COALESCE(CAST(p.weight AS TEXT), '')) ILIKE '%' || $${index} || '%'
      OR (
        SELECT COALESCE(bool_and(
          (COALESCE(p.name, '') || ' ' || COALESCE(CAST(p.weight AS TEXT), ''))
            ILIKE '%' || w.word || '%'
        ), false)
        FROM unnest(regexp_split_to_array(trim($${index}), '[[:space:]]+')) AS w(word)
        WHERE length(trim(w.word)) > 0
      )
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

  const result = await pool.query(query, values);

  return result.rows;
};
