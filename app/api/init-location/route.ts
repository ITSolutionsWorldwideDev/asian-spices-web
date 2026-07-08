// app/api/init-location/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { webAuthOptions } from "@/core/auth/web/auth-options";
import { pool } from "@/core/db";

export async function GET(req: NextRequest) {
  const defaultFallback = "NL";

  try {
    // 1. Check if user is logged in
    const session = await getServerSession(webAuthOptions);

    if (session?.user?.id) {
      // 🟢 UPDATED: Using your actual table structures and sorting logic
      const userRes = await pool.query<{ country: string }>(
        `
        SELECT a.country
        FROM store_customer_addresses a
        JOIN store_customers c ON c.id = a.customer_id
        WHERE c.user_id = $1
        ORDER BY a.is_default DESC, a.created_at DESC
        LIMIT 1
        `,
        [session.user.id],
      );

      // If the customer has an address entry, return their country_code
      if (userRes.rows.length > 0 && userRes.rows[0].country) {
        return NextResponse.json({
          country: userRes.rows[0].country.toUpperCase(),
          source: "session",
        });
      }
    }

    // 2. Fallback to Geo-IP routing headers (Production Edge Routers)
    let geoCountry =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      req.headers.get("X-Country-Code");

    // 🟢 LOCALHOST DEV BOOST: If testing locally on your workspace, mock a test region
    const isLocalhost =
      req.headers.get("host")?.includes("localhost") ||
      req.headers.get("host")?.includes("127.0.0.1");

      console.log('geoCountry ==== ',geoCountry);
      console.log('isLocalhost ==== ',isLocalhost);

    if (!geoCountry && isLocalhost) {
      geoCountry = "DE"; // Set this to any shippable test country you want to test locally
      return NextResponse.json({
        country: geoCountry.toUpperCase(),
        source: "localhost-mock",
      });
    }

    if (geoCountry && geoCountry.length === 2) {
      return NextResponse.json({
        country: geoCountry.toUpperCase(),
        source: isLocalhost ? "localhost-mock" : "edge-header",
      });
    }

    // 3. SERVER-SIDE THIRD PARTY FALLBACK: If headers are completely missing in production
    try {
      const ipApiResponse = await fetch("http://ip-api.com/json/", {
        signal: AbortSignal.timeout(1500)
      });
      if (ipApiResponse.ok) {
        const ipData = await ipApiResponse.json();
        if (ipData?.countryCode && ipData.countryCode.length === 2) {
          return NextResponse.json({
            country: ipData.countryCode.toUpperCase(),
            source: "server-ip-api"
          });
        }
      }
    } catch (ipErr) {
      console.warn("Server-side third-party IP fallback failed:", ipErr);
    }

    // 4. Fallback flag signaling frontend client to look up country via third-party service
    return NextResponse.json({ country: defaultFallback, source: "fallback" });
  } catch (error) {
    console.error("Location resolution engine exception:", error);
    return NextResponse.json({
      country: defaultFallback,
      source: "error-fallback",
    });
  }
}
