import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function AdvertisingSolution() {
  return (
    <div className="bg-linear-to-br from-orange-300 via-orange-400 to-orange-500">
      <div className="container mx-auto px-6 py-12 lg:py-16">
        {/* Advertising Solutions Badge */}
        <div className="mb-8">
          <span className="inline-block bg-orange-200 bg-opacity-60 text-gray-800 px-5 py-2 rounded-full text-sm font-medium border border-orange-300">
            Advertising Solutions
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Welcome to the
              <br />
              Partner Platform
            </h1>

            <p className="text-base md:text-lg text-gray-800 leading-relaxed max-w-xl">
              Want to grow your sales? Asian Spices partners with carefully
              selected retailers to bring authentic products to a wider
              audience. Gain access to powerful tools, expert guidance, and a
              platform designed to support sustainable growth.
            </p>

            <div>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl">
                <Link href="/partner-registration">Register to Sell</Link>
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-white">
              {/* Replace the src below with your actual image path */}
              <Image
                src="/assets/sellerhub/1580b63097b65bfd6caac53142973b2dfb6e421b.jpg"
                alt="Partners with spices in jars"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                sizes="100vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
