// components/layout/account/orders/OrderActionWorkflow.tsx

"use client";

import { useState } from "react";
import { Check, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import Image from "next/image";

interface Props {
  order: any; // Pass the active order object selected by user
  onSubmit: (payload: any) => Promise<void>;
  onClose: () => void;
}

export default function OrderActionWorkflow({
  order,
  onSubmit,
  onClose,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { symbol } = useCurrencyStore();

  // Form State
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { selected: boolean; quantity: number }>
  >(
    order?.cart_items?.reduce((acc: any, item: any) => {
      acc[item.id] = { selected: false, quantity: 1 };
      return acc;
    }, {}) || {},
  );
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  // Toggle dynamic quantity state matching max available item quantity
  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], selected: !prev[itemId].selected },
    }));
  };

  const handleQuantityChange = (
    itemId: string,
    maxQty: number,
    val: number,
  ) => {
    const safeVal = Math.max(1, Math.min(val, maxQty));
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity: safeVal },
    }));
  };

  // Step Nav Handling with Validations
  const validateAndProceedToStep3 = () => {
    const hasSelection = Object.values(selectedItems).some(
      (item) => item.selected,
    );
    if (!hasSelection) {
      setValidationError("Please select at least one item to proceed.");
      return;
    }
    setValidationError("");
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!reason) {
      setValidationError("Please select a valid reason.");
      return;
    }
    if (reason === "other" && comments.trim().length < 10) {
      setValidationError(
        "Please explain your reason further (minimum 10 characters).",
      );
      return;
    }

    setValidationError("");
    setIsSubmitting(true);

    // Structure items payload for API call
    const payload = {
      orderId: order.id,
      reason,
      comments,
      items: Object.entries(selectedItems)
        .filter(([_, meta]) => meta.selected)
        .map(([id, meta]) => ({
          itemId: id,
          quantity: meta.quantity,
        })),
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setValidationError(
        "Something went wrong processing your request. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-6 max-w-2xl mx-auto">
      {/* Visual Step Indicator Tracker */}
      <div className="flex items-center justify-between pb-4 border-b">
        {[
          { num: 1, label: "Verify Order" },
          { num: 2, label: "Select Items" },
          { num: 3, label: "Provide Reason" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition ${
                step >= s.num
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step > s.num ? <Check size={14} /> : s.num}
            </div>
            <span
              className={`text-xs font-medium ${step === s.num ? "text-black" : "text-gray-400"}`}
            >
              {s.label}
            </span>
            {s.num < 3 && (
              <div className="h-px w-8 bg-gray-200 hidden sm:block mx-2" />
            )}
          </div>
        ))}
      </div>

      {validationError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={16} />
          {validationError}
        </div>
      )}

      {/* --- STEP 1: ORDER VERIFICATION VIEW --- */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold">Verify Reference Details</h3>
            <p className="text-xs text-gray-500">
              Please confirm this is the core order you want to adjust.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border text-sm">
            <div>
              <p className="text-xs text-gray-400">Order Reference</p>
              <p className="font-semibold">#{order.order_number}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Date Placed</p>
              <p className="font-semibold">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Payment Status</p>
              <span className="capitalize px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                {order.payment_status}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Charged</p>
              <p className="font-semibold text-blue-600">
                {symbol}
                {order.total_amount}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-800 transition"
            >
              Confirm & Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 2: ITEM & QUANTITY SELECTION FORM --- */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold">
              Select Items to Return / Cancel
            </h3>
            <p className="text-xs text-gray-500">
              Check each line item and match the intended target quantities.
            </p>
          </div>

          <div className="divide-y border rounded-xl overflow-hidden bg-white">
            {order.cart_items?.map((item: any) => {
              const isChecked = selectedItems[item.id]?.selected;
              const currentQty = selectedItems[item.id]?.quantity || 1;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 gap-4 transition ${isChecked ? "bg-blue-50/30" : ""}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      id={`check-${item.id}`}
                      checked={isChecked}
                      onChange={() => handleItemToggle(item.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />

                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.title || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`check-${item.id}`}
                        className="text-sm font-medium block cursor-pointer select-none"
                      >
                        {item.title}
                      </label>
                      <p className="text-xs text-gray-400">
                        Purchased: {item.quantity} unit(s)
                      </p>
                    </div>
                  </div>

                  {isChecked && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">
                        Qty:
                      </span>
                      <input
                        type="number"
                        min="1"
                        max={item.quantity}
                        value={currentQty}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            item.quantity,
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-16 px-2 py-1 text-sm border rounded-lg text-center font-medium focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={validateAndProceedToStep3}
              className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-800 transition"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: REASON INTAKE VALIDATION --- */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold">Reason for Request</h3>
            <p className="text-xs text-gray-500">
              Provide details to help process this case swiftly.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Select Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-sm border rounded-xl p-2.5 bg-white focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="">-- Choose an option --</option>
                <option value="damaged">
                  Item arrived damaged / defective
                </option>
                <option value="wrong_item">
                  Received incorrect item entirely
                </option>
                <option value="changed_mind">
                  No longer needed / Changed mind
                </option>
                <option value="other">Other reason (explain below)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Additional Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Please describe context here..."
                rows={4}
                className="w-full text-sm border rounded-xl p-3 focus:ring-1 focus:ring-blue-500 focus:outline-hidden resize-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={() => setStep(2)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Submit Action Request"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
