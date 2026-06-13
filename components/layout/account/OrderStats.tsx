// components/layout/account/OrderStats.tsx

"use client";

import { useEffect, useState } from "react";
import { useLoaderStore } from "@/store/useLoaderStore";

export default function OrderStats() {
  const { show, hide } = useLoaderStore();

  const [stats, setStats] = useState([
    { label: "Total Orders", value: 0 },
    { label: "Pending", value: 0 },
    { label: "Completed", value: 0 },
    { label: "Cancelled", value: 0 },
  ]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        show("Loading Orders Stats...");

        const res = await fetch("/api/account/orders/stats");
        const data = await res.json();

        setStats([
          {
            label: "Total Orders",
            value: data.stats.totalOrders,
          },
          {
            label: "Pending",
            value: data.stats.pending,
          },
          {
            label: "Completed/confirmed",
            value: data.stats.completed,
          },
          {
            label: "Cancelled",
            value: data.stats.cancelled,
          },
        ]);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        hide();
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">{s.label}</p>
          <p className="text-xl font-bold">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
