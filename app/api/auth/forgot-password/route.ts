// /api/auth/forgot-password/route.ts

import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { pool } from "@/core/db";
import { sendPasswordResetEmail } from "@/core/email-templates";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const client = await pool.connect();

    try {
      const { rows } = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [email],
      );

      if (!rows.length) {
        return NextResponse.json({ success: true });
      }

      const otp = String(randomInt(100000, 1000000));
      const otpHash = await bcrypt.hash(otp, 10);

      await client.query(
        `DELETE FROM password_reset_tokens WHERE user_id = $1`,
        [rows[0].id],
      );

      await client.query(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at)
         VALUES ($1, $2, now() + interval '15 minutes')`,
        [rows[0].id, otpHash],
      );

      const result = await sendPasswordResetEmail({ email, otp });
      if (!result.success) {
        const message =
          result.error instanceof Error
            ? result.error.message
            : String(result.error ?? "Failed to send password reset email");
        console.error(
          `[Forgot Password] Email dispatch failed for ${email}:`,
          result.error,
        );
        return NextResponse.json(
          { success: false, error: message },
          { status: 500 },
        );
      }

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("[Forgot Password Controller Crash due to]:", error);
    return NextResponse.json(
      { error: "Internal System Error Unable to Send Email" },
      { status: 500 },
    );
  }
}
