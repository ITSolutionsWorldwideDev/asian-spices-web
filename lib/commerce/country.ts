import { cookies } from "next/headers";

export const COUNTRY_COOKIE = "selected_country";
export const DEFAULT_COUNTRY = "NL";

/** Country for server-rendered pricing: ?country= wins, then the cookie set by the country picker. */
export const resolveCountry = async (fromQuery?: string | string[]) => {
  const queryValue = Array.isArray(fromQuery) ? fromQuery[0] : fromQuery;
  if (queryValue) return queryValue;

  const cookieStore = await cookies();
  return cookieStore.get(COUNTRY_COOKIE)?.value || DEFAULT_COUNTRY;
};
