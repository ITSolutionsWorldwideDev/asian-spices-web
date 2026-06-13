import React from "react";
import { ShoppingCart, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function SalesCalltoAction() {
  return (
    <div className=" bg-linear-to-br from-[#FFB75E] to-[#ED8F03] flex items-center justify-center py-14">
      <div className="text-center max-w-2xl">
        {/* Shopping Cart Icon */}
        <div className="flex justify-center mb-6">
          <ShoppingCart className="w-16 h-16 text-white" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Grow Your Sales?
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/90 mb-8 px-4">
          Start advertising today and reach millions of customers actively
          searching for your products.
        </p>

        {/* CTA Button */}
        <button className="bg-white text-[#F54900] hover:bg-orange-500 hover:text-white px-8 py-3 rounded-lg font-semibold  transition-colors duration-200 flex items-center gap-2 mx-auto mb-12">
          <Link href="/partner-registration" className="flex">
            Get Started Now
            <svg
              className="w-5 h-5 mt-1 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </button>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-8 text-white">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm md:text-base">No setup fees</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <span className="text-sm md:text-base">Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm md:text-base">24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
