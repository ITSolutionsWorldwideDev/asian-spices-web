// app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/dbactions/products";

const cleanArray = (arr: string[] = []) =>
  arr.filter((v) => v && v !== "" && v !== "null" && v !== "undefined");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const subcategories = cleanArray(
    searchParams.get("subcategories")?.split(",") || [],
  );

  const brands = cleanArray(searchParams.get("brands")?.split(",") || []);

  const rawCategory = searchParams.get("category");
  const category =
    rawCategory === "all" || rawCategory === ""
      ? ""
      : rawCategory || "spices";

  const filters = {
    category,
    subcategories,
    brands,
    minPrice: searchParams.get("min") || searchParams.get("minPrice"),
    maxPrice: searchParams.get("max") || searchParams.get("maxPrice"),
    search: searchParams.get("search"),
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page") || "1"),
    saleOnly: searchParams.get("sale_only") === "true",
    limit: Number(searchParams.get("limit") || "20"),
    countryCode: searchParams.get("country") || "NL",
    showUnavailable: true,
  };

  try {
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
