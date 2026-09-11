// components/layout/account/orders/CancelItemsWorkflow.tsx

"use client";

import { useMemo, useState } from "react";
import { Check, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { MIN_ORDER_AMOUNT_EUR } from "@/lib/pricing";

interface Props {
  order: any;
  onSubmit: (payload: {
    reason: string;
    comments: string;
    items: { itemId: string; quantity: number }[];
  }) => Promise<void>;
  onClose: () => void;
}

const CANCELLATION_REASONS = [
  "Ordered by mistake",
  "Found a better price",
  "Want to change my order",
  "Ordered the wrong product",
  "Delivery takes too long",
  "Other (please specify)",
];

export default function CancelItemsWorkflow({
  order,
  onSubmit,
  onClose,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { symbol, rate } = useCurrencyStore();
  const isPaid = order?.payment_status === "paid";

  // Line items that haven't already been cancelled in a prior request.
  const activeItems = useMemo(
    () =>
      (Array.isArray(order?.cart_items) ? order.cart_items : []).filter(
        (item: any) => item && item.id != null && item.status !== "cancelled",
      ),
    [order],
  );

  // Checked by default, quantity defaults to the full purchased amount -
  // matches the old "cancel everything unless unchecked" behaviour, but the
  // quantity can now be brought down to cancel part of a line (e.g. 5 of 20).
  const [selected, setSelected] = useState<
    Record<string, { checked: boolean; quantity: number }>
  >(() =>
    Object.fromEntries(
      activeItems.map((item: any) => [
        item.id,
        { checked: true, quantity: Number(item.quantity || 1) },
      ]),
    ),
  );
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const unitPrice = (item: any) => Number(item?.price || 0);
  const lineTotal = (item: any) => unitPrice(item) * Number(item?.quantity || 0);

  const originalSubtotal = activeItems.reduce(
    (sum: number, item: any) => sum + lineTotal(item),
    0,
  );
  const selectedEntries = activeItems
    .map((item: any) => ({ item, sel: selected[item.id] }))
    .filter((e: any) => e.sel?.checked && e.sel.quantity > 0);

  const cancelledSubtotal = selectedEntries.reduce(
    (sum: number, e: any) => sum + unitPrice(e.item) * e.sel.quantity,
    0,
  );
  const remainingSubtotal = Math.max(0, originalSubtotal - cancelledSubtotal);
  const isFullCancel =
    selectedEntries.length > 0 &&
    activeItems.every(
      (item: any) =>
        selected[item.id]?.checked &&
        selected[item.id].quantity >= Number(item.quantity || 0),
    );
  const belowMinimum =
    !isFullCancel &&
    selectedEntries.length > 0 &&
    remainingSubtotal > 0 &&
    remainingSubtotal < MIN_ORDER_AMOUNT_EUR;

  const toggleItem = (item: any) => {
    setSelected((prev) => ({
      ...prev,
      [item.id]: {
        checked: !prev[item.id]?.checked,
        quantity: prev[item.id]?.quantity || Number(item.quantity || 1),
      },
    }));
  };

  const changeQuantity = (item: any, value: number) => {
    const maxQty = Number(item.quantity || 1);
    const safeQty = Math.max(1, Math.min(maxQty, Math.trunc(value) || 1));
    setSelected((prev) => ({
      ...prev,
      [item.id]: { checked: true, quantity: safeQty },
    }));
  };

  const validateAndProceedToStep3 = () => {
    if (selectedEntries.length === 0) {
      setValidationError("Please select at least one item to cancel.");
      return;
    }
    if (belowMinimum) {
      setValidationError(
        `Cancelling these item(s) would leave a subtotal of €${remainingSubtotal.toFixed(2)}, below the €${MIN_ORDER_AMOUNT_EUR.toFixed(2)} minimum. Cancel the entire order instead, or keep enough units to stay at or above €${MIN_ORDER_AMOUNT_EUR.toFixed(2)}.`,
      );
      return;
    }
    setValidationError("");
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!reason) {
      setValidationError("Please select a reason for cancellation.");
      return;
    }
    if (reason.startsWith("Other") && comments.trim().length < 5) {
      setValidationError(
        "Please enter a short comment to explain your cancellation.",
      );
      return;
    }

    setValidationError("");
    setIsSubmitting(true);

    const payload = {
      reason,
      comments,
      items: selectedEntries.map((e: any) => ({
        itemId: e.item.id,
        quantity: e.sel.quantity,
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

  const cancelledUnitCount = selectedEntries.reduce(
    (sum: number, e: any) => sum + e.sel.quantity,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between pb-4 border-b">
        {[
          { num: 1, label: "Verify Order" },
          { num: 2, label: "Select Items" },
          { num: 3, label: "Reason" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition ${
                step >= s.num
                  ? "bg-red-600 text-white"
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

      {/* --- STEP 1: ORDER VERIFICATION --- */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold">Verify Reference Details</h3>
            <p className="text-xs text-gray-500">
              Please confirm this is the order you want to adjust.
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
                {(rate * Number(order.total_amount || 0)).toFixed(2)}
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

      {/* --- STEP 2: ITEM SELECTION --- */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold">Select Items to Cancel</h3>
            <p className="text-xs text-gray-500">
              Everything is checked by default (cancels the whole order).
              Uncheck items you want to keep, or lower the quantity to cancel
              only part of a line (e.g. 5 of 20 units).
            </p>
          </div>

          <div className="divide-y border rounded-xl overflow-hidden bg-white">
            {activeItems.map((item: any) => {
              const sel = selected[item.id];
              const isChecked = !!sel?.checked;
              const maxQty = Number(item.quantity || 1);
              const cancelQty = sel?.quantity ?? maxQty;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 gap-4 transition ${isChecked ? "bg-red-50/30" : ""}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      id={`cancel-check-${item.id}`}
                      checked={isChecked}
                      onChange={() => toggleItem(item)}
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />

                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border shrink-0">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.title || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`cancel-check-${item.id}`}
                        className="text-sm font-medium block cursor-pointer select-none"
                      >
                        {item.title}
                      </label>
                      <p className="text-xs text-gray-400">
                        Purchased: {maxQty} unit(s) &middot; {symbol}
                        {(rate * lineTotal(item)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {isChecked && (
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">
                          Cancel qty:
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={maxQty}
                          value={cancelQty}
                          onChange={(e) =>
                            changeQuantity(
                              item,
                              parseInt(e.target.value, 10) || 1,
                            )
                          }
                          className="w-16 px-2 py-1 text-sm border rounded-lg text-center font-medium focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                        />
                        <span className="text-xs text-gray-400">
                          / {maxQty}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {symbol}
                        {(rate * unitPrice(item) * cancelQty).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className={`rounded-xl border p-3 text-sm flex items-center justify-between ${
              belowMinimum
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-gray-50 border-gray-200 text-gray-700"
            }`}
          >
            <span className="font-medium">Remaining order subtotal</span>
            <span className="font-bold">
              {symbol}
              {(rate * remainingSubtotal).toFixed(2)}
            </span>
          </div>

          {belowMinimum && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-medium">
              <AlertCircle size={16} className="shrink-0" />
              Cancelling these item(s) would leave a subtotal below the €
              {MIN_ORDER_AMOUNT_EUR.toFixed(2)} minimum. Cancel the entire
              order instead, or keep enough units to stay at or above €
              {MIN_ORDER_AMOUNT_EUR.toFixed(2)}.
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={validateAndProceedToStep3}
              disabled={selectedEntries.length === 0 || belowMinimum}
              className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: REASON --- */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-xl p-3 text-xs flex gap-2 items-start">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Cancellation Policy Rule:</span>{" "}
              Once cancelled, this action cannot be undone.
              {isPaid &&
                " Since this order has been paid, the cancelled amount will be refunded to your original payment method."}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Reason for Cancellation{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm bg-white focus:outline-blue-500"
              >
                <option value="">-- Choose Reason --</option>
                {CANCELLATION_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Comments {reason.startsWith("Other") ? "" : "(Optional)"}
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={
                  reason.startsWith("Other")
                    ? "Please specify your reason here..."
                    : "Add optional notes..."
                }
                className="w-full border rounded-lg p-2 text-sm h-20 focus:outline-blue-500"
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
              className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Processing..."
                : isFullCancel
                  ? "Confirm Cancellation"
                  : `Cancel ${cancelledUnitCount} Unit(s)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
