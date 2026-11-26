import { NextRequest, NextResponse } from "next/server";
import { syncOdooCatalogToDatabase } from "@/core/odoo/syncCatalog";

export async function POST(req: NextRequest) {
  try {
    const result = await syncOdooCatalogToDatabase();
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("[Odoo Catalog Sync Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
