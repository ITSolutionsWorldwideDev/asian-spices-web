// components/layout/account/orders/OrderCard.tsx

"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Undo2,
  X,
  AlertTriangle,
} from "lucide-react";
import OrderTimeline from "@/components/ui/OrderTimeline";
import OrderSummaryReadOnly from "../../checkout/OrderSummaryReadOnly";
import OrderActionWorkflow from "./OrderActionWorkflow";
import { useCurrencyStore } from "@/store/useCurrencyStore";

export default function OrderCard({ order, isOpen, onToggle, onRefresh }: any) {
  const [downloading, setDownloading] = useState(false);
  const [isActionActive, setIsActionActive] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const isPaid = order.payment_status === "paid";
  const { symbol } = useCurrencyStore();

  const canCancelDirectly = ["pending", "confirmed", "processing"].includes(
    order.order_status?.toLowerCase(),
  );

  const handleDownloadInvoice = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloading) return;

    setDownloading(true);
    try {
      const response = await fetch(`/api/account/orders/${order.id}/invoice`);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed printing invoice metadata.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Invoice-${order.order_number}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert(`Invoice Download Error: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  // Immediate Pre-Shipment Cancellation handler
  const handleDirectCancellation = async () => {
    const confirmCancel = confirm(
      "Are you sure you want to cancel this entire order?",
    );
    if (!confirmCancel) return;

    setCancellingOrder(true);
    try {
      const response = await fetch("/api/account/orders/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          actionType: "PRE_SHIPMENT_CANCEL",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Cancellation request failed");
      }

      alert("Order cancelled successfully and quantities have been restocked.");
      if (onRefresh) onRefresh();
    } catch (error: any) {
      alert(`Cancellation Failure: ${error.message}`);
    } finally {
      setCancellingOrder(false);
    }
  };

  // Inline Client API Form Submission handler
  const handleInlineSubmitAction = async (payload: any) => {
    try {
      const response = await fetch("/api/account/orders/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          actionType: "POST_SHIPMENT_RETURN",
        }),
        // body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Action submission failed");
      }

      alert("Return request submitted successfully!");
      setIsActionActive(false);
      if (onRefresh) onRefresh();
      onToggle(); // Close the card collapse view cleanly
    } catch (error: any) {
      alert(`Submission Failure: ${error.message}`);
    }
  };

  // Handle accordion toggles cleanly while resetting dynamic sub-states
  const handleToggleClick = () => {
    setIsActionActive(false);
    onToggle();
  };

  return (
    <div className="border rounded-2xl p-5 bg-white transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">#{order.order_number}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          {isPaid && (
            <button
              onClick={handleDownloadInvoice}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs cursor-pointer border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 font-medium rounded-full transition"
            >
              {downloading ? (
                <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FileText size={13} />
              )}
              {downloading ? "Generating..." : "Invoice PDF"}
            </button>
          )}

          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              ["confirmed", "fulfilled", "delivered"].includes(
                order.order_status?.toLowerCase(),
              )
                ? "bg-green-100 text-green-600"
                : order.order_status?.toLowerCase() === "cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {order.order_status}
          </span>

          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              order.payment_status === "paid"
                ? "bg-green-100 text-green-600"
                : order.payment_status === "failed"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {order.payment_status}
          </span>
          {/* <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              order.order_status === "confirmed"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {order.order_status}
          </span>  */}
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <p className="font-bold">
          {symbol}
          {order.total_amount}
        </p>

        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-sm text-blue-600"
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isOpen ? "Hide Details" : "View Details"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 border-t pt-4 space-y-4">
          {isActionActive ? (
            /* Workflow Form Mode */
            <div className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-bold text-gray-700">
                  Return Workflow Process
                </span>
                <button
                  onClick={() => setIsActionActive(false)}
                  className="text-xs font-medium text-gray-500 hover:text-black inline-flex items-center gap-1 cursor-pointer"
                >
                  <X size={14} /> Cancel Process
                </button>
              </div>

              <OrderActionWorkflow
                order={order}
                onSubmit={handleInlineSubmitAction}
                onClose={async () => setIsActionActive(false)}
              />
            </div>
          ) : (
            /* Default Summary Viewing Mode */
            <>
              <OrderTimeline status={order.payment_status} />

              <OrderSummaryReadOnly
                items={
                  Array.isArray(order.cart_items)
                    ? order.cart_items.filter(
                        (item: any) => item && item.id !== null,
                      )
                    : []
                }
                shippingMethod={order.shipping_method || "standard"}
                subtotal={order.subtotal_amount || order.subtotal}
                tax={order.tax_amount}
                shipping={order.shipping_amount}
                total={order.total_amount}
              />

              {/* Context-Aware Action Trigger Row */}
              {order.order_status?.toLowerCase() !== "cancelled" && (
                <div className="flex justify-end pt-2">
                  {canCancelDirectly ? (
                    <button
                      onClick={handleDirectCancellation}
                      disabled={cancellingOrder}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 active:bg-red-200 border border-red-200 rounded-xl transition cursor-pointer disabled:opacity-40"
                    >
                      <AlertTriangle size={15} className="text-red-500" />
                      {cancellingOrder ? "Cancelling..." : "Cancel Entire Order"}
                    </button>
                    ) : (
                    <button
                      onClick={() => setIsActionActive(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-xl transition cursor-pointer"
                    >
                      <Undo2 size={15} className="text-gray-500" />
                      File Item Return Request
                    </button>
                  )}
                </div>
              )}
              {/* <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsActionActive(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-xl transition cursor-pointer"
                >
                  <Undo2 size={15} className="text-gray-500" />
                  File Return or Item Cancellation
                </button>
              </div> */}
            </>
          )}
        </div>
      )}
    </div>
  );
}
/* 
{isOpen && (
        <div className="mt-6 border-t pt-4 space-y-4">
          <OrderTimeline status={order.payment_status} />

          <OrderSummaryReadOnly
            items={
              Array.isArray(order.cart_items)
                ? order.cart_items.filter(
                    (item: any) => item && item.id !== null,
                  )
                : []
            }
            shippingMethod={order.shipping_method || "standard"}
            subtotal={order.subtotal_amount || order.subtotal}
            tax={order.tax_amount}
            shipping={order.shipping_amount}
            total={order.total_amount}
          />

         
          <div className="flex justify-end pt-2">
            <a
              href={`/account/orders/${order.id}/action`}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-xl transition cursor-pointer"
            >
              <Undo2 size={15} className="text-gray-500" />
              File Return or Item Cancellation
            </a>
          </div>

        </div>
      )}
*/
