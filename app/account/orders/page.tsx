// app/account/orders/page.tsx

"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/layout/account/orders/OrderCard";
import OrderDrawer from "@/components/layout/account/orders/OrderDrawer";
import { useLoaderStore } from "@/store/useLoaderStore";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pagination State Variables
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationMeta, setPaginationMeta] = useState({
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const { show, hide } = useLoaderStore();
  const recordsPerPage = 5;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        show("Loading Orders...");

        // 1️⃣ Fetch orders
        const res = await fetch(`/api/account/orders?page=${currentPage}&limit=${recordsPerPage}`);
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
            hasPrevPage: data.pagination.hasPrevPage
          });
        }

        /* // 2️⃣ Check pending payments (proper async handling)
        await Promise.all(
          data.orders.map(async (order: any) => {
            if (order.payment_status === "pending") {
              try {
                await fetch("/api/paynl/check-status", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: order.id }),
                });
              } catch (err) {
                console.error("Status check failed:", err);
              }
            }
          }),
        );

        // 3️⃣ Refetch updated orders (IMPORTANT)
        const updatedRes = await fetch("/api/account/orders");
        const updatedData = await updatedRes.json(); */

        // setOrders(updatedData.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setOrders([]);
      } finally {
        hide();
      }
    };

    loadOrders();
  }, [currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Order History</h1>
        <span className="text-sm text-gray-500 font-medium">
          Total Orders: {paginationMeta.totalRecords}
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order: any) => (
            <div key={order.id}>
              <OrderCard
                order={order}
                isOpen={expandedId === order.id}
                onToggle={() =>
                  setExpandedId(expandedId === order.id ? null : order.id)
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* 🔹 INTERACTIVE PAGINATION CONTROLS BAR */}
      {paginationMeta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!paginationMeta.hasPrevPage}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
          >
            ← Previous
          </button>
          
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {paginationMeta.totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, paginationMeta.totalPages))}
            disabled={!paginationMeta.hasNextPage}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
          >
            Next →
          </button>
        </div>
      )}

      <OrderDrawer order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
