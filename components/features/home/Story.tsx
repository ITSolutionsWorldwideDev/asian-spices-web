import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Story = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`container mx-auto overflow-x-hidden px-4 pt-2 pb-10 sm:px-6 sm:pt-4 sm:pb-12 lg:px-8 ${className}`}
    >
      <section className="grid items-start xl:items-center gap-10 xl:grid-cols-2 xl:gap-12">
        {/* Images: mobile pe second (order-2), desktop pe left (xl:order-1) */}
        <div className="order-2 space-y-6 xl:order-1">
          {/* Full 100% Organic banner — whole image, no empty bg */}
          <div className="relative w-full overflow-hidden rounded-2xl">
            <Image
              src="/assets/home/our_story/organic-banner.png"
              alt="Organic"
              width={510}
              height={306}
              sizes="(max-width: 1280px) 100vw, 50vw"
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="relative h-40 overflow-hidden rounded-xl sm:h-48">
              <Image
                src="/assets/home/our_story/80f41a02c14b60f52f9d87428cd6ef6dde6cead5-min.webp"
                alt="Farmer harvesting crops"
                fill
                sizes="(max-width: 1280px) 50vw, 25vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative h-40 overflow-hidden rounded-xl sm:h-48">
              <Image
                src="/assets/home/our_story/17870f44ff1cbbbecb2ba957fe078f85d76a5f57-min.webp"
                alt="Bowl of lentils, spices, and fresh vegetables"
                fill
                sizes="(max-width: 1280px) 50vw, 25vw"
                className="object-cover rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Content: mobile pe pehle (order-1), desktop pe right (xl:order-2) */}
        <div className="order-1 flex min-w-0 flex-col justify-center gap-6 sm:gap-8 xl:order-2 xl:self-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Authentic Asian Spices Online, Bringing the Taste of Asia to Your Kitchen
            </h2>
            <p className="text-gray-600">
             Asian Spices is an online destination for authentic Asian spices, herbs, pantry staples and kitchen essentials. We offer our own range of quality products, and we also give independent Asian shops and sellers a place to reach customers online. The result is a wider choice of ingredients in one convenient place.
            </p>
            <p className="text-gray-600">
              Our mission is simple: to respect the authenticity of Asian cuisine while making quality ingredients easy to find and accessible to everyone. We select our products for freshness, aroma and genuine taste, so each dish turns out the way it should.
            </p>
            <p className="text-gray-600">
            We’re also a place where cooking meets culture. Our recipes, healthy-living tips and cooking inspiration help you cook with confidence, whether you’re recreating a family favourite or trying something new. Discover your next favourite spice with us.
            </p>
          </div>

          {/* Stats and Learn More button section - commented out */}
          {/*
          <div className="grid grid-cols-2 gap-3 pt-2 sm:gap-6">
            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="shrink-0 rounded-lg bg-orange-50 p-2 sm:p-3 shadow-sm">
                <Image
                  src={`/assets/home/our_story/fluent_leaf-two-32-filled.png`}
                  alt="Partner farms"
                  height={40}
                  width={40}
                  className="h-7 w-7 object-contain sm:h-10 sm:w-10"
                />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 sm:text-2xl">500+</p>
                <p className="text-xs text-orange-500 sm:text-sm">Partner Farms</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="shrink-0 rounded-lg bg-orange-50 p-2 sm:p-3 shadow-sm">
                <Image
                  src={`/assets/home/our_story/ix_customer-filled.png`}
                  alt="Happy customers"
                  height={40}
                  width={40}
                  className="h-7 w-7 object-contain sm:h-10 sm:w-10"
                />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 sm:text-2xl">50+</p>
                <p className="text-xs text-orange-500 sm:text-sm">High Quality Brands</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="shrink-0 rounded-lg bg-orange-50 p-2 sm:p-3 shadow-sm">
                <Image
                  src={`/assets/home/our_story/Group.png`}
                  alt="Years experience"
                  height={40}
                  width={40}
                  className="h-7 w-7 object-contain sm:h-10 sm:w-10"
                />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 sm:text-2xl">150+</p>
                <p className="text-xs text-orange-500 sm:text-sm">Orders Dilevered</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="shrink-0 rounded-lg bg-orange-50 p-2 sm:p-3 shadow-sm">
                <Image
                  src={`/assets/home/our_story/Vector.png`}
                  alt="Spice varieties"
                  height={40}
                  width={40}
                  className="h-7 w-7 object-contain sm:h-10 sm:w-10"
                />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 sm:text-2xl">200+</p>
                <p className="text-xs text-orange-500 sm:text-sm">Spice Verities</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/about-us"
              className="group relative inline-flex max-w-full items-center overflow-hidden rounded-lg bg-linear-to-r from-orange-300 to-amber-600 px-5 py-3 font-bold text-white sm:px-6"
            >
              <span className="relative z-10 inline-flex items-center">
                Learn More
                <ArrowRight className="ml-3 h-4 w-4 shrink-0" />
              </span>
              <span className="absolute inset-0 origin-center scale-x-0 bg-linear-to-r from-orange-500 to-amber-200 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </Link>
          </div>
          */}
        </div>
      </section>
    </div>
  );
};

export default Story;
