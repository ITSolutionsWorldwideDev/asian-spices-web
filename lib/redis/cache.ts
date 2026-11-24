import { redis } from "@/lib/redis/client";

/** Cache-aside helper. Redis failures fall open to the fetcher. */
export async function getOrSet<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) return cached;
  } catch (error) {
    console.error(`Redis get ${key} failed, falling back to fetcher:`, error);
  }

  const value = await fetcher();

  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error(`Redis set ${key} failed:`, error);
  }

  return value;
}
