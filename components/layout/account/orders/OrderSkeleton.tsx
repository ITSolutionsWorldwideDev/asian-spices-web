// components/layout/account/orders/OrderSkeleton.tsx

export default function OrderSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border rounded-xl p-5 space-y-4">
          <div className="h-4 w-1/3 bg-gray-300 rounded" />
          <div className="h-3 w-1/4 bg-gray-200 rounded" />

          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
          </div>

          <div className="h-8 w-24 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}