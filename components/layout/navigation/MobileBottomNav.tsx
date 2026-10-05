"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { House, Heart, BadgePercent, UserRound } from "lucide-react";

const items = [
  {
    key: "home",
    label: "Home",
    href: "/",
    match: (pathname: string) => pathname === "/",
    Icon: House,
  },
  {
    key: "favourite",
    label: "Favourite",
    href: "/wishlist",
    match: (pathname: string) => pathname.startsWith("/wishlist"),
    Icon: Heart,
  },
  {
    key: "sales",
    label: "Sales",
    href: "/#flash-sale",
    match: () => false,
    Icon: BadgePercent,
  },
  {
    key: "login",
    label: "Login",
    href: "/login",
    match: (pathname: string) =>
      pathname.startsWith("/login") || pathname.startsWith("/signup"),
    Icon: UserRound,
  },
] as const;

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[999998] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] xl:hidden"
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-md items-stretch justify-between gap-0.5 rounded-full bg-white px-1.5 py-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.14)] ring-1 ring-black/5">
        {items.map(({ key, label, href, match, Icon }) => {
          const isLogin = key === "login";
          const resolvedHref = isLogin && session ? "/account" : href;
          const resolvedLabel = isLogin && session ? "Account" : label;
          const isActive = isLogin
            ? session
              ? pathname.startsWith("/account")
              : match(pathname)
            : match(pathname);

          return (
            <Link
              key={key}
              href={resolvedHref}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full px-1.5 py-1.5 transition ${
                isActive
                  ? "bg-gray-100 text-[#0f4a4a]"
                  : "text-neutral-800 hover:bg-gray-50"
              }`}
            >
              <Icon
                className="h-6 w-6 shrink-0"
                strokeWidth={isActive ? 2.25 : 1.9}
                absoluteStrokeWidth
                fill={
                  isActive && (key === "home" || key === "favourite")
                    ? "currentColor"
                    : "none"
                }
              />
              <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-wide leading-none">
                {resolvedLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
