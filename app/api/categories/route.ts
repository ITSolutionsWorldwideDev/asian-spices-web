import { NextResponse } from "next/server";
import { getShopCategories } from "@/lib/dbactions/categories";

export async function GET() {
  try {
    return NextResponse.json({ categories: await getShopCategories() });
  } catch (error) {
    console.error("Failed to load categories:", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
