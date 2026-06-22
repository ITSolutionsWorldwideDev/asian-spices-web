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
    <section className="relative w-full min-h-[90vh] flex flex-col justify-between overflow-hidden">
      {/* 1. BACKGROUND VIDEO LAYER */}
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

      {/* 2. STATIC NAV LAYER (Never re-renders or slides) */}
      <div className="relative z-30 w-full">
        <Nav />
      </div>

      {/* 3. FIXED HEADING SLIDER SECTION */}
      <div className="relative z-20 flex-1 flex items-center w-full">
        {/* Defining a min-height container blocks description texts from bouncing layout layout heights */}
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

/* "use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeaderContent from "./HeaderContent";

const frames = [
  {
    id: 1,
    title: "Golden Turmeric",
    subtitle: "Premium Collection",
    quality: "Organic & Pure",
    description: `Hand-picked organic turmeric from the highlands of India. Rich in curcumin with powerful anti-inflammatory properties and 
                  authentic earthy flavor.`,
    img: "a8de5a3724f7239b78cdee795f978b5faba485b4 (1).webp",
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
    // img: "0e72f704144da62cceae789fe0037f38a650f230.webp",
    video: "Slider_2.mp4",
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
    // img: "14b140c043c554c46173a4756175feabd5060b1f.webp",
    video: "Slider_3.mp4",
    stats: {
      partnerfarms: "500+",
      fairtrades: "Yes",
      since: "2010",
    },
  },
];

export default function Header() {
  const [index, setIndex] = useState(0);

  // Auto change every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const current = frames[index];

  return (
    <section className="relative w-full  flex flex-col">
  
      {current && current.img && (
        <>
          <Image
            src={`/assets/home/homeheaderimages/${current.img}`}
            alt={current.title}
            fill
            className="object-cover"
          />


          <HeaderContent current={current} />
        </>
      )}

      {current && current.video && (
        <>
          <video
            className="w-full h-full absolute inset-0 object-cover"
            src={`/assets/home/homeheaderimages/${current.video}`}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
          />

       
          <HeaderContent current={current} />
        </>
      )}


      <div className="relative z-10 mt-10 mb-10 flex items-center justify-center gap-6 container mx-auto ">
        {frames.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-300 h-1.25 w-14 rounded-full  cursor-pointer
              ${index === i ? "bg-white" : "bg-white/30 hover:bg-white/50"}
            `}
          ></button>
        ))}
      </div>

    </section>
  );
}
 */
