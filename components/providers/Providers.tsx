// app/providers.tsx

"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import CartSyncProvider from "./CartSyncProvider";
import GlobalDataProvider from "./GlobalDataProvider";
import CookieConsentBanner from "@/components/ui/CookieConsentBanner";
import { DeferredBibiChatWidget } from "@/components/features/chatbot/DeferredBibiChatWidget";
import { DeferredGuruChatWidget } from "@/components/features/chatbot/DeferredGuruChatWidget";
import { DeferredGenieChatWidget } from "@/components/features/chatbot/DeferredGenieChatWidget";
import { DeferredFurkiChatWidget } from "@/components/features/chatbot/DeferredFurkiChatWidget";
import SessionWatcher from "@/components/features/auth/SessionWatcher";

function isRecipePath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/recipes" ||
    pathname.startsWith("/recipes/") ||
    pathname.startsWith("/account/recipes");
}

// Pre-launch gate pages, no chat there.
function isGatePath(pathname: string | null) {
  if (!pathname) return false;
  return pathname.startsWith("/site-access") || pathname.startsWith("/coming-soon");
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHealthPage = pathname?.startsWith("/healthyliving") ?? false;
  const isRecipePage = isRecipePath(pathname);
  const isPartnerRegistrationPage =
    pathname?.startsWith("/partner-registration") ?? false;
  // Furki (customer support) covers every page that has no dedicated bot.
  const isFurkiPage =
    !isHealthPage && !isRecipePage && !isPartnerRegistrationPage && !isGatePath(pathname);

  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={60}>
      <SessionWatcher />
      <GlobalDataProvider>
        <CartSyncProvider>
          {children}
          {isHealthPage ? <DeferredGuruChatWidget /> : null}
          {isRecipePage ? <DeferredBibiChatWidget /> : null}
          {isPartnerRegistrationPage ? <DeferredGenieChatWidget /> : null}
          {isFurkiPage ? <DeferredFurkiChatWidget /> : null}
          <CookieConsentBanner />
        </CartSyncProvider>
      </GlobalDataProvider>
    </SessionProvider>
  );
}
