// components/layout/account/orders/OrderDrawer.tsx 

"use client";

import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";
import OrderTimeline from "./OrderTimeline";

export default function OrderDrawer({ order, onClose }: any) {
  const router = useRouter();
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-full max-w-md bg-white p-6 h-full flex flex-col shadow-xl">
        
        {/* Dynamic scrollable body view region content */}
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">
              Order #{order.order_number}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-black font-medium text-sm border px-3 py-1 rounded-lg transition"
            >
              Close
            </button>
          </div>

          <OrderTimeline status={order.order_status} />

          <div className="mt-6 space-y-2 border-t pt-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Item Summary</h4>
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-50">
                <p className="font-medium text-gray-800">{item.product_name}</p>
                <p className="text-gray-500 font-semibold">x{item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Option B Action Entry Anchor Layout Footing */}
        <div className="border-t pt-4 bg-white mt-auto">
          <button
            onClick={() => {
              onClose();
              router.push(`/account/orders/${order.id}/action`);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-xl transition cursor-pointer"
          >
            <Undo2 size={15} className="text-gray-500" />
            File Return or Item Cancellation
          </button>
        </div>

      </div>
    </div>
  );
}

/* export default function OrderDrawer({ order, onClose }: any) {
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
} */