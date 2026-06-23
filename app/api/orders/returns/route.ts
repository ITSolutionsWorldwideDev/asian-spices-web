// app/api/orders/returns/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/core/db";

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  try {
    const body = await req.json();
    const { orderId, reason, items } = body;

    if (!orderId || !reason || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required return details" },
        { status: 400 },
      );
    }

    await client.query("BEGIN");

    // 1. Insert master return record
    const masterRes = await client.query(
      `INSERT INTO store_order_returns (order_id, reason, status) 
       VALUES ($1, $2, 'pending') RETURNING id`,
      [orderId, reason],
    );
    const returnId = masterRes.rows[0].id;

    // 2. Insert return items mapping split
    for (const item of items) {
      await client.query(
        `INSERT INTO store_order_return_items (return_id, product_id, quantity) 
         VALUES ($1, $2, $3)`,
        [returnId, item.productId, item.quantity],
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ success: true, returnId });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Return insertion transaction failed:", error);
    return NextResponse.json(
      { error: "Internal Database Error" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    let query = `
      SELECT r.*, 
             json_agg(json_build_object('product_id', ri.product_id, 'quantity', ri.quantity)) as items
      FROM store_order_returns r
      LEFT JOIN store_order_return_items ri ON r.id = ri.return_id
    `;

    const params = [];
    if (orderId) {
      query += ` WHERE r.order_id = $1`;
      params.push(orderId);
    }

    query += ` GROUP BY r.id ORDER BY r.created_at DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
