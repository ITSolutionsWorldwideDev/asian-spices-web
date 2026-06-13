// apps/web/components/layout/checkout/PaymentForm.tsx

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

/* "use client";

import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";

type CheckoutData = {
  cardNumber: string;
  expiry: string;
};

interface Props {
  data: CheckoutData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  placeOrder: () => void;
}

export default function PaymentForm({ data, setFormData, placeOrder }: Props) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [sameAddress, setSameAddress] = useState(true);

  const [method, setMethod] = useState<"paynl" | "paypal">("paynl");

  const handleChange = (field: keyof CheckoutData, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="  flex justify-center ">
      <div className="w-full  bg-white rounded-xl border border-[#E5E7EB] p-8">
        <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

        <div className="space-y-4">
 
          <div
            onClick={() => setPaymentMethod("card")}
            className={`flex items-center gap-3 border border-[#E5E7EB] rounded-xl p-4 cursor-pointer ${
              paymentMethod === "card"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            <CreditCard size={18} />
            <span>Credit / Debit Card</span>
          </div>

   
          <div
            onClick={() => setPaymentMethod("paypal")}
            className={`flex items-center gap-3 border border-[#E5E7EB] rounded-xl p-4 cursor-pointer ${
              paymentMethod === "paypal"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
            />
            <span className="w-5 h-5 bg-blue-600 rounded"></span>
            <span>PayPal</span>
          </div>
        </div>

        {paymentMethod === "card" && (
          <div className="mt-8 space-y-5">
   
            <div>
              <label className="block text-sm font-medium mb-1">
                Card Number<span className="text-red-700 ms-1">*</span>
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full bg-[#F3F3F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>


            <div>
              <label className="block text-sm font-medium mb-1">
                Cardholder Name<span className="text-red-700 ms-1">*</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-[#F3F3F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

    
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Expiry Date<span className="text-red-700 ms-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-[#F3F3F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CVV<span className="text-red-700 ms-1">*</span></label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full bg-[#F3F3F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <hr className="my-6 text-[#F3F3F5] " />

     
            <h3 className="text-lg font-medium">Billing Address</h3>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sameAddress}
                onChange={() => setSameAddress(!sameAddress)}
              />
              <span className="text-sm">Same as shipping address</span>
            </div>

     
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
              <Lock size={16} />
              Your payment information is encrypted and secure
            </div>
          </div>
        )}

        <button className="bg-orange-500 text-white mt-4 rounded-lg px-6 py-3 w-full hover:bg-orange-600 flex items-center justify-center gap-2 transition" onClick={() => placeOrder(method)}>
            <Lock size={16} />
            Place Order
          </button>
      </div>
    </div>
  );
} */

/* "use client";

import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";

interface ContactFormProps {
  setStep: (step: "contact" | "shipping" | "payment") => void;
}
export default function CheckoutPage({ data, setFormData, setStep,placeOrder }: any) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [sameAddress, setSameAddress] = useState(true);

  return (
    <div className="  flex items-center justify-center ">
      <div className="w-full  bg-white rounded-2xl shadow p-8">
 
        <h2 className="text-xl font-semibold mb-6">Payment Method</h2>


        <div className="space-y-4">
 
          <div
            onClick={() => setPaymentMethod("card")}
            className={`flex items-center gap-3 border border-[#E5E7EB] rounded-xl p-4 cursor-pointer ${
              paymentMethod === "card"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            <CreditCard size={18} />
            <span>Credit / Debit Card</span>
          </div>

   
          <div
            onClick={() => setPaymentMethod("paypal")}
            className={`flex items-center gap-3 border border-[#E5E7EB] rounded-xl p-4 cursor-pointer ${
              paymentMethod === "paypal"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
            />
            <span className="w-5 h-5 bg-blue-600 rounded"></span>
            <span>PayPal</span>
          </div>
        </div>


        {paymentMethod === "card" && (
          <div className="mt-8 space-y-5">
   
            <div>
              <label className="block text-sm font-medium mb-1">
                Card Number *
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full bg-[#F3F3F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>


            <div>
              <label className="block text-sm font-medium mb-1">
                Cardholder Name *
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-[#F3F3F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

    
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-[#F3F3F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CVV *</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full bg-[#F3F3F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <hr className="my-6 text-[#F3F3F5] " />

     
            <h3 className="text-lg font-medium">Billing Address</h3>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sameAddress}
                onChange={() => setSameAddress(!sameAddress)}
              />
              <span className="text-sm">Same as shipping address</span>
            </div>

     
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
              <Lock size={16} />
              Your payment information is encrypted and secure
            </div>
          </div>
        )}

   
        <div className="flex flex-col sm:flex-row mt-8 gap-4 sm:gap-8">
          <button
            className="border border-[#E5E7EB] rounded-lg px-6 py-3 w-full hover:bg-gray-100 transition"
            onClick={() => setStep("shipping")}
          >
            Back
          </button>

          <button className="bg-orange-500 text-white rounded-lg px-6 py-3 w-full hover:bg-orange-600 flex items-center justify-center gap-2 transition" onClick={placeOrder}>
            <Lock size={16} />
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
} */
