//  components/layout/home/Header.tsx

"use client";

import { useEffect, useState } from "react";
import HeaderContent from "./HeaderContent";
import Nav from "@/components/ui/Nav"; // Move Nav Import Here!

const frames = [
  {
    id: 1,
    title: "Golden Turmeric",
    subtitle: "Premium Collection",
    quality: "Organic & Pure",
    description: `Hand-picked organic turmeric from the highlands of India. Rich in curcumin with powerful anti-inflammatory properties and 
                  authentic earthy flavor.`,
    stats: {
      Curcumin_Content: "95%",
      Customer_Rating: "4.9/5",
      Origin: "Kerala, India",
    },
  },
  {
    id: 2,
    title: "Authentic Asian Spices",
    subtitle: "Exotic Selection",
    quality: "Discover True Flavors",
    description: `Explore our curated collection of rare Asian spices. From fragrant cardamom to fiery chili peppers, experience the authentic taste of Asia in every dish.`,
    stats: {
      varieties: "200+",
      countries: "15+",
      organic: "100%",
    },
  },
  {
    id: 3,
    title: "Traditional Spice Market",
    subtitle: "Heritage Quality",
    quality: "Farm To Table",
    description: `Experience the vibrant traditions of Asian spice markets. Premium quality spices sourced directly from trusted farmers who practice sustainable agriculture.`,
    stats: {
      partnerfarms: "500+",
      fairtrades: "Yes",
      since: "2010",
    },
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
    // Added bg-zinc-950 fallback block color to stop the white flash screen completely
    <section className="relative w-full min-h-[90vh] flex flex-col justify-between overflow-hidden bg-zinc-950">
      {/* 1. OPTIMIZED BACKGROUND VIDEO LAYER */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 transition-opacity duration-700"
        src="/assets/home/homeheaderimages/Loop Slider.mp4"
        preload="auto" // Forces immediate asset buffer pipelines
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        onCanPlay={(e) => {
          // Graceful fade-in once video has buffered enough to play smoothly
          e.currentTarget.classList.remove("opacity-0");
        }}
      />
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* 2. STATIC NAV LAYER */}
      <div className="relative z-30 w-full">
        <Nav />
      </div>

      {/* 3. FIXED HEADING SLIDER SECTION */}
      <div className="relative z-20 flex-1 flex items-center w-full">
        <div
          key={index}
          className="w-full min-h-[400px] flex items-center transition-all duration-500 animate-fade-in"
        >
          <HeaderContent current={current} />
        </div>
      </div>

      {/* 4. NAVIGATION LINES */}
      <div className="relative z-20 mt-6 mb-10 flex items-center justify-center gap-6 container mx-auto">
        {frames.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-300 h-[5px] w-14 rounded-full cursor-pointer
              ${index === i ? "bg-white" : "bg-white/30 hover:bg-white/50"}
            `}
          ></button>
        ))}
      </div>
    </section>
  );
}

/* export default function Header() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const current = frames[index];

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-between overflow-hidden">
 
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/assets/home/homeheaderimages/Loop Slider.mp4"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
      />
      <div className="absolute inset-0 bg-black/40 z-10" />


      <div className="relative z-30 w-full">
        <Nav />
      </div>


      <div className="relative z-20 flex-1 flex items-center w-full">

        <div
          key={index}
          className="w-full min-h-[400px] flex items-center transition-all duration-500 animate-fade-in"
        >
          <HeaderContent current={current} />
        </div>
      </div>

  
      <div className="relative z-20 mt-6 mb-10 flex items-center justify-center gap-6 container mx-auto">
        {frames.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-300 h-[5px] w-14 rounded-full cursor-pointer
              ${index === i ? "bg-white" : "bg-white/30 hover:bg-white/50"}
            `}
          ></button>
        ))}
      </div>
    </section>
  );
} */
