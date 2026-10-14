// app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { runQuery } from "@/core/db";
import { sendAccountWelcomeEmail } from "@/core/email-templates";
import { verifyRecaptcha, generateSignupAuthToken } from "@/lib/recaptcha";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, name, acceptedTerms, captchaToken } = body;

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

    // Verify reCAPTCHA token if configured
    if (process.env.RECAPTCHA_SECRET_KEY) {
      const captchaResult = await verifyRecaptcha(captchaToken);
      if (!captchaResult.success) {
        return NextResponse.json(
          { error: captchaResult.message || "CAPTCHA verification failed. Please try again." },
          { status: 400 },
        );
      }
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
    try {
      const existingCustomer = await runQuery(
        `SELECT id FROM store_customers WHERE LOWER(email) = LOWER($1) LIMIT 1`,
        [email],
      );

      if ((existingCustomer?.rowCount ?? 0) > 0) {
        await runQuery(
          `UPDATE store_customers 
           SET user_id = $1,
               first_name = COALESCE(NULLIF($2, ''), first_name),
               last_name = COALESCE(NULLIF($3, ''), last_name)
           WHERE LOWER(email) = LOWER($4)`,
          [userId, firstName, lastName, email],
        );
      } else {
        await runQuery(
          `INSERT INTO store_customers (user_id, first_name, last_name, email)
           VALUES ($1, $2, $3, $4)`,
          [userId, firstName, lastName, email],
        );
      }
    } catch (custErr) {
      console.warn("[store_customers link warning]:", custErr);
    }

    // Send welcome email (awaited for Vercel/serverless runtime stability)
    let emailResult: any = null;
    try {
      emailResult = await sendAccountWelcomeEmail({
        email,
        name: name || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
    } catch (emailErr: any) {
      console.error("[Signup Welcome Email Error]:", emailErr);
      emailResult = { success: false, error: emailErr?.message };
    }

    const signupBypass = generateSignupAuthToken(email);

    return NextResponse.json({
      success: true,
      user: result.rows[0],
      emailResult,
      signupBypass,
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);

    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
