import { NextRequest, NextResponse } from "next/server";
import {
  getProductReviews,
  getRecipeReviews,
} from "@/lib/dbactions/products";
import { pool } from "@/core/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const recipeId = searchParams.get("recipeId");
    const page = Number(searchParams.get("page") || 1);
    const limit = 10;
    const offset = (page - 1) * limit;

    if (recipeId) {
      const data = await getRecipeReviews(recipeId, page);
      return NextResponse.json(data);
    }

    // Homepage / general reviews slider
    if (!productId || productId === "all") {
      const result = await pool.query(
        `SELECT id, rating, comment, guest_name, status 
         FROM store_product_reviews 
         WHERE status = 'approved' OR status = 'pending'
         ORDER BY id DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset],
      );
      return NextResponse.json(result.rows);
    }

    const data = await getProductReviews(productId, page);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Database query error inside reviews route:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { product_id, recipe_id, name, email, rating, comment } = body;

    if (!rating || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!product_id && !recipe_id) {
      return NextResponse.json(
        { error: "Missing product_id or recipe_id" },
        { status: 400 },
      );
    }

    await pool.query(
      `INSERT INTO store_product_reviews 
       (product_id, recipe_id, rating, comment, guest_name, guest_email, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      [
        product_id || null,
        recipe_id || null,
        rating,
        comment,
        name || null,
        email || null,
      ],
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("CREATE REVIEW ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit review" },
      { status: 500 },
    );
  }
}
