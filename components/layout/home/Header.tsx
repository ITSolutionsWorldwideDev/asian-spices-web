//  components/layout/home/Header.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/ui/Nav";

type BannerOverlay = {
  line1: string;
  line2: string;
  /** Optional accent word(s) before line2 (e.g. "Delivered ") */
  line2Lead?: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  theme: "dark" | "light";
};

const banners: {
  id: number;
  src: string;
  alt: string;
  overlay?: BannerOverlay;
}[] = [
  {
    id: 1,
    src: "/assets/home/homeheaderimages/banner-1.jpg",
    alt: "Asian Spices mobile app",
    overlay: {
      line1: "Asian Supermarket",
      line2: "Authentic Food from Across Asia",
      description:
        "Discover Asian spices, sauces, noodles, snacks, and everyday food essentials, bringing the authentic taste of Asia to your kitchen.",
      ctaLabel: "Explore Asian Market",
      ctaHref: "/products",
      theme: "light",
    },
  },
  {
    id: 2,
    src: "/assets/home/homeheaderimages/banner-2.jpg",
    alt: "Asian Spices product collection",
    overlay: {
      line1: "Asian Grocery Shop",
      line2Lead: "Delivered ",
      line2: "Across the Netherlands",
      description:
        "Shop authentic Asian spices, groceries, and food online with nationwide delivery straight to your door.",
      ctaLabel: "Explore our Products",
      ctaHref: "/products",
      theme: "dark",
    },
  },
  {
    id: 3,
    src: "/assets/home/homeheaderimages/banner-3.jpg",
    alt: "Asian Spices grocery bag",
    overlay: {
      line1: "Indian Grocery Store & Tropical Market",
      line2: "Favorites, Online",
      description:
        "Authentic Indian spices, ghee, and tropical essentials, sourced for the true taste of home, delivered nationwide.",
      ctaLabel: "Explore Online Grocery",
      ctaHref: "/products",
      theme: "dark",
    },
  },
];

export default function Header() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const current = banners[index];
  const overlay = current.overlay;
  const isLight = overlay?.theme === "light";

  return (
    <section className="w-full bg-white px-3 pb-4 pt-1 sm:px-5 sm:pb-5 md:px-6 lg:px-8">
      <Nav />

      <div className="relative mx-auto w-full max-w-[90rem] overflow-hidden rounded-[1.25rem] bg-[#f6d7cf] shadow-lg sm:rounded-[1.75rem] md:rounded-[2rem] lg:rounded-[2.5rem]">
        <div className="relative min-h-[240px] w-full sm:min-h-[320px] md:min-h-[400px] lg:min-h-[480px]">
          {banners.map((banner, i) => (
            <Image
              key={banner.id}
              src={banner.src}
              alt={banner.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`pointer-events-none absolute inset-0 z-0 object-cover scale-[1.14] transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {overlay && (
            <div
              key={current.id}
              className="relative z-10 flex h-full min-h-[inherit] items-center px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14 lg:px-16 lg:py-16"
            >
              <div className="w-full max-w-[min(100%,28rem)] animate-fade-in sm:max-w-md md:max-w-lg lg:max-w-xl">
                <h1 className="text-[1.75rem] font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.35rem]">
                  <span className="block text-[#EE9933]">{overlay.line1}</span>
                  <span className="mt-1 block sm:mt-1.5">
                    {overlay.line2Lead && (
                      <span className="text-[#EE9933]">{overlay.line2Lead}</span>
                    )}
                    <span className={isLight ? "text-zinc-900" : "text-white"}>
                      {overlay.line2}
                    </span>
                  </span>
                </h1>
                <p
                  className={`mt-4 max-w-md text-sm leading-relaxed sm:mt-5 sm:text-base md:mt-6 md:text-lg ${
                    isLight ? "text-zinc-800" : "text-white/95"
                  }`}
                >
                  {overlay.description}
                </p>
                <Link
                  href={overlay.ctaHref}
                  className={`mt-6 inline-flex rounded-full px-7 py-3 text-sm font-semibold transition sm:mt-8 sm:px-8 sm:py-3.5 sm:text-base ${
                    isLight
                      ? "bg-[#D34827] text-white hover:bg-[#c03f20]"
                      : "bg-[#EE9933] text-[#1a1208] hover:bg-[#e08a28]"
                  }`}
                >
                  {overlay.ctaLabel}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-5">
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              aria-label={`Go to banner ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-[#EE9933]"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
