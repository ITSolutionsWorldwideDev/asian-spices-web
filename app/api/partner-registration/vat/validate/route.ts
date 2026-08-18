import { NextRequest, NextResponse } from "next/server";
import { checkEuVatNumber } from "@/core/vies";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const vat_number = String(body?.vat_number || "");
    const country = String(body?.country || "");

    if (!vat_number) {
      return NextResponse.json(
        { error: "VAT number is required" },
        { status: 400 },
      );
    }

    const result = await checkEuVatNumber({ vat_number, country });

    if (!result.ok) {
      const status = result.code === "SERVICE_UNAVAILABLE" ? 503 : 400;
      return NextResponse.json(
        { valid: false, error: result.error, code: result.code },
        { status },
      );
    }

    return NextResponse.json({
      valid: true,
      skipped: result.skipped,
      formatted: result.formatted,
      countryCode: result.countryCode,
      vatNumber: result.vatNumber,
      name: result.skipped ? undefined : result.name,
      address: result.skipped ? undefined : result.address,
    });
  } catch (error) {
    console.error("VAT validate error:", error);
    return NextResponse.json(
      { error: "Failed to validate VAT number" },
      { status: 500 },
    );
  }
}
