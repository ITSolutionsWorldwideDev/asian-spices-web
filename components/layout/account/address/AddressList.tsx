// components/account/address/AddressList.tsx

import AddressCard from "./AddressCard";

export default function AddressList({
  addresses,
  onEdit,
  onDelete,
  onDefault,
}: any) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {addresses.map((a: any) => (
        <AddressCard
          key={a.id}
          address={a}
          onEdit={onEdit}
          onDelete={onDelete}
          onDefault={onDefault}
        />
      ))}
    </div>
  );
}