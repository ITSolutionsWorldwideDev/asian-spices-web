import { getOrSet } from "@/lib/redis/cache";
import { REDIS_TTL, saleProductsCacheKey } from "@/lib/redis/keys";
import { getProducts } from "@/lib/dbactions/products/list";

/** Home Flash Sale carousel products (sale_only), cached in Redis — no limit. */
export const getFlashSaleProducts = async (countryCode: string = "NL") =>
  getOrSet(saleProductsCacheKey(countryCode), REDIS_TTL.SALE_PRODUCTS, () =>
    getProducts({
      saleOnly: true,
      sort: "newest",
      page: 1,
      limit: null,
      countryCode,
      showUnavailable: true,
      category: "",
    }),
  );
