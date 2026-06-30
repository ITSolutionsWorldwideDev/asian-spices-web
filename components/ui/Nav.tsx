// apps/web/components/ui/Nav.tsx

import React from "react";

import Link from "next/link";
import ButtonsNavigation from "../layout/navigation/ButtonsNavigation";
import ResponsiveNavigation from "../layout/navigation/ResponsiveNavigation";
import CartandWhishBtn from "../layout/navigation/CartandWhishBtn";
import UpperSelection from "../layout/navigation/UpperSelection";

import Image from "next/image";

const Nav: React.FC = () => {
  return (
    <div className="relative inset-0 px-4 py-3 sm:p-6 z-50">
      <div>
        
      </div>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-3 sm:px-6 container mx-auto text-xs sm:text-sm">
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <Link href="/" className="p-1 block">
            <Image
              src="/assets/logo/Group 87.png"
              alt="Asian Spices Logo"
              width={180}
              height={60}
              className="h-8 sm:h-10 md:h-14 lg:h-16 w-auto object-contain"
            />
          </Link>
        </div>

        {/* RIGHT: Actions + Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ResponsiveNavigation />
          <CartandWhishBtn />
          <ButtonsNavigation />
        </div>
      </nav>
    </div>
  );
};

export default Nav;
