// apps/web/components/ui/OrderTimeline.tsx

"use client";

type Step = {
  key: string;
  label: string;
};

const steps: Step[] = [
  { key: "pending", label: "Order Placed" },
  { key: "paid", label: "Payment Confirmed" },
  { key: "shipped", label: "Shipped" },
];

export default function OrderTimeline({
  status,
}: {
  status: "pending" | "paid" | "failed" | "shipped";
}) {
  const getStepIndex = (status: string) => {
    if (status === "failed") return -1;
    if (status === "pending") return 0;
    if (status === "paid") return 1;
    if (status === "shipped") return 2;
    return 0;
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-4">Order Progress</h3>

      <div className="flex flex-col gap-4">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : "bg-gray-200"
                }`}
              />

              <div>
                <p
                  className={`text-sm font-medium ${
                    isActive ? "text-black" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {status === "failed" && (
        <p className="text-red-600 mt-4 text-sm">
          Payment failed. You can retry below.
        </p>
      )}
    </div>
  );
}