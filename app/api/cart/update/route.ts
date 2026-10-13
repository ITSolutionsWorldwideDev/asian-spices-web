// app/api/cart/update/route.ts

import { pool } from "@/core/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";

export async function PATCH(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { product_id, delta } = await req.json();

  if (!product_id || !delta) {
    return NextResponse.json(
      { error: "Missing product_id or delta" },
      { status: 400 },
    );
  }

  const client = await pool.connect();

  try {
    const customerId = await getOrCreateCustomer(client, session.user);
    if (!customerId) {
      return NextResponse.json({ error: "Customer not found" }, { status: 400 });
    }

    const cartRes = await client.query(
      `SELECT id FROM store_carts WHERE global_customer_id = $1 LIMIT 1`,
      [customerId],
    );

    if (!cartRes.rowCount) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const cartId = cartRes.rows[0].id;

    // 🔥 Update quantity safely
    const updateRes = await client.query(
      `
      UPDATE store_cart_items
      SET quantity = quantity + $1
      WHERE cart_id = $2 AND product_id = $3
      RETURNING quantity
      `,
      [delta, cartId, product_id],
    );

    // ❗ If item doesn't exist
    if (!updateRes.rowCount) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const newQty = updateRes.rows[0].quantity;

    // 🔥 AUTO DELETE if quantity <= 0
    if (newQty <= 0) {
      await client.query(
        `DELETE FROM store_cart_items WHERE cart_id = $1 AND product_id = $2`,
        [cartId, product_id],
      );
    }

    return NextResponse.json({ success: true, quantity: newQty });
  } finally {
    client.release();
  }
}

/* ---------------- HELPER ---------------- */


async function getOrCreateCustomer(client: any, user: any) {
  const email = user?.email?.trim();

  // 1️⃣ Verify whether user.id exists in the `users` table to satisfy fk_user constraint
  let validUserId: string | null = null;
  if (user?.id) {
    const userCheck = await client.query(
      `SELECT id FROM users WHERE id = $1 LIMIT 1`,
      [user.id],
    );
    if (userCheck.rowCount) {
      validUserId = userCheck.rows[0].id;
    }
  }

  // 2️⃣ If user.id doesn't exist (e.g. JWT is from another environment/DB), try finding by email
  if (!validUserId && email) {
    const emailCheck = await client.query(
      `SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email],
    );
    if (emailCheck.rowCount) {
      validUserId = emailCheck.rows[0].id;
    }
  }

  // 3️⃣ Check existing in store_customers
  if (validUserId) {
    const existingByUser = await client.query(
      `SELECT id FROM store_customers WHERE user_id = $1 LIMIT 1`,
      [validUserId],
    );
    if (existingByUser.rowCount) {
      return existingByUser.rows[0].id;
    }
  }

  if (email) {
    const existingByEmail = await client.query(
      `SELECT id, user_id FROM store_customers WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email],
    );
    if (existingByEmail.rowCount) {
      if (validUserId && !existingByEmail.rows[0].user_id) {
        await client.query(
          `UPDATE store_customers SET user_id = $1 WHERE id = $2`,
          [validUserId, existingByEmail.rows[0].id],
        ).catch(() => {});
      }
      return existingByEmail.rows[0].id;
    }
  }

  // 4️⃣ Insert into store_customers
  if (validUserId) {
    const created = await client.query(
      `INSERT INTO store_customers (user_id, email)
       VALUES ($1, $2)
       RETURNING id`,
      [validUserId, email || null],
    );
    return created.rows[0].id;
  }

  // Fallback: If user does not exist in users table at all, create guest customer record with email
  if (email) {
    const created = await client.query(
      `INSERT INTO store_customers (email)
       VALUES ($1)
       RETURNING id`,
      [email],
    );
    return created.rows[0].id;
  }

  return null;
}