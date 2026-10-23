//  components/chatbot/FurkiChatWidget.tsx

"use client";

import Image from "next/image";
import { useState } from "react";

import { motion } from "framer-motion";

import { FurkiChatPanel } from "@/components/features/chatbot/FurkiChatPanel";

type FurkiChatWidgetProps = {
  panelClassName?: string;
  launcherClassName?: string;
};

// Below md the launcher sits above the MobileBottomNav bar (hidden from xl up);
// the panel starts below the fixed site header (~116px tall).
export function FurkiChatWidget({
  panelClassName,
  launcherClassName,
}: FurkiChatWidgetProps) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

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
          `fixed inset-x-3 bottom-[11rem] top-[7.75rem] z-40 md:inset-x-auto md:bottom-[8rem] md:right-5 md:w-[min(700px,calc(100vw-2rem))] xl:w-[720px] ${
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
        <div className="flex items-center gap-3">
          {!isWidgetOpen ? (
            <div className="rounded-full border border-[rgba(255,255,255,0.48)] bg-[rgba(255,249,242,0.5)] px-4 py-2 text-sm font-medium text-[#8a4a1f] shadow-[0_12px_28px_rgba(35,24,19,0.14)]">
              Need help?
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setIsWidgetOpen((current) => !current)}
            className="group relative flex h-[76px] w-[76px] items-center justify-center rounded-full border border-[rgba(209,179,149,0.55)] bg-[rgba(255,247,239,0.42)] shadow-[0_18px_44px_rgba(35,24,19,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(35,24,19,0.28)] md:h-[104px] md:w-[104px] xl:h-[112px] xl:w-[112px]"
            aria-label={
              isWidgetOpen ? "Close Furki chat widget" : "Open Furki chat widget"
            }
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_46%),linear-gradient(160deg,rgba(255,153,0,0.08),rgba(226,102,27,0.06))]" />
            <div className="relative flex h-[66px] w-[66px] items-center justify-center overflow-hidden rounded-full bg-white md:h-[90px] md:w-[90px] xl:h-[98px] xl:w-[98px]">
              <Image
                src="/assets/chatbot/furki-avatar-cutout.webp"
                alt="Furki logo"
                width={98}
                height={98}
                className="h-full w-full object-cover"
              />
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
