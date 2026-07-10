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
    <div className="fixed bottom-4 left-4 right-4 z-[100] rounded-xl border border-gray-200 bg-white p-4 shadow-2xl md:left-auto md:max-w-xl">
      <p className="text-sm text-gray-700">
        We use only necessary cookies required for login, cart, and secure site
        functionality.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={handleChoice}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Accept Cookies
        </button>
        <button
          onClick={handleChoice}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
        >
          Reject Cookies
        </button>
      </div>
    </div>
  );
}
