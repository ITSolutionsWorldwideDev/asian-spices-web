// components/account/orders/OrderDrawer.tsx

"use client";

import OrderTimeline from "./OrderTimeline";

export default function OrderDrawer({ order, onClose }: any) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="w-full max-w-md bg-white p-6 h-full overflow-y-auto">
        <button onClick={onClose}>Close</button>

        <h2 className="text-lg font-bold mt-4">
          Order #{order.order_number}
        </h2>

        <OrderTimeline status={order.order_status} />

        <div className="mt-6 space-y-2">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex justify-between">
              <p>{item.product_name}</p>
              <p>x{item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}