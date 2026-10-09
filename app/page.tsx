// app/page.tsx

import type { Metadata } from "next";
import Homei from "@/components/layout/home/Home";

export const metadata: Metadata = {
  title: "Asian Spices Online | Authentic Indian & Asian Groceries NL",
  description:
    "Shop premium Asian spices, rice, lentils & pantry staples online in the Netherlands. Authentic ingredients, fast NL delivery, and recipes to match.",
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
