//  components/chatbot/BibiChatWidget.tsx

"use client";

import Image from "next/image";
import { useState } from "react";

import { motion } from "framer-motion";

import { ChatPanel } from "@/components/chatbot/ChatPanel";

type BibiChatWidgetProps = {
  panelClassName?: string;
  launcherClassName?: string;
};

export function BibiChatWidget({
  panelClassName,
  launcherClassName,
}: BibiChatWidgetProps) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  return (
    <>
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
          `fixed inset-x-3 bottom-[7.25rem] top-24 z-40 sm:inset-x-auto sm:bottom-[8rem] sm:right-5 sm:top-24 sm:w-[min(720px,calc(100vw-2rem))] xl:w-[760px] ${
            isWidgetOpen
              ? "pointer-events-auto visible"
              : "pointer-events-none invisible"
          }`
        }
      >
        <ChatPanel onClose={() => setIsWidgetOpen(false)} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
        className={
          launcherClassName ??
          "fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6"
        }
      >
        <div className="flex items-center gap-3">
          {!isWidgetOpen ? (
            <div className="rounded-full border border-[rgba(255,255,255,0.48)] bg-[rgba(255,249,242,0.5)] px-4 py-2 text-sm font-medium text-[#6b5548] shadow-[0_12px_28px_rgba(35,24,19,0.14)]">
              Hey, I can help you
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setIsWidgetOpen((current) => !current)}
            className="group relative flex h-[104px] w-[104px] items-center justify-center rounded-full border border-[rgba(209,179,149,0.55)] bg-[rgba(255,247,239,0.42)] shadow-[0_18px_44px_rgba(35,24,19,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(35,24,19,0.28)] sm:h-[112px] sm:w-[112px]"
            aria-label={
              isWidgetOpen ? "Close Bibi chat widget" : "Open Bibi chat widget"
            }
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_46%),linear-gradient(160deg,rgba(255,153,0,0.08),rgba(255,77,77,0.06))]" />
            <div className="relative flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-full sm:h-[98px] sm:w-[98px]">
              <Image
                src="/assets/chatbot/bibi-logo-widget-clean.png"
                alt="Bibi logo"
                width={98}
                height={98}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </button>
        </div>
      </motion.div>
    </>
  );
}
