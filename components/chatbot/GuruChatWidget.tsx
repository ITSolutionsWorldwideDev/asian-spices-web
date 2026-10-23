//  components/chatbot/GuruChatWidget.tsx

"use client";

import Image from "next/image";
import { useState } from "react";

import { motion } from "framer-motion";

import { GuruChatPanel } from "@/components/chatbot/GuruChatPanel";

type GuruChatWidgetProps = {
  panelClassName?: string;
  launcherClassName?: string;
};

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
          `fixed inset-x-2 bottom-[calc(4.75rem+env(safe-area-inset-bottom)+0.5rem)] top-16 z-[999999] sm:inset-x-auto sm:bottom-24 sm:right-5 sm:top-20 sm:w-[min(700px,calc(100vw-2rem))] nav:bottom-6 nav:right-6 nav:top-24 xl:w-[720px] ${
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
          "fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom)+0.75rem)] right-3 z-[999990] sm:right-5 nav:bottom-6 nav:right-6"
        }
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          {!isWidgetOpen ? (
            <div className="hidden min-[420px]:block rounded-full border border-[rgba(255,255,255,0.48)] bg-[rgba(240,246,232,0.85)] backdrop-blur-xs px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-[#4f6b38] shadow-[0_12px_28px_rgba(35,24,19,0.14)]">
              Hey, I can help you
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setIsWidgetOpen((current) => !current)}
            className="group relative flex h-16 w-16 sm:h-20 sm:w-20 nav:h-[104px] nav:w-[104px] items-center justify-center rounded-full border border-[rgba(122,158,84,0.4)] bg-[rgba(240,246,232,0.85)] shadow-[0_12px_32px_rgba(35,24,19,0.2)] backdrop-blur-xs transition hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(35,24,19,0.28)]"
            aria-label={
              isWidgetOpen ? "Close Guru chat widget" : "Open Guru chat widget"
            }
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_46%),linear-gradient(160deg,rgba(122,158,84,0.12),rgba(255,179,71,0.08))]" />
            <div className="relative flex h-14 w-14 sm:h-[72px] sm:w-[72px] nav:h-[90px] nav:w-[90px] items-center justify-center overflow-hidden rounded-full">
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
