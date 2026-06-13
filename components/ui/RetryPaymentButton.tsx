// apps/web/components/ui/RetryPaymentButton.tsx

"use client";

import { useLoaderStore } from "@/store/useLoaderStore";
import { useState } from "react";

export default function RetryPaymentButton({
  orderId,
  amount,
  email,
}: {
  orderId: string;
  amount: number;
  email: string;
}) {
  const [loading, setLoading] = useState(false);
  const { show, hide } = useLoaderStore();
  const [apiError, setApiError] = useState<string | null>(null);

  const retryPayment = async () => {
    try {
      setLoading(true);
      show("Setting up for Payment...");

      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
          customerEmail: email,
          paymentMethod: "paynl",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw {
            message: "Failed to initiate payment. Please try again.",
            code: "PAYMENT_FAILED",
          };
      }

      window.location.href = data.redirectUrl;
    } catch (err: any) {
      console.error(err);

      if (err.code === "PAYMENT_FAILED") {
        setApiError("Failed to initiate payment. Please try again.");
      }
    } finally {
      setLoading(false);
      hide();
    }
  };

  return (
    <button
      onClick={retryPayment}
      disabled={loading}
      className="bg-black text-white px-4 py-2 rounded mt-4"
    >
      {loading ? "Redirecting..." : "Retry Payment"}
    </button>
  );
}