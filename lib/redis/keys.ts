export const REDIS_KEYS = {
  SHOP_CATEGORIES: "shop:categories",
  SALE_PRODUCTS: "sale:products",
  /** Home Explore → Shop by Categories → All (limit 10) */
  HOME_EXPLORE_ALL: "home:explore:all",
  /** Home page reviews slider (productId=all) */
  HOME_REVIEWS_ALL: "home:reviews:all",

  /** Home page recipes carousel (limit 3) */
  HOME_RECIPES: "home:recipes",

  /**pakistni brown pakistani-brown-rice-easy-tarka-chaval recipe details */
  PAKISTANI_BROWN_RICE_EASY_TARKA_CHAVAL: "pakistani:brown:rice:easy:tarka:chaval",
  
 

  ///get mostly viewd products  ***/
  GET_MOSTLY_VIEWD_PRODUCTS: "get:mostly:viewd:products",


  /***get the first 20 product of each category */
  GET_FIRST_20_PRODUCT_OF_EACH_CATEGORY: "get:first:20:product:of:each:category",

  /** Category first-page sidebar (unfiltered) */
  CATEGORY_SUBCATEGORIES: "category:subcategories",
  CATEGORY_BRANDS: "category:brands",
} as const;



export const REDIS_TTL = {
  SHOP_CATEGORIES: 3600,
  SALE_PRODUCTS: 3600,
  HOME_EXPLORE_ALL: 3600,
  HOME_REVIEWS_ALL: 3600,
  HOME_RECIPES: 3600,
  PAKISTANI_BROWN_RICE_EASY_TARKA_CHAVAL: 3600,
  GET_MOSTLY_VIEWD_PRODUCTS: 3600,
  GET_FIRST_20_PRODUCT_OF_EACH_CATEGORY: 3600,
  CATEGORY_SUBCATEGORIES: 3600,
  CATEGORY_BRANDS: 3600,
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

 /***trs pure butter ghee 1kg*/


/***get mostly viewd products */
export function getMostlyViewdProductsCacheKey(slug: string, countryCode: string = "NL") {
  return `${REDIS_KEYS.GET_MOSTLY_VIEWD_PRODUCTS}:${slug}:${countryCode.toUpperCase()}`;
}

/***get the first 20 product of each category */
export function getFirst20ProductOfEachCategoryCacheKey(category:string, countryCode: string = "NL") {
  return `${REDIS_KEYS.GET_FIRST_20_PRODUCT_OF_EACH_CATEGORY}:${category}:${countryCode.toUpperCase()}`;
}

/** Category first-page subcategories sidebar (unfiltered). */
export function categorySubcategoriesCacheKey(category: string) {
  return `${REDIS_KEYS.CATEGORY_SUBCATEGORIES}:${category}`;
}

/** Category first-page brands sidebar (unfiltered). */
export function categoryBrandsCacheKey(category: string) {
  return `${REDIS_KEYS.CATEGORY_BRANDS}:${category}`;
}