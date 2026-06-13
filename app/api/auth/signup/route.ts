// apps/web/app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { runQuery } from "@/core/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    // check existing user
    const existing = await runQuery(`SELECT id FROM users WHERE email = $1`, [
      email,
    ]);

    if ((existing?.rowCount ?? 0) > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await runQuery(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1,$2,$3)
       RETURNING id, email`,
      [email, hash, name || null],
    );

    return NextResponse.json({
      success: true,
      user: result.rows[0],
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);

    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
