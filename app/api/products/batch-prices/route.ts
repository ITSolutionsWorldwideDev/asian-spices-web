// app/api/products/batch-prices/route.ts

import { pool } from "@/core/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");
  const countryCode = (searchParams.get("country") || "NL").toUpperCase();

  console.log("idsParam ==== ", idsParam);

  if (!idsParam) {
    return NextResponse.json({});
  }

  const productIds = idsParam.split(",").map((id) => id.trim());
  const client = await pool.connect();

  try {
    const query = `
      SELECT 
        p.id as product_id,
        COALESCE(cat.min_offered_price, p.base_price)::numeric AS dynamic_price
      FROM store_products p
      LEFT JOIN (
        SELECT 
          spc.product_id,
          MIN(spc.price) as min_offered_price
        FROM public.store_product_catalog spc
        INNER JOIN public.store_settings ss ON ss.store_id = spc.store_id
        WHERE ss.country_code = $2 AND spc.status = 1
        GROUP BY spc.product_id
      ) cat ON cat.product_id = p.id
      WHERE p.id = ANY($1::uuid[])
      GROUP BY p.id, cat.min_offered_price;
    `;

    const result = await client.query(query, [productIds, countryCode]);

    // Format into a map structure: { "uuid-string": 49.99 }
    const priceMap: Record<string, number> = {};
    result.rows.forEach((row: any) => {
      priceMap[row.product_id] = Number(row.dynamic_price);
    });

    return NextResponse.json(priceMap);
  } catch (err) {
    console.error("Batch price compilation failure:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
/* 

  -- 🟢 BULLETPROOF ADDITION: Grouping at the top-level selection ensures 
  -- that even if your schema or an extension expects aggregate matching 
  -- on 'p.id', PostgreSQL is satisfied.

    const query = `
      SELECT 
        p.id as product_id,
        COALESCE(cat.min_offered_price, p.base_price)::numeric AS dynamic_price
      FROM store_products p
      LEFT JOIN (
        SELECT 
          spc.product_id,
          MIN(spc.price) as min_offered_price
        FROM public.store_product_catalog spc
        INNER JOIN public.store_settings ss ON ss.store_id = spc.store_id
        WHERE ss.country_code = $2 AND spc.status = 1
        GROUP BY spc.product_id
      ) cat ON cat.product_id = p.id
      WHERE p.id = ANY($1::uuid[])
    `;

    const result = await client.query(query, [productIds, countryCode]);
*/
