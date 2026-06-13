// apps/web/components/layout/account/AccountSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/account/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/account/addresses",
    label: "Addresses",
    icon: MapPin,
  },
  {
    href: "/account/orders",
    label: "Orders",
    icon: Package,
  },
  {
    href: "/account/recipes",
    label: "My Recipes",
    icon: Package,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white rounded-2xl p-4 shadow-sm border h-fit sticky top-24">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white font-medium transition",
                isActive
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}