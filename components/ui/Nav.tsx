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
import GoogleTranslateButton from "../layout/navigation/GoogleTranslateButton";
import NavSearch from "../layout/navigation/NavSearch";
import MobileBottomNav from "../layout/navigation/MobileBottomNav";
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
    <div className="relative z-10 flex max-w-[min(100vw-1.5rem,90rem)] items-center gap-0 overflow-visible rounded-full bg-[#fdf8f1] px-2 py-1.5 shadow-md">
      <ResponsiveNavigation />

      <span className="mx-2 h-5 w-px shrink-0 bg-gray-300" aria-hidden />
      <NavSearch />

      <span className="mx-1 h-5 w-px shrink-0 bg-gray-300" aria-hidden />
      <CartandWhishBtn />

      <span className="mx-1 h-5 w-px shrink-0 bg-gray-300" aria-hidden />
      <ButtonsNavigation />

      <span className="mx-1 h-5 w-px shrink-0 bg-gray-300" aria-hidden />
      <GoogleTranslateButton />

      <span className="mx-1 h-5 w-px shrink-0 bg-gray-300" aria-hidden />
      <UpperSelection />
    </div>
  );

  const logoImage = (
    <Image
      src="/assets/logo/Group 87.png"
      alt="Asian Spices Logo"
      width={180}
      height={60}
      priority
      fetchPriority="high"
      className="h-10 w-auto object-contain sm:h-12 md:h-14 lg:h-16"
    />
  );

  const mobileHeader = (
    <div className="pointer-events-auto w-full bg-white shadow-sm border-b border-gray-100 xl:hidden">
      <div className="flex min-h-[3.25rem] items-center justify-between gap-1.5 px-2.5 pt-2 pb-1.5 sm:gap-2 sm:px-5 sm:pt-2.5">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
          <ResponsiveNavigation mobileOnly />
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/assets/logo/Group 87.png"
              alt="Asian Spices Logo"
              width={160}
              height={48}
              priority
              fetchPriority="high"
              className="h-7.5 w-auto object-contain sm:h-9 md:h-10"
            />
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <GoogleTranslateButton />
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition hover:bg-gray-50 active:scale-95"
          >
            <ShoppingCart className="h-5 w-5 text-gray-700 sm:h-5.5 sm:w-5.5" strokeWidth={1.8} />
            {itemInCart > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {itemInCart > 99 ? "99+" : itemInCart}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="px-2.5 pb-2.5 pt-0.5 sm:px-5 sm:pb-3">
        <NavSearch variant="mobile" />
      </div>
    </div>
  );

  const bar = (
    <div
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999999 }}
      className="pointer-events-none"
    >
      {/* Mobile: two-row header */}
      {mobileHeader}

      {/* Desktop: floating logo + pill */}
      <div
        className={`hidden px-3 transition-all duration-300 sm:px-5 xl:block ${
          scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4"
        }`}
      >
        <nav
          className={`container relative mx-auto flex items-center p-2 transition-all duration-300 ${
            scrolled
              ? "min-h-12 justify-center sm:min-h-14"
              : "min-h-14 justify-between sm:min-h-16 xl:min-h-20"
          }`}
        >
          <div
            className={`pointer-events-auto shrink-0 transition-all duration-300 ${
              scrolled
                ? "pointer-events-none w-0 scale-90 overflow-hidden opacity-0"
                : "opacity-100"
            }`}
          >
            <Link
              href="/"
              className="block shrink-0"
              aria-hidden={scrolled}
              tabIndex={scrolled ? -1 : 0}
            >
              {logoImage}
            </Link>
          </div>

          <div
            className={`pointer-events-auto transition-all duration-300 ${
              scrolled ? "" : "ml-auto"
            }`}
          >
            {desktopPill}
          </div>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Reserves header height so content does not jump under the fixed bar */}
      <div className="h-[6.5rem] shrink-0 sm:h-[7rem] md:h-[7.5rem] xl:h-28" aria-hidden />
      {mounted ? (
        <>
          {createPortal(bar, document.body)}
          {createPortal(
            <>
              {/* Pushes page content above the floating mobile bottom nav */}
              <div
                className="h-[4.75rem] shrink-0 xl:hidden"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                aria-hidden
              />
              <MobileBottomNav />
            </>,
            document.body,
          )}
        </>
      ) : null}
    </>
  );
};

export default Nav;
