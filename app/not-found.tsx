import Link from "next/link";
import { Home, Search, ShoppingBag, ChefHat, HelpCircle } from "lucide-react";
import Footer from "@/components/layout/Footer";

const quickLinks = [
  {
    href: "/products",
    label: "All Products",
    description: "Browse our full catalog",
    icon: ShoppingBag,
  },
  {
    href: "/spices",
    label: "Spices",
    description: "Premium Asian spices",
    icon: ShoppingBag,
  },
  {
    href: "/recipes",
    label: "Recipes",
    description: "Cook with inspiration",
    icon: ChefHat,
  },
  {
    href: "/search",
    label: "Search",
    description: "Find what you need",
    icon: Search,
  },
];

export default function NotFound() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
          <p className="text-7xl md:text-8xl font-bold text-orange-500/20 select-none mb-2">
            404
          </p>

          <div className="w-20 h-20 -mt-10 rounded-full bg-orange-100 flex items-center justify-center mb-6 relative z-10">
            <HelpCircle className="w-10 h-10 text-orange-500" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Page not found
          </h1>

          <p className="text-gray-500 max-w-md mb-8 text-base md:text-lg">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            may have been moved or no longer exists. Try one of the links below
            to keep shopping.
          </p>

          <div className="flex gap-4 flex-wrap justify-center mb-14">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>

            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 bg-white px-6 py-3 rounded-xl font-medium transition"
            >
              Contact Support
            </Link>
          </div>

          <div className="w-full max-w-3xl">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
              Popular destinations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {quickLinks.map(({ href, label, description, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:border-orange-300 hover:shadow-sm transition"
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 group-hover:bg-orange-100 transition">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block font-medium text-gray-900 group-hover:text-orange-600 transition">
                      {label}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
