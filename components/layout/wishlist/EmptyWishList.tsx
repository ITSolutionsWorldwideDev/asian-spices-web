// apps/web/components/layout/wishlist/EmptyWishList.tsx

"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function EmptyWishList() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 px-6 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center">
            <Heart
              size={42}
              className="text-orange-500"
            />
          </div>

          <h2 className="mt-6 text-4xl font-bold text-gray-900">
            Your Wishlist is Empty
          </h2>

          <p className="mt-4 text-gray-500 text-center max-w-md">
            Start saving your favorite products and build your
            perfect collection.
          </p>

          <Link href="/" className="mt-8">
            <button className="bg-orange-500 hover:bg-orange-600 transition text-white px-8 py-4 rounded-2xl font-semibold cursor-pointer">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
