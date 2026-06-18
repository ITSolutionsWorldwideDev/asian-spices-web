// apps/web/components/ui/PaynlReturnHandler.tsx

"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import CheckoutStatus from "./CheckoutStatus";
import { useSession } from "next-auth/react";

export default function PaynlReturnHandler({
  orderId,
  transactionId,
  statusAction,
  //   onDone,
}: {
  orderId: string;
  transactionId?: string;
  statusAction: string;
  //   onDone?: () => void;
}) {

  const [processing, setProcessing] = useState(true);
  const clearCart = useCartStore((s) => s.clearCart);
  const { status } = useSession(); // 🚀 Extract auth status
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    let called = false;

    const confirmPayment = async () => {
      if (called) return;
      called = true;

      try {
        const res = await fetch("/api/paynl/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, transactionId, statusAction }),
        });

        if (res.ok && statusAction?.toLowerCase() === "paid") {
          // clearCart(); // Clear local storage only on explicit success
          clearCart(isLoggedIn);
        }
      } catch (err) {
        console.error("Pay.nl confirm failed:", err);
      } finally {
        setProcessing(false);
      }
    };

    confirmPayment();
  }, [orderId, transactionId, statusAction,isLoggedIn]);

  if (processing) {
    return (
      <div className="bg-blue-50 border p-6 rounded mb-4">
        <h2 className="text-blue-700 font-semibold text-lg">
          🔄 Processing Payment...
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Please wait while we confirm your payment.
        </p>
      </div>
    );
  }

  return <CheckoutStatus orderId={orderId} />;
}
