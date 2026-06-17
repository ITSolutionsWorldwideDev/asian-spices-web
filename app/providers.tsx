// app/providers.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import CartSyncProvider from "./CartSyncProvider";
import GlobalDataProvider from "./GlobalDataProvider";
import { BibiChatWidget } from "@/components/chatbot/BibiChatWidget";

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
