// app/api/tax-rules/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/core/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const countryCode = searchParams.get("country_code")?.toUpperCase() || "NL";

    // 🌟 Retrieve all active platform rules for the country
    const result = await pool.query(
      `SELECT id, tax_rate, tax_name, category_id 
       FROM platform_tax_rules 
       WHERE country_code = $1 AND is_active = true`,
      [countryCode],
    );

    return NextResponse.json({ rules: result.rows });
  } catch (err) {
    console.error("Tax Fetch Exception Route Handlers:", err);
    return NextResponse.json({ rules: [] }, { status: 500 });
  }
}

