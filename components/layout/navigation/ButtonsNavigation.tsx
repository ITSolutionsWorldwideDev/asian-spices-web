"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { CircleUserRound } from "lucide-react";

const ButtonsNavigation = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return <div className="h-9 w-20 shrink-0" aria-hidden />;
  }

  return (
    <div className="shrink-0">
      {!session ? (
        <Link
          href="/login"
          className="flex items-center gap-1.5 rounded-full border-2 border-orange-500 px-4 py-1.5 text-sm font-semibold text-gray-800 transition hover:bg-orange-50"
        >
          <CircleUserRound className="h-4 w-4" strokeWidth={1.75} />
          Login
        </Link>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 rounded-full border-2 border-orange-500 px-4 py-1.5 text-sm font-semibold text-gray-800 transition hover:bg-orange-50"
          >
            <CircleUserRound className="h-4 w-4" strokeWidth={1.75} />
            Account
          </button>

          {open && (
            <div className="absolute right-0 top-full z-[1000] mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
              <Link
                href="/account"
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                My Account
              </Link>
              <Link
                href="/account/orders"
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Orders
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ButtonsNavigation;
