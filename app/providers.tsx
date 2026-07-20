// app/providers.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import CartSyncProvider from "./CartSyncProvider";
import GlobalDataProvider from "./GlobalDataProvider";
import CookieConsentBanner from "@/components/ui/CookieConsentBanner";
import { DeferredBibiChatWidget } from "@/components/chatbot/DeferredBibiChatWidget";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <GlobalDataProvider>
        <CartSyncProvider>
          {children}
          <DeferredBibiChatWidget />
          <CookieConsentBanner />
        </CartSyncProvider>
      </GlobalDataProvider>
    </SessionProvider>
  );
}
