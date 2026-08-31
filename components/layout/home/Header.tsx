//  components/layout/home/Header.tsx

"use client";

import { useEffect, useState } from "react";
import HeaderContent from "./HeaderContent";
import Nav from "@/components/ui/Nav";
import LazyVideo from "@/components/ui/LazyVideo";

const frames = [
  {
    id: 1,
    title: "Golden Turmeric",
    subtitle: "Premium Collection",
    quality: "Organic & Pure",
    description: `Hand-picked organic turmeric from the highlands of India. Rich in curcumin with powerful anti-inflammatory properties and 
                  authentic earthy flavor.`,
    // stats: {
    //   Curcumin_Content: "95%",
    //   Customer_Rating: "4.9/5",
    //   Origin: "Kerala, India",
    // },
  },
  {
    id: 2,
    title: "Authentic Asian Spices",
    subtitle: "Exotic Selection",
    quality: "Discover True Flavors",
    description: `Explore our curated collection of rare Asian spices. From fragrant cardamom to fiery chili peppers, experience the authentic taste of Asia in every dish.`,
    // stats: {
    //   varieties: "200+",
    //   countries: "15+",
    //   organic: "100%",
    // },
  },
  {
    id: 3,
    title: "Traditional Spice Market",
    subtitle: "Heritage Quality",
    quality: "Farm To Table",
    description: `Experience the vibrant traditions of Asian spice markets. Premium quality spices sourced directly from trusted farmers who practice sustainable agriculture.`,
    // stats: {
    //   partnerfarms: "500+",
    //   fairtrades: "Yes",
    //   since: "2010",
    // },
  },
];

export default function Header() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const current = frames[index];

  return (
    <section className="relative w-full bg-zinc-950">
      <LazyVideo
        mode="hero"
        src="/assets/home/homeheaderimages/Loop Slider.mp4"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/40 z-10" aria-hidden />

      <Nav />

      <div className="relative z-20 w-full pb-8 md:min-h-[340px] md:pb-10 lg:min-h-[380px] lg:pb-12">
        <div
          key={index}
          className="pointer-events-auto flex w-full min-h-[inherit] items-center py-6 transition-all duration-500 animate-fade-in md:py-8 lg:py-10"
        >
          <HeaderContent current={current} />
        </div>
      </div>
    </section>
  );
}