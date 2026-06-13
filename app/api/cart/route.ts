// apps/web/app/api/cart/route.ts

import { pool } from "@/core/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";

// ✅ GET CART
export async function GET() {
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

    /* const items = await client.query(
      `SELECT * FROM store_cart_items WHERE cart_id = $1`,
      [cartRes.rows[0].id],
    ); */

    const items = await client.query(
      `
        SELECT 
          sci.product_id,
          sci.quantity,
          p.name AS title,
          p.price::numeric AS price,
          md.file_url AS image
        FROM store_cart_items sci
        LEFT JOIN store_products p ON p.id = sci.product_id
        LEFT JOIN store_product_images pi ON pi.product_id = p.id AND pi.is_primary = true
        LEFT JOIN media md ON md.media_id = pi.url::int
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

  // const { product_id, price, quantity } = await req.json();
  const { product_id, quantity } = await req.json();

  /* ---------------- GET PRICE FROM DB ---------------- */

  const productRes = await client.query(
    `
    SELECT price 
    FROM store_products 
    WHERE id = $1
    `,
    [product_id],
  );

  if (!productRes.rowCount) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const price = productRes.rows[0].price;

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
      [cartId, product_id, quantity, price],
    );

    return NextResponse.json(result.rows[0]);
  } finally {
    client.release();
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({}, { status: 401 });
  }

  const { product_id } = await req.json();

  /* ---------------- FIND CUSTOMER ---------------- */

  /* const customerRes = await pool.query(
    `SELECT id FROM store_customers WHERE user_id = $1 LIMIT 1`,
    [session.user.id],
  );

  if (!customerRes.rowCount) {
    return NextResponse.json({ success: true });
  }

  const customerId = customerRes.rows[0].id; */

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

    /* ---------------- DELETE ITEM ---------------- */

    await pool.query(
      `DELETE FROM store_cart_items 
     WHERE cart_id = $1 AND product_id = $2`,
      [cartId, product_id],
    );

    return NextResponse.json({ success: true });
  } finally {
    client.release();
  }
}

async function getOrCreateCustomer(client: any, user: any) {
  const email = user.email;

  const existing = await client.query(
    `SELECT id FROM customers WHERE user_id = $1 LIMIT 1`,
    [user.id],
  );

  if (existing.rowCount) {
    return existing.rows[0].id;
  }

  const created = await client.query(
    `INSERT INTO customers (user_id, email)
     VALUES ($1,$2)
     RETURNING id`,
    [user.id, email],
  );

  return created.rows[0].id;
}

/*


export async function GET() {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 }); // allow guest fallback
  }

  // 1️⃣ Get cart
  const cartRes = await pool.query(
    `SELECT id FROM store_carts WHERE customer_id = $1 LIMIT 1`,
    [session.user.id],
  );

  if (cartRes.rows.length === 0) return NextResponse.json([]);

  const cartId = cartRes.rows[0].id;

  // 2️⃣ Get items
  const items = await pool.query(
    `SELECT * FROM store_cart_items WHERE cart_id = $1`,
    [cartId],
  );

  return NextResponse.json(items.rows);
}




export async function POST(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { product_id, price, quantity } = await req.json();

  // 1️⃣ Find or create cart
  let cartRes = await pool.query(
    `SELECT id FROM store_carts WHERE customer_id = $1 LIMIT 1`,
    [session.user.id],
  );

  let cartId;

  console.log('session.user.id ==== ',session.user.id);

  if (cartRes.rows.length === 0) {

    const newCart = await pool.query(
      `INSERT INTO store_carts (customer_id)
       VALUES ($1)
       RETURNING id`,
      [session.user.id], // ⚠️ replace
    );
    // const newCart = await pool.query(
    //   `INSERT INTO store_carts (customer_id, store_id)
    //    VALUES ($1, $2)
    //    RETURNING id`,
    //   [session.user.id, "YOUR_STORE_ID"], // ⚠️ replace
    // );

    cartId = newCart.rows[0].id;
  } else {
    cartId = cartRes.rows[0].id;
  }

  // 2️⃣ Insert or update item
  const result = await pool.query(
    `INSERT INTO store_cart_items (cart_id, product_id, quantity, price)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (cart_id, product_id)
     DO UPDATE SET quantity = store_cart_items.quantity + $3
     RETURNING *`,
    [cartId, product_id, quantity, price],
  );

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({}, { status: 401 });
  }

  const { product_id } = await req.json();

  const cartRes = await pool.query(
    `SELECT id FROM store_carts WHERE customer_id = $1 LIMIT 1`,
    [session.user.id],
  );

  if (cartRes.rows.length === 0) {
    return NextResponse.json({ success: true });
  }

  const cartId = cartRes.rows[0].id;

  await pool.query(
    `DELETE FROM store_cart_items WHERE cart_id = $1 AND product_id = $2`,
    [cartId, product_id],
  );

  return NextResponse.json({ success: true });
}


// GET — fetch cart from DB
export async function GET() {
  const session = await getServerSession(webAuthOptions);
  console.log(session);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const items = await pool.query(
    `SELECT * FROM cart_items WHERE user_id = $1`,
    [session.user.id],
  );
  return NextResponse.json(items.rows);
}

// POST — add/update item
export async function POST(req: Request) {
  const session = await getServerSession(webAuthOptions);
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const { product_id, title, price, quantity, image } = await req.json();

  const result = await pool.query(
    `INSERT INTO cart_items (user_id, product_id, title, price, quantity, image)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + $5
     RETURNING *`,
    [session.user.id, product_id, title, price, quantity, image],
  );
  return NextResponse.json(result.rows[0]);
}

// DELETE — remove item
export async function DELETE(req: Request) {
  const session = await getServerSession(webAuthOptions);
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const { product_id } = await req.json();
  await pool.query(
    `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`,
    [session.user.id, product_id],
  );
  return NextResponse.json({ success: true });
} */
