export type IngredientProductMatch = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  base_price: number;
  min_offered_price: number | null;
  discount_type?: string | null;
  discount_value?: number | string | null;
  promo_code?: string | null;
  category_id?: string | null;
  category_slug?: string | null;
};

export function normalizeIngredientName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(
      /\b(fresh|dried|ground|chopped|sliced|minced|crushed|powdered|optional|garnish|to|taste|for|and|the|of|a|an|or|with)\b/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

export function ingredientSearchPatterns(name: string) {
  const patterns = new Set<string>();
  const cleaned = name.replace(/[%_]/g, " ").replace(/\s+/g, " ").trim();
  const normalized = normalizeIngredientName(cleaned);

  if (cleaned) patterns.add(`%${cleaned}%`);
  if (normalized) patterns.add(`%${normalized}%`);

  for (const token of normalized.split(" ")) {
    if (token.length >= 3) patterns.add(`%${token}%`);
  }

  return [...patterns];
}

export function pickBestProductMatch<T extends { name: string }>(
  ingredientName: string,
  products: T[],
): T | null {
  const needle = normalizeIngredientName(ingredientName);
  if (needle.length < 2) return null;

  const needleTokens = needle.split(" ").filter((token) => token.length >= 2);
  let best: { product: T; score: number } | null = null;

  for (const product of products) {
    const hay = normalizeIngredientName(product.name);
    if (!hay) continue;

    let score = 0;
    if (hay === needle) {
      score = 100;
    } else if (hay.includes(needle) || needle.includes(hay)) {
      const shorter = Math.min(hay.length, needle.length);
      const longer = Math.max(hay.length, needle.length);
      score = 70 + Math.round((shorter / longer) * 25);
    } else if (
      needleTokens.length > 0 &&
      needleTokens.every((token) => hay.split(" ").includes(token))
    ) {
      score = 80;
    } else {
      continue;
    }

    if (!best || score > best.score) {
      best = { product, score };
    }
  }

  return best && best.score >= 70 ? best.product : null;
}
