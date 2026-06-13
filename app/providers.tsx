// apps/web/app/providers.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import CartSyncProvider from "./CartSyncProvider";
import GlobalDataProvider from "./GlobalDataProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <GlobalDataProvider>
        <CartSyncProvider>{children}</CartSyncProvider>
      </GlobalDataProvider>
    </SessionProvider>
  );
}
