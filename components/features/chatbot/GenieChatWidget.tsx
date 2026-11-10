// components/chatbot/GenieChatWidget.tsx

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { GenieChatPanel } from "@/components/features/chatbot/GenieChatPanel";

type GenieChatWidgetProps = {
  panelClassName?: string;
  launcherClassName?: string;
};

/** Remembers the tucked-away choice for the current browser session only. */
const TUCKED_STORAGE_KEY = "genie-widget-tucked";

export function GenieChatWidget({
  panelClassName,
  launcherClassName,
}: GenieChatWidgetProps) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isTucked, setIsTucked] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(TUCKED_STORAGE_KEY) === "1") {
        setIsTucked(true);
      }
    } catch {
      /* sessionStorage can be unavailable in some embedded contexts */
    }
  }, []);

  const tuckAway = () => {
    setIsWidgetOpen(false);
    setIsTucked(true);
    try {
      sessionStorage.setItem(TUCKED_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const restore = () => {
    setIsTucked(false);
    setIsWidgetOpen(true);
    try {
      sessionStorage.removeItem(TUCKED_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const panelVisible = isWidgetOpen && !isTucked;

  return (
    <div className="notranslate" translate="no">
      <motion.div
        initial={false}
        animate={
          panelVisible
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 24, scale: 0.98 }
        }
        transition={{ duration: 0.32, ease: "easeOut" }}
        aria-hidden={!panelVisible}
        className={
          panelClassName ??
          `fixed inset-x-2 bottom-[10.5rem] top-[6.5rem] z-40 sm:inset-x-3 md:inset-x-auto md:bottom-[8rem] md:right-5 md:w-[min(700px,calc(100vw-2rem))] xl:w-[720px] ${
            panelVisible
              ? "pointer-events-auto visible"
              : "pointer-events-none invisible"
          }`
        }
      >
        <GenieChatPanel onClose={() => setIsWidgetOpen(false)} />
      </motion.div>

      {/* Edge tab — the tucked-away state. Always mounted, slid off-screen when not tucked. */}
      <motion.button
        type="button"
        onClick={restore}
        initial={false}
        animate={isTucked ? { x: 0, opacity: 1 } : { x: 48, opacity: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        aria-label="Reopen Genie chat"
        aria-hidden={!isTucked}
        className={`fixed bottom-24 right-0 z-50 flex flex-col items-center gap-1.5 rounded-l-xl border border-r-0 border-[rgba(79,70,229,0.35)] bg-[rgba(238,242,255,0.96)] px-1.5 py-3 text-[#3730A3] shadow-[0_10px_28px_rgba(11,31,77,0.22)] backdrop-blur transition-[padding,background] hover:bg-[#EEF2FF] hover:pl-2.5 ${
          isTucked ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
        <span className="text-xs font-semibold tracking-wide [writing-mode:vertical-rl]">
          Genie
        </span>
      </motion.button>

      {/* Normal launcher */}
      {!isTucked ? (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className={
            launcherClassName ??
            "fixed bottom-[5.75rem] right-3 z-50 md:bottom-6 md:right-6"
          }
        >
          <div className="group relative flex items-center gap-2 sm:gap-3">
            {!isWidgetOpen ? (
              <div className="rounded-full border border-[rgba(255,255,255,0.48)] bg-[rgba(238,242,255,0.75)] px-2.5 py-1 text-[11px] sm:px-4 sm:py-2 sm:text-sm font-medium text-[#3730A3] shadow-[0_12px_28px_rgba(11,31,77,0.2)]">
                ✨ Need help?
              </div>
            ) : null}

            <div className="relative">
              {!isWidgetOpen ? (
                <button
                  type="button"
                  onClick={tuckAway}
                  aria-label="Hide Genie"
                  className="absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(79,70,229,0.3)] bg-white text-[#3730A3] opacity-0 shadow-md transition hover:bg-[#EEF2FF] focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 max-sm:opacity-100"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setIsWidgetOpen((current) => !current)}
                className="relative flex h-[64px] w-[64px] items-center justify-center rounded-full border border-[rgba(79,70,229,0.4)] bg-[rgba(238,242,255,0.55)] shadow-[0_18px_44px_rgba(11,31,77,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(11,31,77,0.36)] sm:h-[76px] sm:w-[76px] md:h-[104px] md:w-[104px] xl:h-[112px] xl:w-[112px]"
                aria-label={
                  isWidgetOpen
                    ? "Close Genie chat widget"
                    : "Open Genie chat widget"
                }
              >
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_46%),linear-gradient(160deg,rgba(37,99,235,0.16),rgba(79,70,229,0.1))]" />
                <div className="relative flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-full sm:h-[66px] sm:w-[66px] md:h-[90px] md:w-[90px] xl:h-[98px] xl:w-[98px]">
                  <Image
                    src="/assets/chatbot/genie-avatar.jpeg"
                    alt="Genie logo"
                    width={98}
                    height={98}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
