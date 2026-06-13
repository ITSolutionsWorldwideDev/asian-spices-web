// apps/web/components/layout/productdescpage/ProductNotFound.tsx

"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";

export default function ProductNotFound() {
  return (
    <div className="bg-gray-50">
      <div className="bg-black">
        <Nav />
      </div>

      <div className="bg-gray-50 min-h-200 flex flex-col">
        {/* TOP SPACE (same feel as product page) */}
        <div className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-6">
            <SearchX className="w-10 h-10 text-orange-500" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Product Not Found
          </h1>

          {/* Description */}
          <p className="text-gray-500 max-w-md mb-8">
            The product you’re looking for doesn’t exist or may have been
            removed. Try browsing other products or go back to the category.
          </p>

          {/* Actions */}
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/spices"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Browse Spices
            </Link>

            <Link
              href="/"
              className="border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-xl font-medium transition"
            >
              Go Home
            </Link>
          </div>
        </div>

        {/* Optional: spacing consistency */}
        <div className="mt-auto" />
      </div>
      <Footer />
    </div>
  );
}
