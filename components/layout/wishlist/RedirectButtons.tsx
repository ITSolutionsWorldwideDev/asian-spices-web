// apps/web/components/layout/wishlist/RedirectButtons.tsx

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const RedirectButtons = () => {
  return (
    <div className="w-full  flex justify-center p-6">
      <div className="container mx-auto bg-linear-to-r from-[#FFF7ED] to-[#FEF2F2] border border-[#FFD6A7] rounded-2xl p-10 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="text-[#F54900] text-4xl">
            <Sparkles className="size-[35]" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-lg font-medium text-gray-800 mb-2">
          Ready to cook with these amazing spices?
        </h2>

        {/* Subtext */}
        <p className="text-gray-600 mb-6">
          Add your favorite items to cart and enjoy free shipping on orders over
          €50!
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link href={"/"}>
            <button className="px-5 py-2 border border-[#E5E7EB] bg-white rounded-md hover:bg-gray-300 transition">
              Add More Items
            </button>
          </Link>

          <Link href={"/"}>
            <button className="px-5 py-2 bg-[#FF6900] text-white rounded-md hover:bg-orange-600 transition flex  items-center justify-center">
              View Cart <ArrowRight className="ml-3" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RedirectButtons;
