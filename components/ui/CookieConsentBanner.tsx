"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "essential-cookie-notice-seen";

export default function CookieConsentBanner() {
  const [consentSeen, setConsentSeen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) === "true";
    setConsentSeen(saved);
    setLoaded(true);
  }, []);

  const handleChoice = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setConsentSeen(true);
  };

  if (!loaded || consentSeen) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-[999999] max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl sm:left-auto sm:right-4 sm:max-w-md xl:bottom-4 xl:max-w-lg"
    >
      <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
        We use only necessary cookies required for login, cart, and secure site
        functionality.{" "}
        <a
          href="/cookies"
          className="font-semibold text-orange-600 underline underline-offset-2 hover:text-orange-700"
        >
          Read our Cookie Policy
        </a>
      </p>

      <div className="mt-3 flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={handleChoice}
          className="flex-1 cursor-pointer rounded-lg bg-black px-4 py-2 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 active:scale-95 sm:flex-initial sm:text-sm"
        >
          Accept Cookies
        </button>
        <button
          type="button"
          onClick={handleChoice}
          className="flex-1 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95 sm:flex-initial sm:text-sm"
        >
          Reject Cookies
        </button>
      </div>
    </div>
  );
}
