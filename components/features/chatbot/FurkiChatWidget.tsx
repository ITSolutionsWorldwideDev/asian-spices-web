//  components/chatbot/FurkiChatWidget.tsx

"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { FurkiChatPanel } from "@/components/features/chatbot/FurkiChatPanel";

type FurkiChatWidgetProps = {
  panelClassName?: string;
  launcherClassName?: string;
};

const DISMISS_KEY = "furki-chat-dismissed";

// Below md the launcher sits above the MobileBottomNav bar (hidden from xl up);
// the panel starts below the fixed site header (~116px tall).
export function FurkiChatWidget({
  panelClassName,
  launcherClassName,
}: FurkiChatWidgetProps) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsWidgetOpen(false);
    setIsDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Storage unavailable
    }
  };

  const handleRestore = () => {
    setIsDismissed(false);
    try {
      window.sessionStorage.removeItem(DISMISS_KEY);
    } catch {
      // Storage unavailable
    }
  };

  if (isDismissed) {
    return (
      <div className="notranslate" translate="no">
        <button
          type="button"
          onClick={handleRestore}
          className="fixed bottom-3 right-3 z-50 flex items-center gap-2 rounded-full border border-[rgba(209,179,149,0.55)] bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#8a4a1f] shadow-md hover:bg-orange-50 hover:shadow-lg transition-all"
          aria-label="Re-open Furki customer support chat"
        >
          <div className="relative h-5 w-5 overflow-hidden rounded-full">
            <Image
              src="/assets/chatbot/furki-avatar-cutout.webp"
              alt="Furki"
              width={20}
              height={20}
              className="h-full w-full object-cover"
            />
          </div>
          <span>Need help?</span>
        </button>
      </div>
    );
  }

  return (
    <div className="notranslate" translate="no">
      <motion.div
        initial={false}
        animate={
          isWidgetOpen
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 24, scale: 0.98 }
        }
        transition={{ duration: 0.32, ease: "easeOut" }}
        aria-hidden={!isWidgetOpen}
        className={
          panelClassName ??
          `fixed inset-x-2 bottom-[10.5rem] top-[6.5rem] z-40 sm:inset-x-3 md:inset-x-auto md:bottom-[8rem] md:right-5 md:w-[min(700px,calc(100vw-2rem))] xl:w-[720px] ${
            isWidgetOpen
              ? "pointer-events-auto visible"
              : "pointer-events-none invisible"
          }`
        }
      >
        <FurkiChatPanel onClose={() => setIsWidgetOpen(false)} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
        className={
          launcherClassName ??
          "fixed bottom-[5.75rem] right-3 z-50 md:bottom-6 md:right-6"
        }
      >
        <div className="relative flex items-center gap-2 sm:gap-3">
          {!isWidgetOpen ? (
            <div className="flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.7)] bg-[rgba(255,249,242,0.95)] py-1 pl-3 pr-1.5 text-[11px] sm:py-1.5 sm:pl-3.5 sm:text-xs font-medium text-[#8a4a1f] shadow-[0_12px_28px_rgba(35,24,19,0.14)] backdrop-blur-sm">
              <span>Need help?</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss();
                }}
                className="flex h-5 w-5 items-center justify-center rounded-full text-[#8a4a1f] hover:bg-[rgba(226,102,27,0.18)] transition"
                aria-label="Dismiss chat widget"
                title="Dismiss"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}

          <div className="relative">
            {/* Visible cross button to dismiss/hide the chatbot */}
            {!isWidgetOpen && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss();
                }}
                className="absolute -top-1.5 -right-1.5 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-[#1f1b18] text-white shadow-md hover:bg-[#e2661b] transition ring-2 ring-white"
                aria-label="Close Furki chat widget"
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsWidgetOpen((current) => !current)}
              className="group relative flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[rgba(209,179,149,0.55)] bg-[rgba(255,247,239,0.42)] shadow-[0_18px_44px_rgba(35,24,19,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(35,24,19,0.28)] sm:h-[68px] sm:w-[68px] md:h-[80px] md:w-[80px] xl:h-[88px] xl:w-[88px]"
              aria-label={
                isWidgetOpen ? "Close Furki chat widget" : "Open Furki chat widget"
              }
            >
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_46%),linear-gradient(160deg,rgba(255,153,0,0.08),rgba(226,102,27,0.06))]" />
              <div className="relative flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-full bg-white sm:h-[58px] sm:w-[58px] md:h-[68px] md:w-[68px] xl:h-[76px] xl:w-[76px]">
                <Image
                  src="/assets/chatbot/furki-avatar-cutout.webp"
                  alt="Furki logo"
                  width={76}
                  height={76}
                  className="h-full w-full object-cover"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
