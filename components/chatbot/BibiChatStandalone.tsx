//  components/chatbot/BibiChatStandalone.tsx

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

import { BibiChatWidget } from "@/components/chatbot/BibiChatWidget";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export function BibiChatStandalone() {
  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,246,236,0.95),rgba(245,239,230,0.86)_42%,rgba(234,226,215,0.74)_100%)] text-gray-900 ${plusJakartaSans.className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.46),rgba(255,255,255,0.12))]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full rounded-[2rem] border border-[rgba(255,255,255,0.42)] bg-[rgba(255,250,244,0.28)] p-4 shadow-[0_24px_80px_rgba(64,40,27,0.16)] sm:p-6">
          <div className="mb-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(154,114,86,0.82)]">
              Bibi Chatbot Frontend
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#4f443c]">
              Standalone Chat Widget Preview
            </h1>
          </div>
          <div className="relative min-h-[760px] rounded-[1.8rem] bg-[rgba(255,255,255,0.14)]">
            <BibiChatWidget
              panelClassName="absolute inset-0 z-20"
              launcherClassName="absolute bottom-6 right-6 z-30"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
