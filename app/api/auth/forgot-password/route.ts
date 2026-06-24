// /api/auth/forgot-password/route.ts 

import { randomUUID } from "crypto";
import { pool } from "@/core/db";
import { sendPasswordResetEmail } from "@/core/email-templates";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const client = await pool.connect();

    try {
      // Look up if user profile target exists
      const { rows } = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
      );

      // Return a 200 OK success indicator even if the profile is missing 
      // to safely prevent malicious email user enumeration attacks.
      if (!rows.length) {
        return NextResponse.json({ success: true });
      }

      const token = randomUUID();

      // Write token allocation payload record to the active database cluster state
      await client.query(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at)
         VALUES ($1, $2, now() + interval '1 hour')`,
        [rows[0].id, token]
      );

      // Dispatch your formatted support email payload directly over the connection pipeline
      await sendPasswordResetEmail({ email, token });

      return NextResponse.json({ success: true });
    } finally {
      // Clean up connection handles across all potential control pathways
      client.release();
    }
  } catch (error) {
    console.error("[Forgot Password Controller Crash]:", error);
    return NextResponse.json({ error: "Internal System Error" }, { status: 500 });
  }
}

/* import { randomUUID } from "crypto";
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
} */