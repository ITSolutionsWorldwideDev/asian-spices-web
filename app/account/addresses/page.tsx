// apps/web/app/account/addresses/page.tsx

"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/layout/account/Modal";
import AddressForm from "@/components/layout/account/AddressForm";
import AddressList from "@/components/layout/account/address/AddressList";
import AddressSkeleton from "@/components/layout/account/address/AddressSkeleton";
import { useLoaderStore } from "@/store/useLoaderStore";

type Address = {
  id: string;
  address_line1: string;
  city: string;
  country: string;
  is_default?: boolean;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  const { show, hide } = useLoaderStore();

  const load = async () => {
    setLoading(true);
    show("Loading Addresses...");
    const res = await fetch("/api/account/addresses");
    const data = await res.json();
    setAddresses(data.addresses);
    setLoading(false);
    hide();
  };

  useEffect(() => {
    load();
  }, []);

  const setDefault = async (id: string) => {
    await fetch(`/api/account/addresses/${id}/default`, {
      method: "PATCH",
    });
    load();
  };

  if (loading) return <AddressSkeleton />;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">My Addresses</h1>
        <button onClick={() => setOpen(true)} className="btn-primary">
          + Add
        </button>
      </div>

      <AddressList
        addresses={addresses}
        onEdit={(a: any) => {
          setEditing(a);
          setOpen(true);
        }}
        onDelete={async (id: string) => {
          await fetch(`/api/account/addresses/${id}`, {
            method: "DELETE",
          });
          load();
        }}
        onDefault={setDefault}
      />

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        <AddressForm
          initialData={editing}
          addressId={editing?.id}
          onSuccess={() => {
            setOpen(false);
            setEditing(null);
            load();
          }}
        />
      </Modal>
    </div>
  );
}

/* "use client";

import { useEffect, useState } from "react";
import AddressForm from "@/components/layout/account/AddressForm";
import Modal from "@/components/layout/account/Modal";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const load = async () => {
    const res = await fetch("api/account/addresses");
    const data = await res.json();
    setAddresses(data.addresses);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/account/addresses/${id}`, {
      method: "DELETE",
    });
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Addresses</h1>

      <button onClick={() => setOpen(true)}>+ Add Address</button>

      {addresses.map((a) => (
        <div key={a.id} className="border p-3 my-2">
          <p>{a.address_line1}</p>
          <p>{a.city}</p>

          <button
            onClick={() => {
              setEditing(a);
              setOpen(true);
            }}
          >
            Edit
          </button>

          <button onClick={() => handleDelete(a.id)}>Delete</button>
        </div>
      ))}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        <AddressForm
          initialData={editing}
          addressId={editing?.id}
          onSuccess={() => {
            setOpen(false);
            setEditing(null);
            load();
          }}
        />
      </Modal>
    </div>
  );
} */
