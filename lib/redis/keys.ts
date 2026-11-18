export const REDIS_KEYS = {
  SHOP_CATEGORIES: "shop:categories",
  SALE_PRODUCTS: "sale:products",
  /** Home Explore → Shop by Categories → All (limit 10) */
  HOME_EXPLORE_ALL: "home:explore:all",
  /** Home page reviews slider (productId=all) */
  HOME_REVIEWS_ALL: "home:reviews:all",

  /** Home page recipes carousel (limit 3) */
  HOME_RECIPES: "home:recipes",


  /**cart items */
  CART_ITEMS: "cart:items",
} as const;



export const REDIS_TTL = {
  SHOP_CATEGORIES: 3600,
  SALE_PRODUCTS: 3600,
  HOME_EXPLORE_ALL: 3600,
  HOME_REVIEWS_ALL: 3600,
  HOME_RECIPES: 3600,
  CART_ITEMS: 3600,
} as const;

/** Flash sale list varies by country catalog (all sale products, no limit). */
export function saleProductsCacheKey(countryCode: string) {
  return `${REDIS_KEYS.SALE_PRODUCTS}:${countryCode.toUpperCase()}`;
}

/** Home Explore the Collection when "All" is selected. */
export function homeExploreAllCacheKey(countryCode: string = "NL") {
  return `${REDIS_KEYS.HOME_EXPLORE_ALL}:10:${countryCode.toUpperCase()}`;
}

/** Home page reviews slider only (productId=all). */
export function homeReviewsAllCacheKey(page: number = 1) {
  return `${REDIS_KEYS.HOME_REVIEWS_ALL}:${page}`;
}

/** Home page recipes only (limit 3). */
export function homeRecipesCacheKey() {
  return `${REDIS_KEYS.HOME_RECIPES}:3`;
}

/** Cart items. */
export function cartItemsCacheKey(userId: string) {
  return `${REDIS_KEYS.CART_ITEMS}:${userId}`;
}