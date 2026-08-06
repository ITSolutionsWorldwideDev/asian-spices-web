// app/providers.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import CartSyncProvider from "./CartSyncProvider";
import GlobalDataProvider from "./GlobalDataProvider";
import CookieConsentBanner from "@/components/ui/CookieConsentBanner";
import { DeferredBibiChatWidget } from "@/components/chatbot/DeferredBibiChatWidget";
import SessionWatcher from "@/components/auth/SessionWatcher";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={60}>
      <SessionWatcher />
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
