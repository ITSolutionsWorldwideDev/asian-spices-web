import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";
import {
  getRecipeFavoriteCount,
  isRecipeFavorited,
  toggleRecipeFavorite,
} from "@/lib/dbactions/recipeStats";

export async function GET(req: NextRequest) {
  try {
    const recipeId = new URL(req.url).searchParams.get("recipeId");

    if (!recipeId) {
      return NextResponse.json(
        { error: "Missing recipeId" },
        { status: 400 },
      );
    }

    const session = await getServerSession(webAuthOptions);
    const [count, saved] = await Promise.all([
      getRecipeFavoriteCount(recipeId),
      session?.user?.id
        ? isRecipeFavorited(recipeId, session.user.id)
        : Promise.resolve(false),
    ]);

    return NextResponse.json({ success: true, count, saved });
  } catch (error: any) {
    console.error("GET RECIPE FAVORITE ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch favorites" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(webAuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const recipeId = body?.recipeId;

    if (!recipeId) {
      return NextResponse.json(
        { error: "Missing recipeId" },
        { status: 400 },
      );
    }

    const result = await toggleRecipeFavorite(recipeId, session.user.id);

    return NextResponse.json({
      success: true,
      saved: result.saved,
      count: result.count,
    });
  } catch (error: any) {
    console.error("TOGGLE RECIPE FAVORITE ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save favorite" },
      { status: 500 },
    );
  }
}
