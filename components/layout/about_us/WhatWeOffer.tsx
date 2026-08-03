import Image from "next/image";
import {
  Bean,
  Leaf,
  Package,
  Search,
  Flame,
  Soup,
} from "lucide-react";

const categories = [
  {
    title: "Whole & Ground Spices",
    description:
      "Premium whole and ground spices for authentic Asian cooking at peak freshness.",
    icon: Flame,
    iconClass: "text-red-500",
  },
  {
    title: "Spice Blends & Masalas",
    description:
      "Traditional spice blends and masalas crafted for genuine flavor — no fillers.",
    icon: Package,
    iconClass: "text-amber-700",
  },
  {
    title: "Dried Herbs",
    description:
      "Carefully selected dried herbs that lock in colour, aroma, and potency.",
    icon: Leaf,
    iconClass: "text-emerald-600",
  },
  {
    title: "Rice Varieties",
    description:
      "Rice varieties sourced with care for everyday meals and special dishes.",
    icon: Soup,
    iconClass: "text-zinc-600",
  },
  {
    title: "Lentils & Pulses",
    description:
      "Lentils and pulses cleaned and packed for quality you can trust.",
    icon: Bean,
    iconClass: "text-amber-800",
  },
  {
    title: "Kitchen Essentials",
    description:
      "Everyday kitchen essentials for Asian cooking — all curated in one place.",
    icon: Search,
    iconClass: "text-zinc-700",
  },
];

export default function WhatWeOffer() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto grid items-stretch gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:gap-12 xl:gap-16">
        {/* Left column — label, heading, copy, image */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#C59D5F]" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C59D5F] sm:text-xs">
              What We Offer
            </p>
            <span className="h-px w-6 bg-[#C59D5F]" aria-hidden />
          </div>

          <h2 className="mt-4 max-w-md font-serif text-[1.85rem] font-bold leading-[1.15] text-[#1A1A1A] sm:text-4xl lg:text-[2.45rem] lg:leading-[1.12]">
            One Place for Every Asian Kitchen Essential
          </h2>

          <p className="mt-5 max-w-md text-[15px] leading-[1.7] text-[#5A5A5A] sm:text-base">
            Asian Spices is a one-stop destination for authentic Asian cooking
            essentials — all curated in one place, so you don&apos;t have to
            piece together your pantry from five different stores.
          </p>

          <div className="relative mt-8 aspect-[16/11] w-full overflow-hidden rounded-[1.15rem] sm:mt-auto sm:pt-8">
            <Image
              src="/assets/about/our_story/what-we-offer-spices.png"
              alt="Assorted whole and ground Asian spices on a dark surface"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Right column — 2×3 card grid */}
        <div className="grid content-stretch gap-3.5 sm:grid-cols-2 sm:gap-4 lg:gap-3.5 xl:gap-4">
          {categories.map(({ title, description, icon: Icon, iconClass }) => (
            <article
              key={title}
              className="flex h-full items-start gap-3.5 rounded-[1.15rem] border border-[#EEEBE4] bg-[#F9F7F2] p-4 sm:p-[1.15rem]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0EBE3]">
                <Icon className={`h-5 w-5 ${iconClass}`} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 pt-0.5">
                <h3 className="text-[14px] font-bold leading-snug text-[#1A1A1A] sm:text-[15px]">
                  {title}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#6B6B6B] sm:text-[13px]">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
