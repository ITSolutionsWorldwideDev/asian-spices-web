"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import ResponsiveNavigation from "../layout/navigation/ResponsiveNavigation";
import CartandWhishBtn from "../layout/navigation/CartandWhishBtn";
import ButtonsNavigation from "../layout/navigation/ButtonsNavigation";
import UpperSelection from "../layout/navigation/UpperSelection";
import NavSearch from "../layout/navigation/NavSearch";
import useNavbarVisibility from "@/hooks/useNAvbarVisibility";

const Nav: React.FC = () => {
  const visible = useNavbarVisibility(2500);

  return (
    <div className=" z-50 px-3 py-3 sm:px-5 sm:py-4">
      <nav className="container flex items-center gap-6 lg:gap-10 justify-between p-5">
        {/* Logo — sits outside the pill */}
        <Link href="/" className="block shrink-0">
          <Image
            src="/assets/logo/Group 87.png"
            alt="Asian Spices Logo"
            width={180}
            height={60}
            priority
            fetchPriority="high"
            className="h-10 w-auto object-contain sm:h-12 md:h-14 lg:h-16"
          />
        </Link>

        {/* ── Desktop pill bar — hides when idle ── */}
        <div
          className={`hidden items-center gap-0 rounded-full bg-[#fdf8f1] px-2 py-1.5 shadow-md transition-all duration-500 ease-in-out lg:inline-flex fixed  left-0 right-0 mx-auto w-fit ${
            visible
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <ResponsiveNavigation />

          <span className="mx-2 h-5 w-px shrink-0 bg-gray-300" aria-hidden />
          <NavSearch />

          <span className="mx-1 h-5 w-px shrink-0 bg-gray-300" aria-hidden />
          <CartandWhishBtn />

          <span className="mx-1 h-5 w-px shrink-0 bg-gray-300" aria-hidden />
          <ButtonsNavigation />

          <span className="mx-1 h-5 w-px shrink-0 bg-gray-300" aria-hidden />
          <UpperSelection />
        </div>

        {/* ── Mobile hamburger — always visible ── */}
        <div className="ml-auto flex items-center lg:hidden">
          <ResponsiveNavigation mobileOnly />
        </div>
      </nav>
    </div>
  );
};

export default Nav;
