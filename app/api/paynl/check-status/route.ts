// apps/web/app/api/paynl/check-status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/core/db";

const PAYNL_API_TOKEN = process.env.PAYNL_API_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId" },
        { status: 400 }
      );
    }

    // 1️⃣ Get order
    const { rows } = await pool.query(
      `SELECT * FROM store_orders WHERE id = $1`,
      [orderId]
    );

    const order = rows[0];

    if (!order || !order.transaction_id) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Call Pay.nl API
    const res = await fetch(
      `https://connect.pay.nl/v1/orders/${order.transaction_id}`,
      {
        headers: {
          Authorization: `Bearer ${PAYNL_API_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Pay.nl check failed:", data);
      return NextResponse.json(
        { success: false, error: "Failed to verify payment" },
        { status: 500 }
      );
    }

    const status = data?.status?.action?.toLowerCase();

    // 3️⃣ Map status
    let paymentStatus: "pending" | "paid" | "failed" = "pending";

    if (status === "paid") paymentStatus = "paid";
    else if (["failed", "cancelled", "expired"].includes(status)) {
      paymentStatus = "failed";
    }

    // 4️⃣ Update DB (idempotent)
    await pool.query(
      `
      UPDATE store_orders
      SET payment_status = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [paymentStatus, orderId]
    );

    return NextResponse.json({
      success: true,
      paymentStatus,
    });
  } catch (err) {
    console.error("Check status error:", err);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}