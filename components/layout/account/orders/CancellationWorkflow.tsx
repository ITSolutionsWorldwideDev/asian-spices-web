// components/layout/account/orders/CancellationWorkflow.tsx

"use client";

import { useState } from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";

interface CancellationWorkflowProps {
  order: any;
  onSubmit: (payload: { reason: string; comments: string }) => Promise<void>;
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

export default function CancellationWorkflow({
  order,
  onSubmit,
  onClose,
}: CancellationWorkflowProps) {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isPaid = order.payment_status === "paid";

  const handleConfirm = async () => {
    if (!reason) {
      alert("Please select a reason for cancellation.");
      return;
    }
    if (reason.startsWith("Other") && comments.trim().length < 5) {
      alert("Please enter a short comment to explain your cancellation.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ reason, comments });
    } catch (err) {
      // Handled upstream
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-2">
      <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-xl p-3 text-xs flex gap-2 items-start">
        <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Cancellation Policy Rule:</span> Once cancelled, this action cannot be undone.
          {isPaid && " Since this order has been Paid, your transaction will be refunded immediately back to your original payment account."}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Reason for Cancellation <span className="text-red-500">*</span>
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
            Comments (Optional)
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={reason.startsWith("Other") ? "Please specify your reason here..." : "Add optional notes..."}
            className="w-full border rounded-lg p-2 text-sm h-20 focus:outline-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="px-4 py-2 text-xs font-semibold border rounded-lg hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={submitting}
          className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition inline-flex items-center gap-1.5"
        >
          {submitting ? "Processing..." : "Confirm Cancellation"}
        </button>
      </div>
    </div>
  );
}