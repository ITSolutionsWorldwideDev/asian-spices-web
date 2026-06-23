// app/api/account/orders/action/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/core/db";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const { orderId, reason, comments, items } = body;

    if (
      !orderId ||
      !reason ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Missing required request parameters or empty item selection.",
        },
        { status: 400 },
      );
    }

    if (reason === "other" && (!comments || comments.trim().length < 10)) {
      return NextResponse.json(
        {
          error: "Detailed description is required for custom reason requests.",
        },
        { status: 400 },
      );
    }

    await client.query("BEGIN");

    const combinedNotes = comments ? `User Note: ${comments.trim()}` : null;

    const returnInsertQuery = `
      INSERT INTO store_order_returns (order_id, reason, admin_notes, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING id;
    `;
    const returnResult = await client.query(returnInsertQuery, [
      orderId,
      reason,
      combinedNotes,
    ]);
    const returnId = returnResult.rows[0].id;

    const itemInsertQuery = `
      INSERT INTO store_order_return_items (return_id, product_id, quantity)
      VALUES ($1, $2, $3);
    `;

    for (const item of items) {
      await client.query(itemInsertQuery, [
        returnId,
        item.itemId,
        item.quantity,
      ]);
    }

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        message: "Return request filed successfully.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Database return registration transaction crash:", error);
    return NextResponse.json(
      { error: "Internal Database processing failure saving return details." },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
