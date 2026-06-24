// app/api/products/reviews/route.ts


import { NextRequest, NextResponse } from "next/server";
import { getProductReviews } from "@/lib/dbactions/products";
import { pool } from "@/core/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const page = Number(searchParams.get("page") || 1);
    const limit = 10;
    const offset = (page - 1) * limit;

    // ✅ Case A: If fetching general/all reviews for the homepage slider
    if (!productId || productId === "all") {
      const result = await pool.query(
        `SELECT id, rating, comment, guest_name, status 
         FROM store_product_reviews 
         WHERE status = 'approved' OR status = 'pending'
         ORDER BY id DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return NextResponse.json(result.rows);
    }

    // ✅ Case B: Fetching specific item reviews
    const data = await getProductReviews(productId, page);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Database query error inside reviews route:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

/* export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const productId = searchParams.get("productId");
  const page = Number(searchParams.get("page") || 1);

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const data = await getProductReviews(productId, page);

  return NextResponse.json(data);
} */

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
 