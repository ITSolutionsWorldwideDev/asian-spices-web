// /api/auth/reset-password/route.ts

import bcrypt from "bcryptjs";
import { pool } from "@/core/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, otp, password, token } = await req.json();
  const client = await pool.connect();

  try {
    // Legacy link-based reset (token in URL)
    if (token && !otp) {
      const { rows } = await client.query(
        `SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > now()`,
        [token],
      );

      if (!rows.length) {
        return NextResponse.json(
          { error: "Your reset link has expired or is invalid." },
          { status: 400 },
        );
      }

      const record = rows[0];
      const hash = await bcrypt.hash(password, 10);

      await client.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [
        hash,
        record.user_id,
      ]);
      await client.query(`DELETE FROM password_reset_tokens WHERE user_id = $1`, [
        record.user_id,
      ]);

      return NextResponse.json({ success: true });
    }

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: "Email, verification code, and password are required." },
        { status: 400 },
      );
    }

    const userRes = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email],
    );

    if (!userRes.rows.length) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 },
      );
    }

    const userId = userRes.rows[0].id;

    const { rows } = await client.query(
      `SELECT * FROM password_reset_tokens
       WHERE user_id = $1 AND expires_at > now()
       ORDER BY id DESC
       LIMIT 1`,
      [userId],
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "Your verification code has expired. Please request a new one." },
        { status: 400 },
      );
    }

    const record = rows[0];
    const otpValid = await bcrypt.compare(String(otp).trim(), record.token);

    if (!otpValid) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 },
      );
    }

    const hash = await bcrypt.hash(password, 10);

    await client.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [
      hash,
      userId,
    ]);
    await client.query(`DELETE FROM password_reset_tokens WHERE user_id = $1`, [
      userId,
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Reset Password] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    client.release();
  }
}
