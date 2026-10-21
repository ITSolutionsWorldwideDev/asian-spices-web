// components/layout/account/UserMenu.tsx

"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useLoaderStore } from "@/store/useLoaderStore";
import { useCartStore } from "@/store/useCartStore";

export default function UserMenu({ email }: { email?: string }) {
  const [open, setOpen] = useState(false);
  const clearCart = useCartStore((s) => s.clearCart);
  const menuRef = useRef<HTMLDivElement>(null);

  const { show, hide } = useLoaderStore();
  const [displayname, setdisplayname] = useState<string>("User");

  useEffect(() => {
    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => {
        setdisplayname(data?.user?.displayname || "User");
      })
      .catch((err) => console.error("Failed to load profile:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      {/* Title & Subtitle */}
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 break-words">
          Welcome, {displayname} 👋
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
          Manage your account settings, orders and addresses
        </p>
      </div>

      {/* Avatar & Dropdown */}
      <div ref={menuRef} className="notranslate relative shrink-0 pt-0.5" translate="no">
        <button
          onClick={() => setOpen(!open)}
          aria-label="User account menu"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm sm:text-base flex items-center justify-center shadow-sm transition active:scale-95"
        >
          {email?.charAt(0).toUpperCase() || "U"}
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white border border-gray-100 rounded-xl shadow-xl p-1.5 z-50">
            <button
              onClick={() => {
                clearCart(false);
                signOut();
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
