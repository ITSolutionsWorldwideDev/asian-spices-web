// components/layout/account/orders/OrderTimeline.tsx

export default function OrderTimeline({ status }: { status: string }) {
  const steps = ["pending", "confirmed", "shipped", "delivered"];

  return (
    <div className="flex items-center justify-between mt-6">
      {steps.map((step, i) => {
        const active = steps.indexOf(status) >= i;

        return (
          <div key={step} className="flex-1 text-center">
            <div
              className={`h-3 w-3 mx-auto rounded-full ${
                active ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <p className="text-xs mt-2 capitalize">{step}</p>
          </div>
        );
      })}
    </div>
  );
}