// app/checkout/success/page.tsx

import Nav from "@/components/ui/Nav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CheckoutStatus from "@/components/ui/CheckoutStatus";
import PayPalCaptureHandler from "@/components/ui/PayPalCaptureHandler";
import PaynlReturnHandler from "@/components/ui/PaynlReturnHandler";

interface Props {
  searchParams: Promise<{
    orderId?: string;
    token?: string;
    id?: string;
    statusAction?: string;
  }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const { orderId, token, id, statusAction } = params;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black">
        <Nav />
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="mb-10">
          <Link
            href="/cart"
            className="text-sm text-gray-500 hover:text-black flex items-center gap-2 inline-flex transition"
          >
            <p className="text-sm text-gray-500 flex items-center cursor-pointer">
              <ArrowLeft className="size-[15]" /> Back to Cart
            </p>
          </Link>
          <h1 className="text-3xl font-bold mt-3 tracking-tight">
            Order Processing Portal
          </h1>
        </div>

        {!orderId ? (
          <div className="p-6 border rounded-lg bg-gray-50 text-center text-gray-600">
            No active order identifier reference context provided.
          </div>
        ) : (
        <div className="space-y-6">
            {token && <PayPalCaptureHandler orderId={orderId} token={token} />}

            {statusAction ? (
              <PaynlReturnHandler
                orderId={orderId}
                transactionId={id}
                statusAction={statusAction}
              />
            ) : (
              <CheckoutStatus orderId={orderId} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}