// app/api/wishlist/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";
import { pool } from "@/core/db";

export async function GET() {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const client = await pool.connect();
  try {
    const items = await client.query(
      `
        SELECT 
            p.id,
            p.name,
            p.price,
            p.slug,
            c.slug as category_slug,
            md.file_url AS image
        FROM wishlists w
        LEFT JOIN store_products p ON p.id = w.product_id
        LEFT JOIN store_categories c ON c.id = p.category_id
        LEFT JOIN store_product_images pi ON pi.product_id = p.id AND pi.is_primary = true
        LEFT JOIN media md ON md.media_id = pi.url::int
        WHERE w.user_id = $1
        ORDER BY w.created_at DESC
    `,
      [session.user.id],
    );

    return NextResponse.json(items.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    client.release(); // Essential to avoid leaking database pool processes
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const client = await pool.connect();

  const { product_id } = await req.json();

  await client.query(
    `
        INSERT INTO wishlists(user_id, product_id)
        VALUES($1, $2)
        ON CONFLICT(user_id, product_id) DO NOTHING
    `,
    [session.user.id, product_id],
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const client = await pool.connect();

  const { product_id } = await req.json();

  if (product_id === "all") {
    await client.query(`DELETE FROM wishlists WHERE user_id = $1`, [
      session.user.id,
    ]);
  } else {
    await client.query(
      `DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2`,
      [session.user.id, product_id],
    );
  }

  // await client.query(
  //   `
  //       DELETE FROM wishlists
  //       WHERE user_id = $1
  //       AND product_id = $2
  //   `,
  //   [session.user.id, product_id],
  // );

  return NextResponse.json({ success: true });
}
