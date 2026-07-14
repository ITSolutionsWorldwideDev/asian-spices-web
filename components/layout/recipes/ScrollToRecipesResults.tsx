"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function scrollToResults() {
  const el = document.getElementById("recipes-results");
  if (!el) return false;

  const y = el.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  return true;
}

/** When URL has search/category/tag/hash, scroll to results (not the header). */
export default function ScrollToRecipesResults() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  useEffect(() => {
    if (pathname !== "/recipes") return;

    const shouldScroll =
      window.location.hash === "#recipes-results" ||
      !!search ||
      !!category ||
      !!tag;

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
  }, [pathname, search, category, tag]);

  return null;
}
