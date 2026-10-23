// components/layout/account/address/AddressCard.tsx

import { CheckCircle } from "lucide-react";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onDefault,
}: any) {
  return (
    <div
      className={`relative border rounded-xl p-4 bg-white transition cursor-pointer
        ${
          address.is_default
            ? "border-orange-500 ring-2 ring-orange-200 bg-orange-50"
            : "hover:border-gray-400"
        }
      `}
      onClick={() => !address.is_default && onDefault(address.id)}
    >
      {/* ✅ Selected Indicator (radio style) */}
      <div className="absolute top-3 right-3">
        {address.is_default ? (
          <CheckCircle className="text-orange-500 w-6 h-6" />
        ) : (
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
        )}
      </div>

      {/* ✅ Label */}
      {address.is_default && (
        <span className="inline-block mb-2 text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">
          Default Address
        </span>
      )}

      {/* ✅ Address Info */}
      <p className="font-medium">{address.address_line1}</p>
      <p className="text-sm text-gray-500">
        {address.city}, {address.country}
      </p>

      {/* ✅ Actions */}
      <div className="flex gap-3 mt-4 text-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(address);
          }}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(address.id);
          }}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>

        {!address.is_default && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDefault(address.id);
            }}
            className="text-gray-600 hover:underline"
          >
            Set Default
          </button>
        )}
      </div>
    </div>
  );
}

/* export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onDefault,
}: any) {
  return (
    <div className="border rounded-xl p-4 bg-white relative">
      {address.is_default && (
        <span className="absolute top-2 right-2 text-xs bg-black text-white px-2 py-1 rounded">
          Default
        </span>
      )}

      <p className="font-medium">{address.address_line1}</p>
      <p className="text-sm text-gray-500">
        {address.city}, {address.country}
      </p>

      <div className="flex gap-3 mt-3 text-sm">
        <button onClick={() => onEdit(address)}>Edit</button>
        <button onClick={() => onDelete(address.id)}>Delete</button>

        {!address.is_default && (
          <button onClick={() => onDefault(address.id)}>
            Set Default
          </button>
        )}
      </div>
    </div>
  );
} */