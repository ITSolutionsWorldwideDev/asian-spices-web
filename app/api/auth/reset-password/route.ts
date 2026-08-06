// /api/auth/reset-password/route.ts

import bcrypt from "bcryptjs";
import { pool } from "@/core/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > now()`,
      [token]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Your reset link has expired or is invalid." }, { status: 400 });
    }

    const record = rows[0];
    const hash = await bcrypt.hash(password, 10);

    await client.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [hash, record.user_id]);
    await client.query(`DELETE FROM password_reset_tokens WHERE id = $1`, [record.id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    client.release(); // This is now guaranteed to execute safely
  }
}
/* 
export async function POST(req: Request) {
  const { token, password } = await req.json();

  const client = await pool.connect();

  const { rows } = await client.query(
    `SELECT * FROM password_reset_tokens 
     WHERE token = $1 AND expires_at > now()`,
    [token],
  );

  if (!rows.length) {
    return Response.json({ error: "Invalid token" }, { status: 400 });
  }

  const record = rows[0];

  const hash = await bcrypt.hash(password, 10);

  await client.query(
    `UPDATE users SET password_hash = $1 WHERE id = $2`,
    [hash, record.user_id],
  );

  await client.query(
    `DELETE FROM password_reset_tokens WHERE id = $1`,
    [record.id],
  );

  client.release();

  return Response.json({ success: true });
} */