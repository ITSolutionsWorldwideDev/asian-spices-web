// apps/web/app/api/products/reviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getProductReviews } from "@/lib/dbactions/products";
import { pool } from "@/core/db";

// ✅ GET REVIEWS
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const productId = searchParams.get("productId");
  const page = Number(searchParams.get("page") || 1);

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const data = await getProductReviews(productId, page);

  return NextResponse.json(data);
}

// ✅ POST REVIEW

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { product_id, name, email, rating, comment } = body;

  if (!product_id || !rating || !comment) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  // 🔥 Insert as guest review (no customer required)
  await pool.query(
    `INSERT INTO store_product_reviews 
     (product_id, rating, comment, guest_name, guest_email, status)
     VALUES ($1, $2, $3, $4, $5, 'pending')`,
    [product_id, rating, comment, name || null, email || null]
  );

  return NextResponse.json({ success: true });
}


/* export async function POST(req: NextRequest) {
  const body = await req.json();

  const { product_id, name, email, rating, comment } = body;

  if (!product_id || !rating || !comment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // ⚠️ TEMP: create dummy customer (you should replace with auth user later)
  const customerRes = await pool.query(
    `INSERT INTO store_customers (name, email)
     VALUES ($1, $2)
     RETURNING id`,
    [name, email]
  );

  const customerId = customerRes.rows[0].id;

  await pool.query(
    `INSERT INTO store_product_reviews (product_id, customer_id, rating, comment, status)
     VALUES ($1, $2, $3, $4, 'pending')`,
    [product_id, customerId, rating, comment]
  );

  return NextResponse.json({ success: true });
}
 */