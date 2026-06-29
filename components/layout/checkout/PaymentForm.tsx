// components/layout/checkout/PaymentForm.tsx

"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

interface Props {
  placeOrder: (method: "paynl" | "paypal") => void;
  disabled: boolean;
}

export default function PaymentForm({ placeOrder, disabled }: Props) {
  const [method, setMethod] = useState<"paynl" | "paypal">("paynl");

  return (
    <div className="flex justify-center">
      <div className="w-full bg-white rounded-xl border border-[#E5E7EB] p-8">
        <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

        <div className="space-y-4">
          {/* Pay.nl */}
          <div
            onClick={() => setMethod("paynl")}
            className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer ${
              method === "paynl"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200"
            }`}
          >
            <input type="radio" checked={method === "paynl"} readOnly />
            <span>Pay with Pay.nl</span>
          </div>

          {/* PayPal */}
          <div
            onClick={() => setMethod("paypal")}
            className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer ${
              method === "paypal"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200"
            }`}
          >
            <input type="radio" checked={method === "paypal"} readOnly />
            <span>Pay with PayPal</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
          <Lock size={16} />
          Your payment information is encrypted and secure
        </div>

        <button
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
