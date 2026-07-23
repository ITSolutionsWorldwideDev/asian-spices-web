import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Story = () => {
  return (
    <div className="container mx-auto overflow-x-hidden px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid items-start gap-10 xl:grid-cols-2 xl:gap-12">
        <div className="space-y-6">
          <div className="relative h-[360px] overflow-hidden rounded-xl pl-6 sm:h-[420px] sm:pl-10 md:h-[450px]">
            <Image
              src="/assets/home/our_story/d10f2c08d6ed5db2264f1e5628f7f832a2959af1 (1)-min.webp"
              alt="A farmer proudly standing in a field"
              fill
              sizes="(max-width: 1280px) 100vw, 50vw"
              className="rounded-xl object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 z-[1] rounded-xl bg-green-600/90" />
            <div className="relative z-[2] flex h-full items-center justify-center rounded-xl p-6 sm:p-8">
              <h2 className="absolute top-6 left-0 z-[3] text-4xl font-bold text-white sm:top-7 sm:text-6xl lg:text-7xl xl:text-8xl">
                100%
                <br />
                Organic
              </h2>
              <div
                className="absolute right-0 bottom-0 z-[3] max-h-full"
                style={{ clipPath: "inset(0 0 0 0)" }}
              >
                <Image
                  src={`/assets/home/our_story/farmer.png`}
                  alt="our story"
                  height={450}
                  width={230}
                  className="h-[300px] w-auto object-contain object-bottom sm:h-[380px] md:h-[420px]"
                  loading="lazy"
                />
              </div>
            </div>
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

        <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Bringing Authentic Asian Flavors to Every Home
            </h2>
            <p className="text-gray-600">
              Founded in 2026, Asian Spices is a modern online marketplace
              dedicated to bringing the rich and diverse flavors of Asia
              directly to your doorstep. We make it easy for home cooks, food
              enthusiasts, and professional chefs to discover premium spices,
              authentic ingredients, kitchen essentials, and traditional
              recipes—all in one convenient destination.
            </p>
            <p className="text-gray-600">
              Our mission is to preserve the authenticity of Asian cuisine while
              making high-quality products accessible to everyone. Every product
              in our collection is carefully selected to ensure freshness,
              quality, and the genuine taste that makes every dish memorable.
            </p>
            <p className="text-gray-600">
              Beyond shopping, Asian Spices is a growing community where cooking
              meets culture. Through our recipe library, healthy living tips,
              and expert cooking inspiration, we help you create delicious meals
              with confidence. Whether you&apos;re preparing a cherished family
              recipe or experimenting with new flavors, Asian Spices is your
              trusted partner for authentic ingredients and an exceptional
              online shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2 sm:gap-6">
            <div className="flex items-center space-x-4">
              <div className="shrink-0 rounded-lg bg-orange-50 p-3 shadow-sm">
                <Image
                  src={`/assets/home/our_story/fluent_leaf-two-32-filled.png`}
                  alt="Partner farms"
                  height={40}
                  width={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-orange-500">Partner Farms</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="shrink-0 rounded-lg bg-orange-50 p-3 shadow-sm">
                <Image
                  src={`/assets/home/our_story/ix_customer-filled.png`}
                  alt="Happy customers"
                  height={40}
                  width={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900">50K+</p>
                <p className="text-sm text-orange-500">Happy Customer</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="shrink-0 rounded-lg bg-orange-50 p-3 shadow-sm">
                <Image
                  src={`/assets/home/our_story/Group.png`}
                  alt="Years experience"
                  height={40}
                  width={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900">15+</p>
                <p className="text-sm text-orange-500">Years Experience</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="shrink-0 rounded-lg bg-orange-50 p-3 shadow-sm">
                <Image
                  src={`/assets/home/our_story/Vector.png`}
                  alt="Spice varieties"
                  height={40}
                  width={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900">200+</p>
                <p className="text-sm text-orange-500">Spice Verities</p>
              </div>
            </div>
          </div>

          {/* Kept in-flow so it stays inside the section on all screen sizes */}
          <div className="pt-2">
            <Link
              href="/about"
              className="group relative inline-flex max-w-full items-center overflow-hidden rounded-lg bg-linear-to-r from-orange-300 to-amber-600 px-5 py-3 font-bold text-white sm:px-6"
            >
              <span className="relative z-10 inline-flex items-center">
                Learn More
                <ArrowRight className="ml-3 h-4 w-4 shrink-0" />
              </span>
              <span className="absolute inset-0 origin-center scale-x-0 bg-linear-to-r from-orange-500 to-amber-200 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Story;
