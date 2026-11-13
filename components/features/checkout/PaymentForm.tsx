// components/layout/checkout/PaymentForm.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";

interface Props {
  placeOrder: (method: "paynl" | "paypal") => void;
  disabled: boolean;
  minOrderMessage?: string;
}

const METHODS = [
  {
    id: "paynl" as const,
    label: "iDEAL & Wero",
    description: "Pay securely via iDEAL and other methods",
    logo: {
      src: "/assets/payment/ideal-wero.svg",
      alt: "iDEAL & Wero",
      width: 100,
      height: 32,
    },
  },
  {
    id: "paypal" as const,
    label: "PayPal",
    description: "Pay with your PayPal account",
    logo: {
      src: "/assets/payment/paypal.svg",
      alt: "PayPal",
      width: 90,
      height: 24,
    },
  },
];

export default function PaymentForm({
  placeOrder,
  disabled,
  minOrderMessage,
}: Props) {
  const [method, setMethod] = useState<"paynl" | "paypal">("paynl");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const canContinue = !disabled && agreedToTerms;

  return (
    <div className="notranslate flex justify-center" translate="no">
      <div className="w-full bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Payment Method</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          You&apos;ll enter your payment details in the final step.
        </p>

        {minOrderMessage ? (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-amber-800">
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
                className={`w-full flex items-center justify-between gap-2.5 sm:gap-4 border rounded-xl p-3 sm:p-4 text-left transition ${
                  selected
                    ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
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
                  <div className="min-w-0 flex-1">
                    <span className="block font-semibold text-sm sm:text-base text-gray-900 leading-tight">
                      {option.label}
                    </span>
                    <span className="block text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-tight truncate">
                      {option.description}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end h-7 sm:h-8 max-w-[75px] sm:max-w-[100px]">
                  <Image
                    src={option.logo.src}
                    alt={option.logo.alt}
                    width={option.logo.width}
                    height={option.logo.height}
                    className="object-contain h-full w-auto max-h-7 sm:max-h-8"
                    unoptimized
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mt-4 bg-gray-100 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
          <Lock size={15} className="shrink-0" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        <label className="mt-4 sm:mt-5 flex cursor-pointer items-start gap-2.5 sm:gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-orange-500"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-orange-600 underline hover:text-orange-700"
              onClick={(e) => e.stopPropagation()}
            >
              Terms &amp; Conditions
            </Link>{" "}
            and the{" "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-orange-600 underline hover:text-orange-700"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        {!agreedToTerms && !disabled ? (
          <p className="mt-2 text-xs text-gray-500">
            Please agree to the Terms &amp; Conditions and Privacy Policy to
            continue.
          </p>
        ) : null}

        <button
          type="button"
          disabled={!canContinue}
          className={`w-full mt-5 sm:mt-6 px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold text-white flex items-center justify-center gap-2 transition ${
            !canContinue
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 shadow-sm"
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
