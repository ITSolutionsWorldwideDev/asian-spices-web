// components/layout/checkout/PaymentForm.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";

interface Props {
  placeOrder: (method: "paynl" | "paypal") => void;
  disabled: boolean;
  minOrderMessage?: string;
}

const METHODS = [
  {
    id: "paynl" as const,
    label: "Pay.nl",
    description: "Pay securely via iDEAL and other methods",
    logo: {
      src: "/assets/payment/paynl.svg",
      alt: "Pay.nl",
      width: 48,
      height: 48,
    },
  },
  // {
  //   id: "paypal" as const,
  //   label: "PayPal",
  //   description: "Pay with your PayPal account",
  //   logo: {
  //     src: "/assets/payment/paypal.svg",
  //     alt: "PayPal",
  //     width: 90,
  //     height: 24,
  //   },
  // },
];

export default function PaymentForm({
  placeOrder,
  disabled,
  minOrderMessage,
}: Props) {
  const [method, setMethod] = useState<"paynl" | "paypal">("paynl");

  return (
    <div className="flex justify-center">
      <div className="w-full bg-white rounded-xl border border-[#E5E7EB] p-8">
        <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
        <p className="text-sm text-gray-500 mb-6">
          You&apos;ll enter your payment details in the final step.
        </p>

        {minOrderMessage ? (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {minOrderMessage}
          </div>
        ) : null}

        <div className="space-y-3">
          {METHODS.map((option) => {
            const selected = method === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setMethod(option.id)}
                className={`w-full flex items-center justify-between gap-4 border rounded-xl px-4 py-4 text-left transition ${
                  selected
                    ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected
                        ? "border-orange-500"
                        : "border-gray-300"
                    }`}
                    aria-hidden
                  >
                    {selected ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    ) : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-gray-900">
                      {option.label}
                    </span>
                    <span className="block text-xs text-gray-500 truncate">
                      {option.description}
                    </span>
                  </span>
                </span>

                <span className="shrink-0 flex items-center justify-end h-10">
                  <Image
                    src={option.logo.src}
                    alt={option.logo.alt}
                    width={option.logo.width}
                    height={option.logo.height}
                    className="object-contain h-full w-auto"
                    unoptimized
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mt-4 bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
          <Lock size={16} />
          Your payment information is encrypted and secure
        </div>

        <button
          type="button"
          disabled={disabled}
          className={`w-full mt-6 px-6 py-3 rounded-lg text-white flex items-center justify-center gap-2 transition
          ${
            disabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
          onClick={() => placeOrder(method)}
        >
          <Lock size={16} />
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
