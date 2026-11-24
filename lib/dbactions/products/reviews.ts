import { pool } from "@/core/db";

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
    WHERE product_id = $1
      AND status = 'approved'
  `;

  const breakdownQuery = `
    SELECT rating, COUNT(*)::int as count
    FROM store_product_reviews
    WHERE product_id = $1
      AND status = 'approved'
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

/** Lightweight rating summary for a product (used for schema.org AggregateRating). */
export const getProductReviewsSummary = async (productId: string) => {
  const { rows } = await pool.query(
    `
    SELECT
      COUNT(*)::int AS total,
      ROUND(AVG(rating)::numeric, 1) AS average
    FROM store_product_reviews
    WHERE product_id = $1
      AND status = 'approved'
    `,
    [productId],
  );

  return {
    total: rows[0]?.total || 0,
    average: Number(rows[0]?.average) || 0,
  };
};

/**
 * Site-wide overall rating across all product reviews.
 * Used for LocalBusiness AggregateRating on every page.
 */
export const getSiteReviewsSummary = async () => {
  const { rows } = await pool.query(
    `
    SELECT
      COUNT(*)::int AS total,
      ROUND(AVG(rating)::numeric, 1) AS average
    FROM store_product_reviews
    WHERE product_id IS NOT NULL
      AND rating IS NOT NULL
      AND status = 'approved'
    `,
  );

  return {
    total: rows[0]?.total || 0,
    average: Number(rows[0]?.average) || 0,
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
      AND status = 'approved'
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
      AND r.status = 'approved'
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
      AND status = 'approved'
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
