import { pool } from "@/core/db";
import {
  ingredientSearchPatterns,
  pickBestProductMatch,
  type IngredientProductMatch,
} from "@/lib/ingredientProductMatch";

export async function getProductsMatchingIngredientNames(
  names: string[],
  countryCode = "NL",
): Promise<Array<IngredientProductMatch | null>> {
  const ingredientNames = names.map((name) => String(name ?? "").trim());
  if (!ingredientNames.some(Boolean)) {
    return ingredientNames.map(() => null);
  }

  const patterns = [
    ...new Set(ingredientNames.flatMap((name) => ingredientSearchPatterns(name))),
  ];

  if (!patterns.length) {
    return ingredientNames.map(() => null);
  }

  const query = `
    SELECT
      p.id::text AS id,
      p.name,
      p.slug,
      p.base_price,
      p.discount_type,
      p.discount_value,
      p.promo_code,
      p.category_id::text AS category_id,
      c.slug AS category_slug,
      img.file_url AS image,
      cat.min_offered_price
    FROM store_products p
    INNER JOIN (
      SELECT
        spc.product_id,
        MIN(spc.price) AS min_offered_price
      FROM public.store_product_catalog spc
      INNER JOIN public.store_settings ss ON ss.store_id = spc.store_id
      WHERE ss.country_code = $1 AND spc.status = 1
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
    WHERE EXISTS (
      SELECT 1
      FROM unnest($2::text[]) AS pattern
      WHERE p.name ILIKE pattern
    )
    LIMIT 250
  `;

  const result = await pool.query(query, [
    countryCode.toUpperCase(),
    patterns,
  ]);

  return ingredientNames.map((name) => {
    if (!name) return null;
    const match = pickBestProductMatch(name, result.rows);
    if (!match) return null;

    return {
      id: match.id,
      name: match.name,
      slug: match.slug,
      image: match.image ?? null,
      base_price: Number(match.base_price || 0),
      min_offered_price:
        match.min_offered_price === null || match.min_offered_price === undefined
          ? null
          : Number(match.min_offered_price),
      discount_type: match.discount_type ?? null,
      discount_value: match.discount_value ?? null,
      promo_code: match.promo_code ?? null,
      category_id: match.category_id ?? null,
      category_slug: match.category_slug ?? null,
    };
  });
}
