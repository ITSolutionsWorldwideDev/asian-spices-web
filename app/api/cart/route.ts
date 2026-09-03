// app/api/cart/route.ts

import { pool } from "@/core/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";

// ✅ GET CART
export async function GET(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const client = await pool.connect();

  try {
    const customerId = await getOrCreateCustomer(client, session.user);
    // console.log('customerId === ',customerId);

    const cartRes = await client.query(
      `SELECT id FROM store_carts WHERE global_customer_id = $1 LIMIT 1`,
      [customerId],
    );

    if (!cartRes.rowCount) return NextResponse.json([]);

    // LEFT JOIN store_product_images pi ON pi.product_id = p.id AND pi.is_primary = true
    // LEFT JOIN media md ON md.media_id = pi.url::int

    const items = await client.query(
      `
        SELECT 
          sci.product_id,
          sci.quantity,
          p.name AS title,
          p.slug,
          sci.price::numeric AS base_price,
          p.discount_type,
          p.discount_value,
          p.sale_price,
          p.promo_code,
          c.slug AS category_slug,
          sc.slug AS subcategory_slug,
          img.file_url AS image 
        FROM store_cart_items sci
        INNER JOIN store_products p ON p.id = sci.product_id
        LEFT JOIN store_categories c ON c.id = p.category_id
        LEFT JOIN store_subcategories sc ON sc.id = p.subcategory_id
        LEFT JOIN (
          SELECT DISTINCT ON (pi.product_id) 
            pi.product_id, 
            md.file_url
          FROM store_product_images pi
          LEFT JOIN media md ON md.media_id = pi.url::int
          ORDER BY pi.product_id, pi.is_primary DESC, pi.id ASC
        ) img ON img.product_id = p.id
        WHERE sci.cart_id = $1
      `,
      [cartRes.rows[0].id],
    );

    return NextResponse.json(items.rows);
  } finally {
    client.release();
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(webAuthOptions);

  const client = await pool.connect();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { product_id, quantity, price } = await req.json();

  const cartPrice = Number(price);
  if (!product_id || !cartPrice || cartPrice <= 0) {
    return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
  }

  try {
    const customerId = await getOrCreateCustomer(client, session.user);

    let cartRes = await client.query(
      `SELECT id FROM store_carts WHERE global_customer_id = $1 LIMIT 1`,
      [customerId],
    );

    let cartId;

    if (!cartRes.rowCount) {
      const newCart = await client.query(
        `INSERT INTO store_carts (global_customer_id)
         VALUES ($1)
         RETURNING id`,
        [customerId],
      );

      cartId = newCart.rows[0].id;
    } else {
      cartId = cartRes.rows[0].id;
    }

    const result = await client.query(
      `INSERT INTO store_cart_items (cart_id, product_id, quantity, price)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET quantity = store_cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [cartId, product_id, quantity, cartPrice],
    );

    return NextResponse.json(result.rows[0]);
  } finally {
    client.release();
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(webAuthOptions);

  console.log('Empty Cart Operation session?.user?.id === ',session?.user?.id);

  if (!session?.user?.id) {
    return NextResponse.json({}, { status: 401 });
  }

  let product_id: string | undefined;
  try {
    const body = await req.json().catch(() => ({}));
    product_id = body.product_id;
  } catch {
    product_id = undefined;
  }

  console.log('Empty Cart Operation product_id === ',product_id);


  /* ---------------- FIND CART ---------------- */

  const client = await pool.connect();

  try {
    const customerId = await getOrCreateCustomer(client, session.user);

    const cartRes = await client.query(
      `SELECT id FROM store_carts WHERE global_customer_id = $1 LIMIT 1`,
      [customerId],
    );

    if (!cartRes.rowCount) {
      return NextResponse.json({ success: true });
    }

    const cartId = cartRes.rows[0].id;

    /* ---------------- DELETE ITEM OR CLEAR ALL ---------------- */
    if (product_id) {
      // 1. If a specific product_id is provided, delete only that item
      await client.query(
        `DELETE FROM store_cart_items 
         WHERE cart_id = $1 AND product_id = $2`,
        [cartId, product_id],
      );
    } else {
      // 2. 🚀 If NO product_id is provided, clear the ENTIRE cart (for Checkout Clear)
      await client.query(
        `DELETE FROM store_cart_items 
         WHERE cart_id = $1`,
        [cartId],
      );
    }


    return NextResponse.json({ success: true });
  } finally {
    client.release();
  }
}

async function getOrCreateCustomer(client: any, user: any) {
  const email = user.email;

  // Swapped "customers" out for your ecommerce namespace "store_customers"
  const existing = await client.query(
    `SELECT id FROM store_customers WHERE user_id = $1 LIMIT 1`,
    [user.id],
  );

  if (existing.rowCount) {
    return existing.rows[0].id;
  }

  const created = await client.query(
    `INSERT INTO store_customers (user_id, email)
     VALUES ($1, $2)
     RETURNING id`,
    [user.id, email],
  );

  return created.rows[0].id;
}
