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
    src: "/assets/home/homeheaderimages/banner-2.jpg",
    alt: "Asian Spices product collection",
    overlay: {
      line1: "Asian Grocery Shop",
      line2Lead: "Delivered ",
      line2: "Across the Netherlands",
      description:
        "Shop authentic Asian spices, groceries, and food products online with nationwide delivery straight to your door.",
      ctaLabel: "Explore our Products",
      ctaHref: "/products",
      theme: "dark",
    },
  },
  {
    id: 2,
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
  {
    id: 3,
    src: "/assets/home/homeheaderimages/banner-1.jpg",
    alt: "Asian Spices grocery products in a wheat field",
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
  const HeadingTag = current.id === 1 ? "h1" : "h2";

  return (
    /* Flash Sale section ke sath exact side padding match kar di hai */
    <section className="w-full bg-white px-3 pt-1 pb-2 sm:px-6 md:px-10">
      <Nav />

      <div className="relative isolate mx-auto w-full max-w-[90rem] overflow-hidden rounded-[1.25rem] bg-[#f6d7cf] shadow-lg sm:rounded-[1.75rem] md:rounded-[2rem] lg:rounded-[2.5rem]">
        {/* Mobile par height kam (h-[260px]) aur desktop par original rakhi hai */}
        <div className="relative h-[260px] w-full sm:h-[320px] md:h-[400px] lg:h-[480px]">
          {banners.map((banner, i) => (
            <Image
              key={banner.id}
              src={banner.src}
              alt={banner.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`absolute inset-0 z-0 h-full w-full scale-[1.25] sm:scale-[1.08] object-cover object-center transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Mobile-only gradient overlay for dark banners */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 z-[1] transition-all duration-700 ${
              isLight
                ? "hidden"
                : "bg-gradient-to-r from-black/80 via-black/50 to-transparent md:hidden"
            }`}
          />

          {overlay && (
            <div
              key={current.id}
              className="relative z-10 flex h-full items-center px-4 py-4 sm:px-10 md:px-14 lg:px-16"
            >
              <div className="w-full max-w-[min(100%,25rem)] animate-fade-in sm:max-w-md md:max-w-lg lg:max-w-xl">
                <HeadingTag className="text-[1.15rem] font-bold leading-[1.15] tracking-tight sm:text-3xl md:text-4xl lg:text-[3.35rem]">
                  <span
                    className={`block text-[#EE9933] ${
                      isLight
                        ? ""
                        : "drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] sm:drop-shadow-none"
                    }`}
                  >
                    {overlay.line1}
                  </span>
                  <span className="mt-0.5 block sm:mt-1.5">
                    {overlay.line2Lead && (
                      <span
                        className={`text-[#EE9933] ${
                          isLight
                            ? ""
                            : "drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] sm:drop-shadow-none"
                        }`}
                      >
                        {overlay.line2Lead}
                      </span>
                    )}
                    <span
                      className={
                        isLight
                          ? "text-zinc-900"
                          : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] sm:drop-shadow-none"
                      }
                    >
                      {overlay.line2}
                    </span>
                  </span>
                </HeadingTag>

                <p
                  className={`mt-1.5 max-w-sm text-[11px] font-medium leading-relaxed sm:mt-3 sm:text-base sm:font-normal md:mt-6 md:text-lg ${
                    isLight
                      ? "text-zinc-800"
                      : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-white/95 sm:drop-shadow-none"
                  }`}
                >
                  {overlay.description}
                </p>

                <Link
                  href={overlay.ctaHref}
                  className={`mt-2.5 inline-flex rounded-full px-4 py-2 text-[11px] font-bold transition sm:mt-5 sm:px-8 sm:py-3.5 sm:text-base sm:font-semibold ${
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

          {/* Slide dots cleanly positioned */}
          <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-4">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Go to banner ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all sm:h-2 ${
                  i === index
                    ? "w-5 bg-[#EE9933] sm:w-6"
                    : "w-1.5 bg-white/50 hover:bg-white/85 sm:w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}