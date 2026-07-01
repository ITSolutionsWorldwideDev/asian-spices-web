// apps/web/components/ui/PayPalCaptureHandler.tsx

"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useLoaderStore } from "@/store/useLoaderStore";
import { useSession } from "next-auth/react";

export default function PayPalCaptureHandler({
  orderId,
  token,
}: {
  orderId: string;
  token: string;
}) {
  const clearCart = useCartStore((s) => s.clearCart);
  const hasRun = useRef(false);
  const { show, hide } = useLoaderStore();
  
  const { status } = useSession(); // 🚀 Get session status
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    if (status === "loading") return;
    if (!orderId || !token) return;
    if (hasRun.current) return;

    const capture = async () => {
      try {
        hasRun.current = true;

        show("Setting up for Payment...");

        const res = await fetch("/api/paypal/capture", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paypalOrderId: token,
            orderId,
          }),
        });

        if (!res.ok) {
          throw new Error("PayPal capture failed");
        }

        clearCart(isLoggedIn);
      } catch (err) {
        console.error("PayPal capture failed", err);
      } finally {
        hide(); 
      }
    };

    capture();
  }, [orderId, token, clearCart, isLoggedIn]);

  return null;
}
