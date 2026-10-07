// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { webAuthOptions } from "@/core/auth";

const handler = NextAuth(webAuthOptions);

export async function GET(req: any, ctx: any) {
  const params = await ctx?.params;
  return handler(req, { ...ctx, params });
}

export async function POST(req: any, ctx: any) {
  const params = await ctx?.params;
  return handler(req, { ...ctx, params });
}
