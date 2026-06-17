// app/api/tax-rules/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/core/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get("country_code")?.toUpperCase() || "NL";

    // Query your dynamic rules table matching by country location code and active flag
    const result = await pool.query(
      `SELECT tax_rate, tax_name 
       FROM platform_tax_rules 
       WHERE country_code = $1 AND is_active = true 
       LIMIT 1`,
      [countryCode],
    );

    if (result.rows.length > 0) {
      // Divide by 100 if stored as integer percentage scale (e.g., 21 -> 0.21)
      const taxRate = parseFloat(result.rows[0].tax_rate) / 100;
      return NextResponse.json({ taxRate, taxName: result.rows[0].tax_name });
    }

    // Fallback default value (Netherlands rule structure)
    return NextResponse.json({ taxRate: 0.21, taxName: "VAT" });
  } catch (err) {
    console.error("Tax Fetch Exception Route Handlers:", err);
    return NextResponse.json(
      { taxRate: 0.21, taxName: "VAT" },
      { status: 500 },
    );
  }
}
