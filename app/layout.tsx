// apps/web/app/layout.tsx

import type { Metadata } from "next";
import Providers from "./providers";
import GlobalLoader from "@/components/ui/GlobalLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asian Spices - the asian tiger ",
  description:
    "Asian Spices is a powerful Bootstrap-based Inventory Management Admin Template designed for businesses, offering seamless invoicing, project tracking, and estimates.",
  keywords:
    "inventory management, admin dashboard, bootstrap template, invoicing, estimates, business management, responsive admin, POS system",
  // author: "IT Solutions Worldwide",
  icons: {
    icon: "favicon.ico",
    shortcut: "favicon.ico", // Add shortcut icon for better support
    apple: "favicon.ico", // Optional: for Apple devices (place in `public/`)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable}`}
        className=""
      >
        <Providers>
          <GlobalLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
