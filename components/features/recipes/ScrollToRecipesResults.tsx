"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function scrollToResults() {
  const el =
    document.getElementById("recipes-products") ||
    document.getElementById("recipes-results");
  if (!el) return false;

  const y = el.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  return true;
}

/** When URL has a search query or #recipes-results hash, scroll to results. */
export default function ScrollToRecipesResults() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    if (pathname !== "/recipes") return;

    // Category/tag filters should not force a scroll jump.
    const shouldScroll =
      window.location.hash === "#recipes-results" ||
      window.location.hash === "#recipes-products" ||
      !!search;

    if (!shouldScroll) return;

    let attempts = 0;
    let timer: number | undefined;

    const tick = () => {
      attempts += 1;
      if (scrollToResults() || attempts >= 30) return;
      timer = window.setTimeout(tick, 80);
    };

    timer = window.setTimeout(tick, 50);

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [pathname, search]);

  return null;
}
