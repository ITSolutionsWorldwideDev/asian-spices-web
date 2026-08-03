import React from "react";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import Link from "next/link";
import Story from "@/components/layout/about_us/Story";
import OurMission from "@/components/layout/about_us/OurMission";
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
      <section className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/home/homeheaderimages/14b140c043c554c46173a4756175feabd5060b1f.webp')",
          }}
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <Nav />
        <div className="relative z-10 container mx-auto px-4 pb-14 pt-8 sm:pb-16 lg:pb-20">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_minmax(260px,300px)] lg:gap-12">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-amber-200/35 bg-amber-200/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
                About Asian Spices · Est. 2026 · Amsterdam, Netherlands
              </p>
              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                Bringing{" "}
                <span className="text-[#E8B27A]">Authentic Asian Flavors</span>{" "}
                to Every Home
              </h1>
              <p className="mt-6 max-w-2xl text-base text-white/90 sm:text-lg">
                From our kitchen to yours — real spices, real ingredients, real
                flavor. No additives. No shortcuts. Just authentic Asian cuisine
                made accessible across the Netherlands.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/spices"
                  className="rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Shop Our Range
                </Link>
                <Link
                  href="#our-story"
                  className="rounded-full border border-white/60 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Our Story
                </Link>
              </div>
            </div>

            <aside className="w-full max-w-[280px] rounded-[1.75rem] border border-white/35 bg-white/10 p-7 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:justify-self-end">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E8B27A]">
                Our Promise
              </p>
              <ul className="mt-5 space-y-4">
                {promiseItems.map(({ label, icon: Icon, iconClass }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 text-[15px] font-medium text-white"
                  >
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${iconClass}`}
                      strokeWidth={2}
                    />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-white/20 pt-4">
                <p className="flex items-center gap-2 text-sm text-white/90">
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
      <QualityTrust />
      <WhatWeOffer />
      <ForEveryone />
      <WhyChoose />
      <StoryBanner />
      <ReadyToCook />

      <Footer />
    </div>
  );
};

export default AboutUs;
