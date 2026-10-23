// app/CartSyncProvider.tsx

"use client";

import { useCartSync } from "@/store/useCartSync";

export default function CartSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useCartSync(); // ✅ safe here

  return <>{children}</>;
}