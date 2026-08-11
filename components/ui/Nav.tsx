"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import ResponsiveNavigation from "../layout/navigation/ResponsiveNavigation";
import CartandWhishBtn from "../layout/navigation/CartandWhishBtn";
import ButtonsNavigation from "../layout/navigation/ButtonsNavigation";
import UpperSelection from "../layout/navigation/UpperSelection";
import NavSearch from "../layout/navigation/NavSearch";
import { useCartStore } from "@/store/useCartStore";

const subscribeToClient = () => () => {};

const Nav: React.FC = () => {
  const { cart } = useCartStore();
  const itemInCart = cart.length;
  const [scrolled, setScrolled] = useState(false);
  const mounted = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const desktopPill = (
    <div className="relative z-10 inline-flex max-w-[min(100vw-10rem,72rem)] items-center gap-0 overflow-visible rounded-full bg-[#fdf8f1] px-2 py-1.5 shadow-md">
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
  );

  const mobileActions = (
    <div className="flex items-center gap-2">
      <Link
        href="/cart"
        aria-label="Cart"
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#fdf8f1] text-gray-800 shadow-md transition active:scale-95"
      >
        <ShoppingCart className="h-5 w-5" strokeWidth={2} />
        {itemInCart > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {itemInCart > 99 ? "99+" : itemInCart}
          </span>
        )}
      </Link>

      <div className="rounded-full bg-[#fdf8f1] p-1 shadow-md">
        <ResponsiveNavigation mobileOnly />
      </div>
    </div>
  );

  const logo = (
    <Link
      href="/"
      className="block shrink-0"
      aria-hidden={scrolled}
      tabIndex={scrolled ? -1 : 0}
    >
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
  );

  const bar = (
    <div
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999999 }}
      className={`pointer-events-none px-3 transition-all duration-300 sm:px-5 ${
        scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4"
      }`}
    >
      <nav
        className={`container relative mx-auto flex items-center p-2 transition-all duration-300 ${
          scrolled ? "min-h-12 justify-center sm:min-h-14" : "min-h-14 justify-between sm:min-h-16 lg:min-h-20"
        }`}
      >
        {/* Logo only at page top — hides when scrolling so it does not stick */}
        <div
          className={`pointer-events-auto shrink-0 transition-all duration-300 ${
            scrolled
              ? "pointer-events-none w-0 scale-90 overflow-hidden opacity-0"
              : "opacity-100"
          }`}
        >
          {logo}
        </div>

        <div
          className={`pointer-events-auto hidden transition-all duration-300 lg:block ${
            scrolled ? "" : "ml-auto"
          }`}
        >
          {desktopPill}
        </div>

        <div
          className={`pointer-events-auto transition-all duration-300 lg:hidden ${
            scrolled ? "" : "ml-auto"
          }`}
        >
          {mobileActions}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Reserves header height so content does not jump under the fixed bar */}
      <div className="h-20 shrink-0 sm:h-24 lg:h-28" aria-hidden />
      {mounted ? createPortal(bar, document.body) : null}
    </>
  );
};

export default Nav;
