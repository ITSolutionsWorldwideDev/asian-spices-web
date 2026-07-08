// apps/web/components/ui/PayPalCaptureHandler.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useLoaderStore } from "@/store/useLoaderStore";
import { useSession } from "next-auth/react";
import CheckoutStatus from "@/components/ui/CheckoutStatus";
import RetryPaymentButton from "@/components/ui/RetryPaymentButton";

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
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [processing, setProcessing] = useState(true);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [orderMeta, setOrderMeta] = useState<{
    total: number;
    email: string;
  } | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!orderId || !token) return;
    if (hasRun.current) return;
    hasRun.current = true;

    const capture = async () => {
      try {
        show("Confirming your PayPal payment...");

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

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success) {
          const paypalMessage =
            data?.error?.details?.[0]?.description ||
            data?.error?.message ||
            data?.error;

          throw new Error(
            typeof paypalMessage === "string"
              ? paypalMessage
              : "PayPal capture failed",
          );
        }

        if (data.alreadyPaid || data.status === "COMPLETED") {
          clearCart(isLoggedIn);
        }
      } catch (err) {
        console.error("PayPal capture failed", err);
        setCaptureError(
          err instanceof Error
            ? err.message
            : "We could not confirm your PayPal payment.",
        );

        try {
          const orderRes = await fetch(`/api/get-order?orderId=${orderId}`);
          const orderData = await orderRes.json();
          if (orderData.success && orderData.order) {
            setOrderMeta({
              total: Number(orderData.order.total_amount),
              email: orderData.order.customer_email || "",
            });
          }
        } catch {
          // ignore — retry UI can still render without amount
        }
      } finally {
        hide();
        setProcessing(false);
      }
    };

    capture();
  }, [orderId, token, clearCart, isLoggedIn, status, show, hide]);

  if (processing) {
    return (
      <div className="bg-blue-50 border p-6 rounded mb-4">
        <h2 className="text-blue-700 font-semibold text-lg">
          Confirming PayPal payment...
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Please wait while we finalize your payment with PayPal.
        </p>
      </div>
    );
  }

  if (captureError) {
    return (
      <div className="bg-red-50 border p-6 rounded mb-4 space-y-4">
        <div>
          <h2 className="text-red-700 text-xl font-bold mb-2">
            PayPal payment could not be confirmed
          </h2>
          <p className="text-red-700">{captureError}</p>
        </div>
        {orderMeta && (
          <RetryPaymentButton
            orderId={orderId}
            amount={orderMeta.total}
            email={orderMeta.email}
            paymentMethod="paypal"
          />
        )}
      </div>
    );
  }

  return <CheckoutStatus orderId={orderId} />;
}
