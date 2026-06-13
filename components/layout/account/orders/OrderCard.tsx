// components/account/orders/OrderCard.tsx

"use client";

import { useState } from "react";
import { Eye, ChevronDown, ChevronUp, FileText, Download } from "lucide-react";
import OrderTimeline from "@/components/ui/OrderTimeline";
import OrderSummaryReadOnly from "../../checkout/OrderSummaryReadOnly";
import { useCurrencyStore } from "@/store/useCurrencyStore";

export default function OrderCard({ order, isOpen, onToggle }: any) {
  const [downloading, setDownloading] = useState(false);
  const isPaid = order.payment_status === "paid";
    const { symbol, rate } = useCurrencyStore();

  const handleDownloadInvoice = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop parent details chevron toggle triggers
    if (downloading) return;

    setDownloading(true);
    try {
      // Direct asset fetch request to endpoint
      const response = await fetch(`/api/account/orders/${order.id}/invoice`);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed printing invoice metadata.");
      }

      // Convert chunk buffers into clean native browser binary downloads
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Invoice-${order.order_number}.pdf`;

      document.body.appendChild(link);
      link.click();

      // Clean memory spaces
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert(`Invoice Download Error: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="border rounded-2xl p-5 bg-white transition-all duration-300 ease-in-out">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">#{order.order_number}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          {/* 📄 NEW: Conditionally served explicit Download Invoice Action */}
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
          {/* Order status */}
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              order.order_status === "confirmed"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {order.order_status}
          </span>

          {/* Payment status */}
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
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-3 flex justify-between items-center">
        <p className="font-bold">{symbol}{order.total_amount}</p>

        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-sm text-blue-600"
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isOpen ? "Hide Details" : "View Details"}
        </button>
      </div>

      {/* 🔥 EXPANDED CONTENT */}
      {isOpen && (
        <div className="mt-6 border-t pt-4 space-y-4">
          <OrderTimeline status={order.payment_status} />

          <OrderSummaryReadOnly
            // 🚀 Clean out null aggregations safely before passing array pointers downstream
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
        </div>
      )}
    </div>
  );
}
