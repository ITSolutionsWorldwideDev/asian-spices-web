// components/layout/account/address/AddressSkeleton.tsx

export default function AddressSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="border rounded-xl p-4 space-y-3 bg-gray-50"
        >
          <div className="h-4 w-1/2 bg-gray-300 rounded" />
          <div className="h-3 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-2/3 bg-gray-200 rounded" />

          <div className="flex gap-3 pt-3">
            <div className="h-8 w-16 bg-gray-200 rounded" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}