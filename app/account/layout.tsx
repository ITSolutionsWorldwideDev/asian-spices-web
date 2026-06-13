// apps/web/app/account/layout.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { requireAuth, webAuthOptions } from "@/core/auth";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Image from "next/image";

import AccountSidebar from "@/components/layout/account/AccountSidebar";
import AccountTabs from "@/components/layout/account/AccountTabs";
import UserMenu from "@/components/layout/account/UserMenu";
import OrderStats from "@/components/layout/account/OrderStats";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(webAuthOptions);

  if (!requireAuth(session)) {
    redirect("/login");
  }

  const user = session?.user;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="absolute inset-0 h-screen -z-10">
        <Image
          src={`/assets/home/homeheaderimages/a8de5a3724f7239b78cdee795f978b5faba485b4 (1).webp`}
          alt="Asain Spices"
          fill
          className="object-cover w-full h-full"
        />
      </div>

      <div className=" bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="container mx-auto px-4 py-10 flex-1">
          {/* HEADER */}

          <UserMenu email={user?.email} />

          {/* MOBILE TABS */}
          <AccountTabs />

          {/* STATS */}
          <OrderStats />

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
            <div className="hidden lg:block">
              <AccountSidebar />
            </div>

            {/* CONTENT */}
            <main className="bg-white rounded-2xl p-6 shadow-sm border min-h-100">
              {children}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
