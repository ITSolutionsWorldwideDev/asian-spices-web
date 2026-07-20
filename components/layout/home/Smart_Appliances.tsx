// components/layout/home/Smart_Appliances.tsx

import Link from "next/link";
import React from "react";
import LazyVideo from "@/components/ui/LazyVideo";

const Smart_Appliances: React.FC = () => {
  return (
    <div className="relative min-h-[800px] overflow-hidden container mx-auto border-[8px] border-amber-500 rounded-2xl bg-black">
      <LazyVideo
        mode="lazy"
        src="/assets/home/smart_appliances/Comp 1_6.mp4"
        className="absolute inset-0 h-full w-full object-cover z-0"
        rootMargin="150px"
      />

      <div className="relative z-10 flex min-h-[800px] items-center justify-center text-white p-4 bg-black/20">
        <div className="max-w-xl text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Smart Appliances.
            <br />
            <span className="text-orange-400">Smarter </span>
            <span className="text-white"> Living.</span>
          </h2>
          <p className="mt-4 text-lg text-gray-100">
            Smart, stylish, durable appliances designed to simplify cooking,
            save time, inspire creativity, and bring families together every
            day.
          </p>
          <div className="flex justify-center mt-8">
            <Link href={`/kitchen-appliances`}>
              <button
                type="button"
                className="px-8 py-3 bg-white cursor-pointer text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-black hover:text-white transition duration-300"
              >
                Shop Appliances
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Smart_Appliances;
