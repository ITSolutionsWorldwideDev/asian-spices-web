import { NextRequest, NextResponse } from "next/server";
import { getYoutubeVideoStats } from "@/lib/dbactions/recipeStats";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ duration: "", views: 0 }, { status: 400 });
  }

  const stats = await getYoutubeVideoStats(id);
  return NextResponse.json({
    duration: stats.duration || "",
    views: stats.views || 0,
  });
}
