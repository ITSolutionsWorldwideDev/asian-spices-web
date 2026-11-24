import { NextRequest, NextResponse } from "next/server";
import { syncPaidOrderToOdoo } from "@/core/odoo/syncOrder";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "orderId required" },
        { status: 400 }
      );
    }
    const result = await syncPaidOrderToOdoo(orderId);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("[Manual Odoo Sync Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
