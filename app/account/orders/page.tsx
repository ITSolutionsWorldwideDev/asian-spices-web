// app/account/orders/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import OrderCard from "@/components/layout/account/orders/OrderCard";
import { useLoaderStore } from "@/store/useLoaderStore";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationMeta, setPaginationMeta] = useState({
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { show, hide } = useLoaderStore();
  const recordsPerPage = 5;

  const loadOrders = useCallback(async () => {
    try {
      show("Loading Orders...");

      try {
        const pendingOrderId = sessionStorage.getItem("pendingCheckoutOrderId");
        if (pendingOrderId) {
          sessionStorage.removeItem("pendingCheckoutOrderId");
          await fetch("/api/paynl/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: pendingOrderId,
              statusAction: "cancelled",
            }),
          });
        }
      } catch (cancelErr) {
        console.error("Failed to mark abandoned payment as failed:", cancelErr);
      }

      const res = await fetch(
        `/api/account/orders?page=${currentPage}&limit=${recordsPerPage}`,
        { cache: "no-store" },
      );
      const data = await res.json();

      if (!data?.orders) {
        setOrders([]);
        return;
      }

      setOrders(data.orders);
      if (data.pagination) {
        setPaginationMeta({
          totalPages: data.pagination.totalPages,
          totalRecords: data.pagination.totalRecords,
          hasNextPage: data.pagination.hasNextPage,
          hasPrevPage: data.pagination.hasPrevPage,
        });
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]);
    } finally {
      hide();
    }
  }, [currentPage, show, hide]);

  useEffect(() => {
    loadOrders();

    const handlePageShow = () => {
      hide();
      loadOrders();
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [loadOrders, hide]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-lg sm:text-xl font-bold">Order History</h2>
        <span className="text-xs sm:text-sm text-gray-500 font-medium">
          Total Orders: {paginationMeta.totalRecords}
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm">No orders found.</p>
      ) : (
        <div className="grid gap-4 min-w-0">
          {orders.map((order: any) => (
            <div key={order.id} className="min-w-0">
              <OrderCard
                order={order}
                isOpen={expandedId === order.id}
                onToggle={() => {
                  setExpandedId(expandedId === order.id ? null : order.id);
                }}
                onRefresh={loadOrders}
              />
            </div>
          ))}
        </div>
      )}

      {paginationMeta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!paginationMeta.hasPrevPage}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
          >
            &larr;Previous
          </button>
          {/* ← */}

          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {paginationMeta.totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, paginationMeta.totalPages),
              )
            }
            disabled={!paginationMeta.hasNextPage}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
          >
            Next &rarr;
          </button>
          {/* → */}
        </div>
      )}
    </div>
  );
}
