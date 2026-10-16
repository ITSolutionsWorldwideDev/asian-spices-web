import type { MetadataRoute } from "next";

const COMMON_DISALLOW = [
  "/account/",
  "/api/",
  "/cart",
  "/checkout/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/wishlist",
  "/site-access",
  "/partner-registration/idin/",
  "/search",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/_next/", "/assets/"],
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "Googlebot-Image",
        disallow: [""],
      },
      {
        userAgent: "Storebot-Google",
        allow: ["/_next/", "/assets/"],
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "*",
        allow: ["/", "/_next/", "/assets/"],
        disallow: COMMON_DISALLOW,
      },
    ],
    sitemap: "https://www.asianspices.online/sitemap.xml",
  };
}
