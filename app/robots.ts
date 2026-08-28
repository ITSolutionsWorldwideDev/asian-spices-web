import type { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@/lib/sitemap-urls";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
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
        "/coming-soon",
        "/partner-registration/idin/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
