// apps/web/components/layout/navigation/ButtonsNavigation.tsx

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { User, CircleUserRound } from "lucide-react";
import UpperSelection from "./UpperSelection";

const ButtonsNavigation = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return null;
  }

  return (
    <div className="hidden lg:flex items-center space-x-3">
      {!session && (
        <>
          <div className="hover:rotate-10 bg-white rounded-full hover:text-white">
            <div className="hover:bg-black hover:-rotate-10 px-6 py-3 rounded-full">
              <Link href="/login" className="font-bold">
                Login
              </Link>
              {/* {" / "}
              <Link href="/signup" className="font-bold">
                Signup
              </Link> */}
            </div>
          </div>
        </>
      )}

      {session && (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="bg-white p-2 rounded-full font-bold ml-2 cursor-pointer"
          >
            <User size={24} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow">
              <Link
                href="/account"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                My Account
              </Link>

              <Link
                href="/account/orders"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Orders
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      <div className="hover:rotate-10 bg-white rounded-full hover:text-white">
        <div className="hover:bg-black hover:-rotate-10 px-6 py-3 rounded-full">
          <Link href="/contactus" className="font-bold whitespace-nowrap">
            Contact Us
          </Link>
        </div>
      </div>
      <UpperSelection />
    </div>
  );
};

export default ButtonsNavigation;
