// app/checkout/cancel/page.tsx

import React from "react";
import Nav from "@/components/layout/Nav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { pool } from "@/core/db";
import RetryPaymentButton from "@/components/features/checkout/RetryPaymentButton";

interface Props {
  searchParams: Promise<{ orderId?: string; token?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params?.orderId;
  const token = params?.token;

  let orderMeta: {
    total: number;
    email: string;
    paymentMethod: "paynl" | "paypal";
    alreadyPaid: boolean;
  } | null = null;

  if (orderId) {
    try {
      const orderRes = await pool.query(
        `UPDATE store_orders
         SET payment_status = CASE WHEN payment_status = 'paid' THEN 'paid' ELSE 'failed' END,
             updated_at = CASE WHEN payment_status = 'paid' THEN updated_at ELSE NOW() END
         WHERE id = $1
         RETURNING total_amount, customer_email, payment_method, payment_status`,
        [orderId],
      );

      if (orderRes.rows.length > 0) {
        const row = orderRes.rows[0];
        orderMeta = {
          total: Number(row.total_amount || 0),
          email: row.customer_email || "",
          paymentMethod: row.payment_method === "paypal" ? "paypal" : "paynl",
          alreadyPaid: row.payment_status === "paid",
        };
      }
    } catch (err) {
      console.error("Failed to mark cancelled checkout order:", err);
    }
  }

  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="mb-10">
          <Link href="/cart">
            <p className="text-sm text-gray-500 flex items-center cursor-pointer">
              <ArrowLeft className="size-[15]" /> Back to Cart
            </p>
          </Link>

          {token && (
            <p className="text-sm text-gray-500 mt-2">
              Payment was cancelled on PayPal.
            </p>
          )}

          <h1 className="text-2xl font-semibold mt-2">Payment Cancelled</h1>
        </div>

        <div className="bg-red-50 border p-6 rounded">
          <h2 className="text-red-700 text-xl font-bold">
            ❌ Payment was cancelled
          </h2>

          <p className="mt-2">
            Your order was not completed. You can try again anytime.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            {orderId && orderMeta && !orderMeta.alreadyPaid && (
              <RetryPaymentButton
                orderId={orderId}
                amount={orderMeta.total}
                email={orderMeta.email}
                paymentMethod={orderMeta.paymentMethod}
              />
            )}

            <Link
              href="/checkout"
              className="text-blue-600 underline mt-4 inline-block"
            >
              Return to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

