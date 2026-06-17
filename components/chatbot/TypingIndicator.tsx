"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LogoAvatar } from "@/components/chatbot/LogoAvatar";

type TypingIndicatorProps = {
  phase: "sending" | "thinking";
};

export function TypingIndicator({ phase }: TypingIndicatorProps) {
  const prefersReducedMotion = useReducedMotion();
  const helperCopy = "Bibi is cooking up a lovely answer for you, dear.";

  if (phase === "thinking") {
    if (prefersReducedMotion) {
      return (
        <div className="flex items-start gap-3 px-4 pb-3 pt-1 sm:px-6">
          <LogoAvatar size={88} rounded="rounded-full" ring />
          <div className="max-w-[min(100%,24rem)] rounded-[1.45rem] border border-[rgba(255,255,255,0.46)] bg-[rgba(255,255,255,0.72)] px-[1.15rem] py-[1rem] text-[var(--foreground)] shadow-[0_16px_34px_rgba(95,61,37,0.08)] backdrop-blur-[10px]">
            <p className="text-[15px] leading-7 text-[#4f443c]">
              {helperCopy}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start gap-3 px-4 pb-3 pt-1 sm:px-6">
        <motion.div
          animate={{
            y: [0, -4, 0],
            scale: [1, 1.025, 1],
            rotate: [0, -1.5, 1.5, 0],
          }}
          transition={{ duration: 1.9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="relative"
        >
          <div className="relative flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full shadow-[0_16px_34px_rgba(95,61,37,0.18)] ring-1 ring-[rgba(197,122,49,0.14)]">
            <video
              className="h-full w-full object-cover"
              src="/assets/chatbot/bibi-thinking-animation.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          </div>
        </motion.div>
        <div className="max-w-[min(100%,25rem)] rounded-[1.45rem] border border-[rgba(255,255,255,0.46)] bg-[rgba(255,255,255,0.72)] px-[1.15rem] py-[1rem] text-[var(--foreground)] shadow-[0_16px_34px_rgba(95,61,37,0.08)] backdrop-blur-[10px]">
          <p className="mb-3 text-[15px] leading-7 text-[#4f443c]">
            {helperCopy}
          </p>
          <div className="flex items-center gap-2.5">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="block h-3.5 w-3.5 rounded-full bg-[#c46b45]"
                animate={{ opacity: [0.35, 1, 0.35], y: [4, -6, 4], scale: [0.9, 1.08, 0.9] }}
                transition={{
                  duration: 0.82,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.12,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (prefersReducedMotion) {
    return (
      <div className="flex items-start gap-3 px-4 pb-3 pt-1 sm:px-6">
        <LogoAvatar size={88} rounded="rounded-full" ring />
        <div className="max-w-[min(100%,24rem)] rounded-[1.45rem] border border-[rgba(255,255,255,0.46)] bg-[rgba(255,255,255,0.72)] px-[1.15rem] py-[1rem] text-[var(--foreground)] shadow-[0_16px_34px_rgba(95,61,37,0.08)] backdrop-blur-[10px]">
          <p className="text-[15px] leading-7 text-[#4f443c]">
            {helperCopy}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 px-4 pb-3 pt-1 sm:px-6">
      <motion.div
        animate={{
          y: [0, -4, 0],
          scale: [1, 1.025, 1],
          rotate: [0, -1.5, 1.5, 0],
        }}
        transition={{ duration: 1.9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <LogoAvatar size={92} rounded="rounded-full" ring />
      </motion.div>
      <div className="max-w-[min(100%,25rem)] rounded-[1.45rem] border border-[rgba(255,255,255,0.46)] bg-[rgba(255,255,255,0.72)] px-[1.15rem] py-[1rem] text-[var(--foreground)] shadow-[0_16px_34px_rgba(95,61,37,0.08)] backdrop-blur-[10px]">
        <p className="mb-3 text-[15px] leading-7 text-[#4f443c]">
          {helperCopy}
        </p>
        <div className="flex items-center gap-2.5">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="block h-3.5 w-3.5 rounded-full bg-[#c46b45]"
              animate={{ opacity: [0.35, 1, 0.35], y: [4, -6, 4], scale: [0.9, 1.08, 0.9] }}
              transition={{
                duration: 0.82,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.12,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
