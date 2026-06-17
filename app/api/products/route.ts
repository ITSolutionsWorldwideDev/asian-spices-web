// app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/dbactions/products";

// 🔥 Clean helper (ARRAY SAFE)
const cleanArray = (arr: string[] = []) =>
  arr.filter((v) => v && v !== "" && v !== "null" && v !== "undefined");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // 🔥 Parse arrays CORRECTLY
  const subcategories = cleanArray(
    searchParams.get("subcategories")?.split(",") || [],
  );

  const brands = cleanArray(searchParams.get("brands")?.split(",") || []);

  // 🔥 Build filters
  const filters = {
    category: searchParams.get("category") || "spices",
    subcategories,
    brands,
    minPrice: searchParams.get("min"),
    maxPrice: searchParams.get("max"),
    search: searchParams.get("search"),
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page") || "1"),
  };

  try {

    // console.log('filters ====',filters);
    const products = await getProducts(filters);

    return NextResponse.json({
      data: products,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { data: [], error: "Something went wrong" },
      { status: 500 },
    );
  }
}
