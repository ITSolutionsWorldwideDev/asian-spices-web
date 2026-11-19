import { pool } from "@/core/db";
import { toCleanImageUrl } from "@/lib/media/toCleanImageUrl";
import { redis } from "@/lib/redis/client";
import {
  getMostlyViewdProductsCacheKey,
  REDIS_TTL,
} from "@/lib/redis/keys";


//// tahats for redis caching ///////
const MOSTLY_VIEWED_PRODUCT_SLUGS = [
  "trs-pure-butter-ghee-1kg",
  "trs-garam-masala-powder-100g",
  "trs-curry-leaves-30g",
  "nescafe-sunrise-coffee-50g",
] as const;

export const getProductBySlug = async (
  slug: string,
  countryCode: string = "NL",
) => {
  const shouldCache = (
    MOSTLY_VIEWED_PRODUCT_SLUGS as readonly string[]
  ).includes(slug);
  const cacheKey = getMostlyViewdProductsCacheKey(slug, countryCode);

  if (shouldCache) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached !== null && cached !== undefined) {
        return cached;
      }
    } catch (error) {
      console.error(
        "Redis get mostly viewed product failed, falling back to DB:",
        error,
      );
    }
  }

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
          AND rv.status = 'approved'
      ) AS reviews,
      COALESCE(
        (
          SELECT ROUND(AVG(rv.rating)::numeric, 1)::float
          FROM store_product_reviews rv
          WHERE rv.product_id = p.id
            AND rv.status = 'approved'
        ),
        0
      ) AS rating,
      COALESCE(
        (
          SELECT ROUND(AVG(rv.rating)::numeric, 1)::float
          FROM store_product_reviews rv
          WHERE rv.product_id = p.id
            AND rv.status = 'approved'
        ),
        0
      ) AS avg_rating,
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

  const product = {
    ...row,
    rating: Number(row.rating || row.avg_rating || 0),
    avg_rating: Number(row.avg_rating || row.rating || 0),
    reviews: Number(row.reviews || 0),
    images: (row.images || []).map((img: any) => ({
      ...img,
      url: img?.url ? toCleanImageUrl(img.url) : img?.url,
    })),
    highlights: row.highlights || [], // Safely fall back if column doesn't exist
  };

  if (shouldCache) {
    try {
      await redis.set(cacheKey, product, {
        ex: REDIS_TTL.GET_MOSTLY_VIEWD_PRODUCTS,
      });
    } catch (error) {
      console.error("Redis set mostly viewed product failed:", error);
    }
  }

  return product;
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
  return result.rows.map((row: any) => ({
    ...row,
    image: row.image ? toCleanImageUrl(row.image) : row.image,
  }));
};
