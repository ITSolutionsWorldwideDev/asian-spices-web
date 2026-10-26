// components/ui/ScrollToTop.tsx
// Scrolls to top on every client-side route change so the fixed
// header spacer aligns correctly and there's no extra gap.

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Disable default browser scroll restoration so it doesn't fight Next.js
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // Skip the very first render (SSR/initial load already starts at top)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Ensure body overflow is not locked (safety net from mobile menu drawer)
    document.body.style.overflow = "auto";

    // Instant scroll to top on window and root elements
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    // Second tick in case React finishes mounting DOM elements after stream
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });
  }, [pathname]);

  return null;
}
