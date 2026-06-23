// components/layout/account/AccountTabs.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/account/profile", icon: User },
  { href: "/account/addresses", icon: MapPin },
  { href: "/account/orders", icon: Package },
];

export default function AccountTabs() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden flex justify-around bg-white border rounded-xl p-2 mb-6 shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center text-xs px-3 py-2 rounded-lg",
              active
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-orange-500 hover:bg-orange-600"
            )}
          >
            <Icon size={18} />
          </Link>
        );
      })}
    </div>
  );
}