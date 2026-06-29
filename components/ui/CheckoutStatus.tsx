// apps/web/components/ui/CheckoutStatus.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import RetryPaymentButton from "@/components/ui/RetryPaymentButton";
import OrderTimeline from "@/components/ui/OrderTimeline";
import OrderSummaryReadOnly from "../layout/checkout/OrderSummaryReadOnly";

import { useLoaderStore } from "@/store/useLoaderStore";
import { useCartStore } from "@/store/useCartStore";

interface Order {
  id: string;
  order_number: string;

  subtotal_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;

  order_status: string;
  payment_status: "pending" | "paid" | "failed";
  payment_method: string;
  transaction_id: string;

  cart_items: any[];
  customer_email: string;
  shipping_method: "standard" | "express" | "overnight";
}

export default function CheckoutStatus({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const isInitialFetch = useRef(true);

  const { show, hide } = useLoaderStore();
  const { clearCart } = useCartStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchOrder = async () => {
      try {
        show("Checking payment status...");
        const res = await fetch(`/api/get-order?orderId=${orderId}`);
        const data = await res.json();

        if (data.success && data.order) {
          setOrder(data.order);

          // ✅ STOP polling when payment is done
          if (data.order.payment_status !== "pending") {
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isInitialFetch.current) {
          setLoading(false);
          hide();
        }
      }
    };

    fetchOrder();

    // ✅ only poll if still pending
    interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (order?.payment_status === "paid") {
      clearCart();
    }
  }, [order?.payment_status]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4" />
        <p className="text-gray-600 font-medium">
          Loading your order status details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <p className="text-center text-red-500 font-medium">
        Order tracking details not found.
      </p>
    );
  }

  // =========================
  // UI STATES
  // =========================

  if (order.payment_status === "paid") {
    return (
      <div className="bg-green-50 border p-6 rounded">
        <h2 className="text-green-700 text-xl font-bold">
          ✅ Payment Successful
        </h2>
        <p className="mb-4">Order #{order.order_number} has been confirmed.</p>

        <OrderSummaryReadOnly
          items={order.cart_items}
          shippingMethod={order.shipping_method}
          subtotal={order.subtotal_amount}
          tax={order.tax_amount}
          shipping={order.shipping_amount}
          total={order.total_amount}
        />
      </div>
    );
  }

  if (order.payment_status === "failed") {
    return (
      <div className="bg-red-50 border p-6 rounded">
        <h2 className="text-red-700 text-xl font-bold mb-2">
          ❌ Payment Failed
        </h2>
        <p className="text-red-700 mb-4">
          Your processing transaction authorization request was declined.
        </p>

        <OrderTimeline status={order.payment_status} />
        <div className="mt-4">
          <RetryPaymentButton
            orderId={order.id}
            amount={order.total_amount}
            email={order.customer_email || ""}
          />
        </div>
      </div>
    );
  }

  // default = pending
  return (
    <div className="bg-yellow-50 border p-6 rounded">
      <h2 className="text-yellow-700 text-xl font-bold flex items-center gap-2">
        ⏳ Awaiting Settlement Authorization
      </h2>
      {/* Payment Pending */}

      <p>
        We are waiting for confirmation from{" "}
        <strong>
          {order.payment_method === "paypal" ? "PayPal" : "Pay.nl"}
        </strong>
        .
      </p>
      <p className="text-xs mt-1 text-gray-500">
        This interface updates automatically as soon as confirmation resolves.
      </p>

      {/* <p className="text-sm mt-2 text-gray-600 mb-2">
        This page will update automatically.
      </p> */}

      <OrderSummaryReadOnly
        items={order.cart_items}
        shippingMethod={order.shipping_method}
        subtotal={order.subtotal_amount}
        tax={order.tax_amount}
        shipping={order.shipping_amount}
        total={order.total_amount}
      />

      <OrderTimeline status={order.payment_status} />
    </div>
  );
}
