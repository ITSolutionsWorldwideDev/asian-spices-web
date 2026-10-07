import { NextRequest, NextResponse } from "next/server";
import {
  isPrivilegedEmail,
  PRIVILEGED_EMAIL_ERROR,
} from "@/core/partner-registration/check-privileged-email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim();

    if (!email) {
      return NextResponse.json(
        { allowed: false, error: "Business email is required" },
        { status: 400 },
      );
    }

    // Basic format gate before hitting the database
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { allowed: false, error: "Invalid email" },
        { status: 400 },
      );
    }

    const blocked = await isPrivilegedEmail(email);

    if (blocked) {
      return NextResponse.json(
        {
          allowed: false,
          error: PRIVILEGED_EMAIL_ERROR,
          code: "PRIVILEGED_EMAIL",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ allowed: true });
  } catch (error) {
    console.error("Email validate error:", error);
    return NextResponse.json(
      { error: "Failed to validate email" },
      { status: 500 },
    );
  }
}
