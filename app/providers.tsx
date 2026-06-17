// app/providers.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import CartSyncProvider from "./CartSyncProvider";
import GlobalDataProvider from "./GlobalDataProvider";

import dynamic from "next/dynamic";
// import { BibiChatWidget } from "@/components/chatbot/BibiChatWidget";
const BibiChatWidget = dynamic(
  () => import("@/components/chatbot/BibiChatWidget").then((mod) => mod.BibiChatWidget),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <GlobalDataProvider>
        <CartSyncProvider>
          {children}
          <BibiChatWidget />
        </CartSyncProvider>
      </GlobalDataProvider>
    </SessionProvider>
  );
}
