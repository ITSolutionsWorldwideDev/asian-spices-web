// GET /api/currency-rate?code=EUR

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/core/db";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Currency code is required" },
      { status: 400 },
    );
  }
  try {
    // Rates must be read relative to the platform's base currency. The table
    // has historically held rows against more than one base, so pin the base
    // to the currency flagged is_base (EUR) rather than trusting there to be
    // only one row per target.
    const result = await pool.query(
      `
      SELECT cr.rate, tc.symbol
      FROM currency_rates cr
      JOIN currencies tc ON tc.id = cr.target_currency_id
      JOIN currencies bc ON bc.id = cr.base_currency_id
      WHERE tc.code = $1 AND bc.is_base = true
      LIMIT 1
      `,
      [code],
    );

    return NextResponse.json(result.rows[0] ?? { rate: 1 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch rate" },
      { status: 500 },
    );
  }
}
