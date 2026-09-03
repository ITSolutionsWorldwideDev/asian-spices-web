// proxy.ts (Next.js 16; formerly middleware)

import { NextRequest, NextResponse } from "next/server";
import { isGoogleSiteVerifier, placeGtmSnippets } from "./lib/gtm";

const COOKIE_NAME = "site-access";
const GTM_REWRITE_HEADER = "x-gtm-placement-rewrite";
const PATHNAME_HEADER = "x-pathname";

function nextWithPathname(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(PATHNAME_HEADER, req.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* // Skip site lock for Vercel preview/domain
  if (hostname === "asian-spices-web.vercel.app") {
    return NextResponse.next();
  } */

  const hostname = req.nextUrl.hostname;
  const userAgent = req.headers.get("user-agent");

  // Always let Google's ownership crawler through (even if site lock is on).
  const googleVerifier = isGoogleSiteVerifier(userAgent);

  const shouldApplySiteLock =
    !googleVerifier &&
    (hostname === "www.asianspices.online" || hostname === "asianspices.online");

  if (shouldApplySiteLock) {
    // Disable protection completely if needed
    const siteLockEnabled = process.env.SITE_LOCK_ENABLED === "true";

    if (siteLockEnabled) {
      // Allow static assets
      if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.match(/\.(.*)$/)
      ) {
        return NextResponse.next();
      }

      // Allow specific public routes
      const publicRoutes = ["/coming-soon", "/site-access", "/api/site-access"];

      const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (!isPublicRoute) {
        // Allow important APIs/webhooks
        if (
          !(
            pathname.startsWith("/api/paypal") ||
            pathname.startsWith("/api/paynl") ||
            pathname.startsWith("/api/webhook") ||
            pathname.startsWith("/api/auth")
          )
        ) {
          // Check access cookie
          const cookie = req.cookies.get(COOKIE_NAME);

          if (cookie?.value !== process.env.SITE_ACCESS_PASSWORD) {
            // Redirect visitors to Coming Soon page
            return NextResponse.redirect(new URL("/coming-soon", req.url));
          }
        }
      }
    }
  }

  // Search Console requires GTM immediately after <head> / <body>.
  // Next.js inserts its own tags and a hidden body div first — rewrite for the verifier
  // (and ?gtm_placement=1 so you can View Source and confirm before re-verifying).
  const forceGtmPlacement =
    googleVerifier || req.nextUrl.searchParams.get("gtm_placement") === "1";

  const accept = req.headers.get("accept") || "";
  const looksLikeDocument =
    accept.includes("text/html") || accept.includes("*/*") || accept === "";

  if (
    forceGtmPlacement &&
    !req.headers.get(GTM_REWRITE_HEADER) &&
    looksLikeDocument
  ) {
    const headers = new Headers(req.headers);
    headers.set(GTM_REWRITE_HEADER, "1");
    headers.set(PATHNAME_HEADER, pathname);

    const originResponse = await fetch(req.url, {
      headers,
      redirect: "manual",
    });

    const contentType = originResponse.headers.get("content-type") || "";
    if (originResponse.ok && contentType.includes("text/html")) {
      const html = placeGtmSnippets(await originResponse.text());
      const responseHeaders = new Headers(originResponse.headers);
      responseHeaders.delete("content-encoding");
      responseHeaders.delete("content-length");

      return new NextResponse(html, {
        status: originResponse.status,
        headers: responseHeaders,
      });
    }
  }

  return nextWithPathname(req);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
