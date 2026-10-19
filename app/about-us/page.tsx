import React from "react";
import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Asian Spices | Authentic Asian Groceries, Delivered in NL",
  description:
    "Learn how Asian Spices brings authentic Indian & Asian ingredients to homes across the Netherlands - quality spices, groceries, and trusted brands.",
  alternates: {
    canonical: "/about-us",
  },
};
import Story from "@/components/layout/about_us/Story";
import OurMission from "@/components/layout/about_us/OurMission";
import WhatWeBring from "@/components/layout/about_us/WhatWeBring";
import SupportFarmers from "@/components/layout/about_us/SupportFarmers";
import QualityTrust from "@/components/layout/about_us/QualityTrust";
import WhatWeOffer from "@/components/layout/about_us/WhatWeOffer";
import ForEveryone from "@/components/layout/about_us/ForEveryone";
import WhyChoose from "@/components/layout/about_us/WhyChoose";
import StoryBanner from "@/components/layout/about_us/StoryBanner";
import ReadyToCook from "@/components/layout/about_us/ReadyToCook";
import { Ban, Globe, Package, Sprout } from "lucide-react";

const promiseItems = [
  {
    label: "Organic",
    icon: Sprout,
    iconClass: "text-emerald-400",
  },
  {
    label: "Zero Artificial Additives",
    icon: Ban,
    iconClass: "text-red-400",
  },
  {
    label: "Responsibly Sourced",
    icon: Globe,
    iconClass: "text-sky-400",
  },
  {
    label: "Freshness Guaranteed",
    icon: Package,
    iconClass: "text-amber-300",
  },
];

const AboutUs = () => {
  return (
    <div className="bg-white text-zinc-900">
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/about/banner_about.webp')",
          }}
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <Nav />
        <div className="relative z-10 container mx-auto px-4 pb-8 pt-2 sm:pb-10 sm:pt-3 lg:pb-12">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_minmax(250px,280px)] lg:gap-10">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-amber-200/35 bg-amber-200/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
                About Asian Spices · Netherlands
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:mt-5 sm:text-4xl lg:text-5xl xl:text-6xl">
                Bringing{" "}
                <span className="text-[#E8B27A]">Authentic Asian Flavors</span>{" "}
                to Every Home
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
                From our kitchen to yours — real spices, real ingredients, real
                flavor. No additives. No shortcuts. Just authentic Asian cuisine
                made accessible across the Netherlands.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Link
                  href="/spices"
                  className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 sm:px-7 sm:py-3"
                >
                  Shop Our Range
                </Link>
                <Link
                  href="#our-story"
                  className="rounded-full border border-white/60 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 sm:px-7 sm:py-3"
                >
                  Our Story
                </Link>
              </div>
            </div>

            <aside className="w-full max-w-[270px] rounded-2xl border border-white/35 bg-white/10 p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-6 lg:justify-self-end">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E8B27A]">
                Our Promise
              </p>
              <ul className="mt-4 space-y-3 sm:space-y-3.5">
                {promiseItems.map(({ label, icon: Icon, iconClass }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 text-sm font-medium text-white sm:text-[15px]"
                  >
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${iconClass}`}
                      strokeWidth={2}
                    />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-white/20 pt-3.5">
                <p className="flex items-center gap-2 text-xs text-white/90 sm:text-sm">
                  <span>Delivering across</span>
                  <span
                    className="inline-flex h-3.5 w-5 flex-col overflow-hidden rounded-[2px] shadow-sm"
                    title="Netherlands"
                    aria-label="Netherlands"
                  >
                    <span className="h-full w-full bg-[#AE1C28]" />
                    <span className="h-full w-full bg-white" />
                    <span className="h-full w-full bg-[#21468B]" />
                  </span>
                  <span>Netherlands</span>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Story />
      <OurMission />
      <WhatWeBring />
      <SupportFarmers />
      <QualityTrust />
      <WhatWeOffer />
      <ForEveryone />
      <WhyChoose />
      <StoryBanner />
      <ReadyToCook />

      <div className="[&>footer]:mt-0">
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
