///api/account/profile/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";
import { pool } from "@/core/db";
import { profileSchema } from "@/lib/validation/account";

export async function GET() {
  const session = await getServerSession(webAuthOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `SELECT c.first_name,c.last_name,c.phone, u.id, u.email, u.name,
          COALESCE(
              NULLIF(TRIM(CONCAT(c.first_name, ' ', c.last_name)), ''),
              u.name
          ) AS displayname
      FROM users as u 
      LEFT JOIN store_customers c ON c.user_id = u.id
       WHERE u.id = $1`,
      [session.user.id],
    );
    // SELECT id, email, name FROM users 

    return NextResponse.json({ user: rows[0] });
  } finally {
    client.release();
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const client = await pool.connect();

  try {
    await client.query(
      `UPDATE users SET name = $1 WHERE id = $2`,
      [parsed.data.name, session.user.id],
    );

    return NextResponse.json({ success: true });
  } finally {
    client.release();
  }
}