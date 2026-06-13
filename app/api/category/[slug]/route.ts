import { NextResponse } from "next/server";
// import { getCategoryWithSubcategories } from "@/libs/dbaction/categories";
import { getCategoryWithSubcategories } from "@/lib/dbactions/categories";

export async function GET(
  req: Request,
  { params }: { params:Promise< { slug: string }> },
) {
  const { slug } = await params;

  // console.log(slug);

  const result = await getCategoryWithSubcategories(slug);

  if (result.error) {
    return NextResponse.json({ error: result.error });
  }

  return NextResponse.json(result);
}
