"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
          },
          elementId: string,
        ) => void;
      };
    };
  }
}

const SCRIPT_ID = "google-translate-script";
const ELEMENT_ID = "google_translate_element";

const LANGUAGES = [
  { code: "nl", label: "NL" },
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
] as const;

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function readSelectedLang(): string {
  const value = getCookie("googtrans");
  if (!value) return "en";
  const parts = value.replace(/^\//, "").split(/[/|]/);
  return parts[1] || parts[0] || "en";
}

function setTranslateCookie(lang: string) {
  const host = window.location.hostname;
  const clear = (domain?: string) => {
    const base = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = domain ? `${base}; domain=${domain}` : base;
  };

  clear();
  if (host && host !== "localhost") clear(`.${host}`);
  if (lang !== "en") document.cookie = `googtrans=/en/${lang}; path=/`;
}

function hideGoogleTopBar() {
  document
    .querySelectorAll<HTMLElement>(
      ".goog-te-banner-frame, iframe.goog-te-banner-frame, body > .skiptranslate",
    )
    .forEach((el) => {
      el.style.display = "none";
    });
  document.body.style.top = "0";
}

function ensureGoogleTranslateHost() {
  if (document.getElementById(ELEMENT_ID)) return;
  const host = document.createElement("div");
  host.id = ELEMENT_ID;
  host.style.display = "none";
  document.body.appendChild(host);
}

function initGoogleTranslate() {
  ensureGoogleTranslateHost();

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) return;
    const host = document.getElementById(ELEMENT_ID);
    if (host?.hasChildNodes()) return;
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: LANGUAGES.map((l) => l.code).join(","),
        autoDisplay: false,
      },
      ELEMENT_ID,
    );
    hideGoogleTopBar();
  };

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  } else if (window.google?.translate?.TranslateElement) {
    window.googleTranslateElementInit();
  }
}

/**
 * Navbar language picker via Google Translate (browser-side only).
 * Does not change URLs, DB, cart, or pricing logic.
 */
export default function GoogleTranslateButton() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("en");
  const [mounted, setMounted] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null,
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setSelected(readSelectedLang());
    initGoogleTranslate();
  }, []);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) {
      setMenuPos(null);
      return;
    }
    const r = btnRef.current.getBoundingClientRect();
    setMenuPos({ top: r.bottom + 8, left: r.right - 144 });
  }, [open]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const applyLanguage = (code: string) => {
    setOpen(false);
    if (code === selected) return;

    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event("change"));
      setSelected(code);
      requestAnimationFrame(hideGoogleTopBar);
      setTimeout(hideGoogleTopBar, 300);
      return;
    }

    setTranslateCookie(code);
    window.location.reload();
  };

  const current =
    LANGUAGES.find((l) => l.code === selected)?.label ?? "EN";

  const menu =
    mounted &&
    open &&
    menuPos &&
    createPortal(
      <div
        ref={menuRef}
        className="notranslate overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
        translate="no"
        style={{
          position: "fixed",
          top: menuPos.top,
          left: Math.max(8, menuPos.left),
          width: 144,
          zIndex: 10000000,
        }}
      >
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyLanguage(lang.code)}
            className={`flex w-full px-3 py-2.5 text-left text-xs hover:bg-gray-50 ${
              selected === lang.code
                ? "font-semibold text-gray-900"
                : "text-gray-700"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>,
      document.body,
    );

  return (
    <div className="relative shrink-0 notranslate" translate="no">
      <button
        ref={btnRef}
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-full bg-[#e8dfd0] px-2.5 py-1 text-xs font-semibold text-gray-800 transition hover:bg-[#ddd2c0]"
        aria-label="Translate page"
        aria-expanded={open}
      >
        <span>{current}</span>
        <ChevronDown className="h-3 w-3 shrink-0 text-gray-500" />
      </button>
      {menu}
    </div>
  );
}
