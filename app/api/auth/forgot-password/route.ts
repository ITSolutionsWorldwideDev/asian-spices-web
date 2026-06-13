// /api/auth/forgot-password/route.ts

import { randomUUID } from "crypto";
import { pool } from "@/core/db";

export async function POST(req: Request) {
  const { email } = await req.json();

  const client = await pool.connect();

  const { rows } = await client.query(
    `SELECT id FROM users WHERE email = $1`,
    [email],
  );

  if (!rows.length) {
    return Response.json({ success: true }); // hide existence
  }

  const token = randomUUID();

  await client.query(
    `INSERT INTO password_reset_tokens (user_id, token, expires_at)
     VALUES ($1,$2, now() + interval '1 hour')`,
    [rows[0].id, token],
  );

  client.release();

  console.log(`RESET LINK: /reset-password?token=${token}`);

  return Response.json({ success: true });
}