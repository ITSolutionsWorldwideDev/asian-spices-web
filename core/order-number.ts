import type { PoolClient } from "pg";

/** Digits after the year, e.g. ORD-20260000000001 */
const SEQUENCE_PAD = 10;

/**
 * Next order number in the form ORD-{year}{sequence}, e.g. ORD-20260000000001.
 * Uses a transaction-scoped advisory lock so concurrent checkouts cannot collide.
 * Must be called inside an open transaction on `client`.
 */
export async function generateNextOrderNumber(
  client: PoolClient,
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `ORD-${year}`;

  // Serialize allocation for this calendar year within the transaction
  await client.query("SELECT pg_advisory_xact_lock($1)", [year]);

  const result = await client.query<{ order_number: string }>(
    `SELECT order_number
     FROM store_orders
     WHERE order_number LIKE $1
     ORDER BY order_number DESC
     LIMIT 1`,
    [`${prefix}%`],
  );

  let nextSeq = 1;
  const last = result.rows[0]?.order_number;
  if (last) {
    const suffix = last.slice(prefix.length);
    const parsed = parseInt(suffix, 10);
    if (!Number.isNaN(parsed)) {
      nextSeq = parsed + 1;
    }
  }

  return `${prefix}${String(nextSeq).padStart(SEQUENCE_PAD, "0")}`;
}
