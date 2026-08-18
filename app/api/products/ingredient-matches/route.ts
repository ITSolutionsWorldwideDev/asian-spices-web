import { NextResponse } from "next/server";
import { getProductsMatchingIngredientNames } from "@/lib/dbactions/ingredientProducts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const names = Array.isArray(body?.names)
      ? body.names.map((name: unknown) => String(name ?? ""))
      : [];
    const country = String(body?.country || "NL").toUpperCase();

    const products = await getProductsMatchingIngredientNames(names, country);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("[Ingredient matches] Failed to match products:", error);
    return NextResponse.json(
      { error: "Unable to match ingredients" },
      { status: 500 },
    );
  }
}
