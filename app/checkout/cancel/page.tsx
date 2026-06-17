// app/checkout/cancel/page.tsx

import React from "react";
import Nav from "@/components/ui/Nav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  searchParams: { orderId?: string; token?: string };
}

export default function Page({ searchParams }: Props) {
  const token = searchParams?.token;

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

          <Link
            href="/checkout"
            className="text-blue-600 underline mt-4 inline-block"
          >
            Return to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
