// app/page.tsx

import type { Metadata } from "next";
import Homei from "@/components/features/home/Home";

export const metadata: Metadata = {
  title: "Asian Grocery Store & Supermarket Online | Asian Spices online",
  description:
    "Shop premium Asian spices at grocery store & Supermarket: spices, rice, lentils, snacks and everyday essentials from across Asia, picked for your kitchen",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div>
      <Homei />
    </div>
  );
}
