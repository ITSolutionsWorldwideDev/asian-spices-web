//  components/chatbot/GuruChatWidget.tsx

"use client";

import Image from "next/image";
import { useState } from "react";

import { motion } from "framer-motion";

import { GuruChatPanel } from "@/components/features/chatbot/GuruChatPanel";

type GuruChatWidgetProps = {
  panelClassName?: string;
  launcherClassName?: string;
};

// Below md the launcher sits above the MobileBottomNav bar;
// the panel starts below the fixed site header (~116px tall).
export function GuruChatWidget({
  panelClassName,
  launcherClassName,
}: GuruChatWidgetProps) {
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
          `fixed inset-x-2 bottom-[10.5rem] top-[6.5rem] z-40 sm:inset-x-3 md:inset-x-auto md:bottom-[8rem] md:right-5 md:w-[min(700px,calc(100vw-2rem))] xl:w-[720px] ${
            isWidgetOpen
              ? "pointer-events-auto visible"
              : "pointer-events-none invisible"
          }`
        }
      >
        <GuruChatPanel onClose={() => setIsWidgetOpen(false)} />
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
        <div className="flex items-center gap-2 sm:gap-3">
          {!isWidgetOpen ? (
            <div className="rounded-full border border-[rgba(255,255,255,0.48)] bg-[rgba(240,246,232,0.6)] px-2.5 py-1 text-[11px] sm:px-4 sm:py-2 sm:text-sm font-medium text-[#4f6b38] shadow-[0_12px_28px_rgba(35,24,19,0.14)]">
              Hey, I can help you
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setIsWidgetOpen((current) => !current)}
            className="group relative flex h-[64px] w-[64px] items-center justify-center rounded-full border border-[rgba(122,158,84,0.4)] bg-[rgba(240,246,232,0.5)] shadow-[0_18px_44px_rgba(35,24,19,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(35,24,19,0.28)] sm:h-[76px] sm:w-[76px] md:h-[104px] md:w-[104px] xl:h-[112px] xl:w-[112px]"
            aria-label={
              isWidgetOpen ? "Close Guru chat widget" : "Open Guru chat widget"
            }
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_46%),linear-gradient(160deg,rgba(122,158,84,0.12),rgba(255,179,71,0.08))]" />
            <div className="relative flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-full sm:h-[66px] sm:w-[66px] md:h-[90px] md:w-[90px] xl:h-[98px] xl:w-[98px]">
              <Image
                src="/assets/chatbot/guru-avatar.jpeg"
                alt="Guru logo"
                width={98}
                height={98}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
