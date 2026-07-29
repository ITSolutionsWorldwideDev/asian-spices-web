"use client";

import React, { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import ResponsiveNavigation from "../layout/navigation/ResponsiveNavigation";
import CartandWhishBtn from "../layout/navigation/CartandWhishBtn";
import ButtonsNavigation from "../layout/navigation/ButtonsNavigation";
import UpperSelection from "../layout/navigation/UpperSelection";
import NavSearch from "../layout/navigation/NavSearch";
import useNavbarVisibility from "@/hooks/useNAvbarVisibility";

const subscribeToClient = () => () => {};

const Nav: React.FC = () => {
  const visible = useNavbarVisibility(2500);
  const mounted = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  const bar = (
    <div
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999999 }}
      className={`px-3 py-3 sm:px-5 sm:py-4 ${visible ? "" : "pointer-events-none"}`}
    >
      <nav
        className={`container mx-auto flex items-center justify-between gap-6 p-2 transition-all duration-500 ease-in-out lg:gap-10 ${
          visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
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

        <div className="hidden items-center gap-0 rounded-full bg-[#fdf8f1] px-2 py-1.5 shadow-md lg:inline-flex">
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

        <div className="ml-auto flex items-center lg:hidden">
          <div className="rounded-full bg-[#fdf8f1] p-1 shadow-md">
            <ResponsiveNavigation mobileOnly />
          </div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* The fixed portal is outside page flow, so reserve its exact height here. */}
      <div className="h-20 shrink-0 sm:h-24 lg:h-28" aria-hidden />
      {mounted ? createPortal(bar, document.body) : null}
    </>
  );
};

export default Nav;
