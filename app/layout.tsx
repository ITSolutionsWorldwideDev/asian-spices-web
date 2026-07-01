// app/layout.tsx

import type { Metadata } from "next";
import Providers from "./providers";
import GlobalLoader from "@/components/ui/GlobalLoader";
import "./globals.css";

/* export const metadata: Metadata = {
  title: "Asian Spices - the asian tiger ",
  description:
    "Asian Spices is a powerful Bootstrap-based Inventory Management Admin Template designed for businesses, offering seamless invoicing, project tracking, and estimates.",
  keywords:
    "inventory management, admin dashboard, bootstrap template, invoicing, estimates, business management, responsive admin, POS system",
  icons: {
    icon: "favicon.ico",
    shortcut: "favicon.ico",
    apple: "favicon.ico",
  },
}; */

export const metadata: Metadata = {
  title: "Asian Spices - the asian tiger",
  description:
    "Asian Spices is a powerful Bootstrap-based Inventory Management Admin Template designed for businesses, offering seamless invoicing, project tracking, and estimates.",
  keywords:
    "inventory management, admin dashboard, bootstrap template, invoicing, estimates, business management, responsive admin, POS system",
  icons: {
    icon: "favicon.ico",
    shortcut: "favicon.ico",
    apple: "favicon.ico",
  },

  // 🌟 Add the Open Graph tags configuration below
  openGraph: {
    title: "Asian Spices - the asian tiger",
    description:
      "Multi-tenant SaaS E-commerce platform and business management architecture.",
    url: "https://yourdomain.com", // Replace with your production domain
    siteName: "Asian Spices",
    images: [
      {
        url: "https://yourdomain.com/assets/og-image.jpg", // Absolute URL required
        width: 1200,
        height: 630,
        alt: "Asian Spices Platform Dashboard Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 🌟 Optional: Add Twitter Card configuration for social shares
  twitter: {
    card: "summary_large_image",
    title: "Asian Spices - the asian tiger",
    description:
      "Multi-tenant SaaS E-commerce platform and business management architecture.",
    images: ["https://yourdomain.com/assets/og-image.jpg"], // Absolute URL required
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <Providers>
          <GlobalLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
