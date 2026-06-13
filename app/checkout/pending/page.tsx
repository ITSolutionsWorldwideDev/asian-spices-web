// apps/web/app/checkout/pending/page.tsx
import React from "react";
import CheckoutStatus from "@/components/ui/CheckoutStatus";
import Nav from "@/components/ui/Nav";

interface Props {
  searchParams: { orderId?: string };
}

export default function Page({ searchParams }: Props) {
  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>

      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">
          Processing Payment
        </h1>

        {searchParams.orderId ? (
          <CheckoutStatus orderId={searchParams.orderId} />
        ) : (
          <p>No order specified</p>
        )}
      </div>
    </div>
  );
}