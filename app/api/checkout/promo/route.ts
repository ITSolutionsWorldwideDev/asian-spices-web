// app/api/checkout/promo/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/core/db";

export type PromoValidationResult =
  | {
      valid: true;
      code: string;
      discount_type: "PERCENT" | "FLAT";
      discount_value: number;
      discount_amount: number;
    }
  | { valid: false; error: string };

/**
 * Validates a promo code against store_promo_codes and computes the discount
 * off the given subtotal (both expressed in base EUR - the same currency
 * product base_price/discount amounts are stored in).
 */
export async function validatePromo(
  rawCode: string,
  subtotal: number,
): Promise<PromoValidationResult> {
  const code = rawCode.trim();

  if (!code) {
    return { valid: false, error: "Enter a promo code." };
  }

  const { rows } = await pool.query(
    `SELECT * FROM store_promo_codes WHERE UPPER(code) = UPPER($1) LIMIT 1`,
    [code],
  );

  const promo = rows[0];

  if (!promo || Number(promo.status) !== 1) {
    return { valid: false, error: "Invalid or inapplicable promo code." };
  }

  const now = new Date();

  if (promo.starts_at && new Date(promo.starts_at) > now) {
    return { valid: false, error: "This promo code isn't active yet." };
  }

  if (promo.expires_at && new Date(promo.expires_at) < now) {
    return { valid: false, error: "This promo code has expired." };
  }

  if (
    promo.usage_limit != null &&
    Number(promo.usage_count) >= Number(promo.usage_limit)
  ) {
    return {
      valid: false,
      error: "This promo code has reached its usage limit.",
    };
  }

  if (promo.min_order_amount && subtotal < Number(promo.min_order_amount)) {
    return {
      valid: false,
      error: `This code requires a minimum order of €${Number(promo.min_order_amount).toFixed(2)}.`,
    };
  }

  let discountAmount =
    promo.discount_type === "PERCENT"
      ? subtotal * (Number(promo.discount_value) / 100)
      : Number(promo.discount_value);

  if (promo.max_discount_amount != null) {
    discountAmount = Math.min(discountAmount, Number(promo.max_discount_amount));
  }

  // A code can never discount more than the order itself
  discountAmount = Math.max(0, Math.min(discountAmount, subtotal));

  return {
    valid: true,
    code: promo.code,
    discount_type: promo.discount_type,
    discount_value: Number(promo.discount_value),
    discount_amount: Math.round(discountAmount * 100) / 100,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const subtotal = Number(body.subtotal) || 0;

    const result = await validatePromo(String(body.code || ""), subtotal);

    return NextResponse.json(result, { status: result.valid ? 200 : 400 });
  } catch (error) {
    console.error("[Promo validation error]", error);
    return NextResponse.json(
      { valid: false, error: "Couldn't validate that code right now." },
      { status: 500 },
    );
  }
}
