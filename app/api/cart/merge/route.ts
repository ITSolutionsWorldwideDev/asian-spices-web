// app/api/cart/merge/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/core/db";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";

export async function POST(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ---------------- GET CUSTOMER ---------------- */
    let validUserId: string | null = null;
    if (session.user.id) {
      const userCheck = await client.query(
        `SELECT id FROM users WHERE id = $1 LIMIT 1`,
        [session.user.id],
      );
      if (userCheck.rowCount) {
        validUserId = userCheck.rows[0].id;
      }
    }

    if (!validUserId && session.user.email) {
      const emailCheck = await client.query(
        `SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
        [session.user.email],
      );
      if (emailCheck.rowCount) {
        validUserId = emailCheck.rows[0].id;
      }
    }

    let customerRes = validUserId
      ? await client.query(
          `SELECT id FROM store_customers WHERE user_id = $1 LIMIT 1`,
          [validUserId],
        )
      : session.user.email
      ? await client.query(
          `SELECT id FROM store_customers WHERE LOWER(email) = LOWER($1) LIMIT 1`,
          [session.user.email],
        )
      : { rowCount: 0, rows: [] };

    let customerId;

    if (!customerRes.rowCount) {
      if (validUserId) {
        const newCustomer = await client.query(
          `INSERT INTO store_customers (user_id, email)
           VALUES ($1, $2)
           RETURNING id`,
          [validUserId, session.user.email || null],
        );
        customerId = newCustomer.rows[0].id;
      } else if (session.user.email) {
        const newCustomer = await client.query(
          `INSERT INTO store_customers (email)
           VALUES ($1)
           RETURNING id`,
          [session.user.email],
        );
        customerId = newCustomer.rows[0].id;
      } else {
        await client.query("ROLLBACK");
        return NextResponse.json({ success: true, message: "No customer to merge" });
      }
    } else {
      customerId = customerRes.rows[0].id;
    }

    /* ---------------- GET CART ---------------- */

    let cartRes = await client.query(
      `SELECT id FROM store_carts WHERE global_customer_id = $1`,
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

    /* ---------------- MERGE ITEMS ---------------- */

    for (const item of items) {
      await client.query(
        `
        INSERT INTO store_cart_items (cart_id, product_id, quantity, price)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (cart_id, product_id)
        DO UPDATE SET quantity = store_cart_items.quantity + EXCLUDED.quantity
        `,
        [cartId, item.id, item.quantity, item.base_price],
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
