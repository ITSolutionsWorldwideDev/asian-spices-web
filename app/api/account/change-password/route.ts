// app/api/account/change-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";
import { pool } from "@/core/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(webAuthOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  const client = await pool.connect();

  const { rows } = await client.query(
    `SELECT password_hash FROM users WHERE id = $1`,
    [session.user.id],
  );

  const valid = await bcrypt.compare(
    currentPassword,
    rows[0].password_hash,
  );

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid current password" },
      { status: 400 },
    );
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await client.query(
    `UPDATE users SET password_hash = $1 WHERE id = $2`,
    [hash, session.user.id],
  );

  client.release();

  return NextResponse.json({ success: true });
}