// app/layout.tsx

import type { Metadata } from "next";
import { headers } from "next/headers";
import Providers from "./providers";
import GlobalLoader from "@/components/ui/GlobalLoader";
import GoogleTagManager, {
  GoogleTagManagerBody,
  GoogleTagManagerHead,
} from "@/components/GoogleTagManager";
import CountryChangeModal from "@/components/ui/CountryChangeModal";
import CartToast from "@/components/ui/CartToast";
import { getSiteBaseUrl } from "@/lib/sitemap-urls";
import { getLocalBusinessJsonLd } from "@/lib/schema";
import { getSiteReviewsSummary } from "@/lib/dbactions/products";
import JsonLd from "@/components/seo/JsonLd";
import "./globals.css";

function normalizeCanonicalPath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "/";

  return {
    metadataBase: new URL(getSiteBaseUrl()),
    alternates: {
      canonical: normalizeCanonicalPath(pathname),
    },
    title: "Asian Spices",
    description:
      "Asian Spices is your trusted online destination for premium Asian spices, authentic ingredients, recipes, and kitchen essentials.",
    keywords:
      "inventory management, admin dashboard, bootstrap template, invoicing, estimates, business management, responsive admin, POS system",
    icons: {
      // Absolute path is required — relative "favicon.ico" resolves to
      // /{category}/favicon.ico on nested routes and causes SEO 404s.
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    openGraph: {
      title: "Asian Spices",
      description:
        "Asian Spices is your trusted online destination for premium Asian spices, authentic ingredients, recipes, and kitchen essentials.",
      url: "https://www.asianspices.online",
      siteName: "Asian Spices",
      images: [
        {
          url: "https://www.asianspices.online/assets/as-thumbnail.png",
          width: 1200,
          height: 630,
          alt: "Asian Spices Platform",
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Overall store rating — shown on every page via LocalBusiness AggregateRating.
  // Product pages still emit a separate Product schema with that product's rating only.
  const siteReviews = await getSiteReviewsSummary();

  return (
    <html lang="en">
      <head>
        {/* GTM must be as high as possible in <head> for Search Console verification */}
        <GoogleTagManagerHead />
        {/* Site-wide LocalBusiness + overall AggregateRating (schema.org) */}
        <JsonLd data={getLocalBusinessJsonLd(siteReviews)} />
      </head>
      <body>
        {/* GTM noscript must be immediately after opening <body> */}
        <GoogleTagManagerBody />

        <GoogleTagManager />

        <Providers>
          <GlobalLoader />
          {children}
          <CountryChangeModal />
          <CartToast />
        </Providers>
      </body>
    </html>
  );
}
