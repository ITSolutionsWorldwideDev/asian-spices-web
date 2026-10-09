// app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { runQuery } from "@/core/db";
import { sendAccountWelcomeEmail } from "@/core/email-templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, name, acceptedTerms } = body;

    if (acceptedTerms !== true) {
      return NextResponse.json(
        { error: "Please agree to the Terms & Conditions and Privacy Policy" },
        { status: 400 },
      );
    }

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

    const userId = result.rows[0].id;
    const nameParts = (name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Ensure store_customers record is linked/created with the customer's name
    await runQuery(
      `INSERT INTO store_customers (user_id, first_name, last_name, email)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET 
         user_id = EXCLUDED.user_id, 
         first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), store_customers.first_name), 
         last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), store_customers.last_name)`,
      [userId, firstName, lastName, email],
    ).catch(() => {});

    // Send welcome email (awaited for Vercel/serverless runtime stability)
    try {
      await sendAccountWelcomeEmail({
        email,
        name: name || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
    } catch (emailErr) {
      console.error("[Signup Welcome Email Error]:", emailErr);
    }

    return NextResponse.json({
      success: true,
      user: result.rows[0],
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);

    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
