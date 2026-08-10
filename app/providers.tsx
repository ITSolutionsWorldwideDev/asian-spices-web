// app/providers.tsx

"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import CartSyncProvider from "./CartSyncProvider";
import GlobalDataProvider from "./GlobalDataProvider";
import CookieConsentBanner from "@/components/ui/CookieConsentBanner";
import { DeferredBibiChatWidget } from "@/components/chatbot/DeferredBibiChatWidget";
import { DeferredGuruChatWidget } from "@/components/chatbot/DeferredGuruChatWidget";
import SessionWatcher from "@/components/auth/SessionWatcher";

function isRecipePath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/recipes" ||
    pathname.startsWith("/recipes/") ||
    pathname.startsWith("/account/recipes");
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHealthPage = pathname?.startsWith("/healthyliving") ?? false;
  const isRecipePage = isRecipePath(pathname);

  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={60}>
      <SessionWatcher />
      <GlobalDataProvider>
        <CartSyncProvider>
          {children}
          {isHealthPage ? <DeferredGuruChatWidget /> : null}
          {isRecipePage ? <DeferredBibiChatWidget /> : null}
          <CookieConsentBanner />
        </CartSyncProvider>
      </GlobalDataProvider>
    </SessionProvider>
  );
}
