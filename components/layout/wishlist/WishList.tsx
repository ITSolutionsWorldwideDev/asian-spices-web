// apps/web/components/layout/wishlist/WishList.tsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  Trash2,
  ShoppingCart,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";

import EmptyWishList from "./EmptyWishList";
import { useSession } from "next-auth/react";

export default function WishList() {
  // const { data: session } = useSession();
  const { data: session, status } = useSession();

  const isLoggedIn = !!session?.user;

  const { symbol, rate } = useCurrencyStore();
  const { addToCart } = useCartStore();

  const [isHydrated, setIsHydrated] = useState(false);

  const {
    items: wishlist,
    removeFromWishlist,
    clearWishlist,
    setWishlist,
  } = useWishlistStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (isLoggedIn) {
      // User logged in -> fetch actual database state
      const fetchDatabaseWishlist = async () => {
        try {
          const res = await fetch("/api/wishlist");
          if (res.ok) {
            const data = await res.json();
            setWishlist(data);
          }
        } catch (err) {
          console.error("Failed to sync remote wishlist state", err);
        }
      };
      fetchDatabaseWishlist();
    } else {
      // User logged out -> immediately clear unauthenticated local storage items
      clearWishlist();
    }
  }, [isLoggedIn, status, setWishlist, clearWishlist]);

  // Handle loading or hydration states cleanly
  if (!isHydrated || status === "loading") {
    return <div className="py-20 text-center text-gray-500">Loading your selections...</div>;
  }

  if (wishlist.length === 0) {
    return <EmptyWishList />;
  }

  const totalValue = wishlist.reduce(
    (acc, item) => acc + Number(item.price || 0),
    0,
  );

  // const totalValue = wishlist.reduce(
  //   (acc, item) => acc + Number(item.price || 0),
  //   0,
  // );

  // if (wishlist.length === 0) {
  //   return <EmptyWishList />;
  // }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* =========================================================
            BREADCRUMB
        ========================================================= */}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/">Home</Link>

          <span>/</span>

          <span className="text-black font-medium">Wishlist</span>
        </div>

        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>

              <div className="px-4 py-1 rounded-full bg-orange-500 text-white text-sm font-medium">
                {wishlist.length} Items
              </div>
            </div>

            <p className="text-gray-500 mt-3">
              Save your favorite products for later.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={clearWishlist}
              className="border border-red-200 text-red-500 hover:bg-red-50 transition px-5 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer"
            >
              <Trash2 size={18} />
              Clear Wishlist
            </button>

            <Link href="/">
              <button className="bg-orange-500 hover:bg-orange-600 transition text-white px-6 py-3 rounded-xl font-semibold cursor-pointer">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>

        {/* =========================================================
            STATS
        ========================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {/* ITEMS */}

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Heart className="text-orange-500" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Wishlist Items</p>

                <h3 className="text-3xl font-bold">{wishlist.length}</h3>
              </div>
            </div>
          </div>

          {/* VALUE */}

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="text-green-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Value</p>

                <h3 className="text-3xl font-bold">
                  {symbol}
                  {(rate * totalValue).toFixed(2)}
                </h3>
              </div>
            </div>
          </div>

          {/* SAVINGS */}

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Sparkles className="text-purple-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Saved Favorites</p>

                <h3 className="text-3xl font-bold">{wishlist.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            PRODUCTS
        ========================================================= */}

        <div className="mt-10 space-y-5">
          {wishlist.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-xl transition"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* IMAGE */}

                <Link
                  href={`/${item.category_slug}/${item.slug}`}
                  className="shrink-0"
                >
                  <div className="relative w-full lg:w-36 h-36 overflow-hidden rounded-2xl bg-gray-100">
                    <Image
                      src={item.image || "/images/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                {/* CONTENT */}

                <div className="flex-1 flex flex-col lg:flex-row justify-between gap-6">
                  {/* LEFT */}

                  <div className="flex-1">
                    {/* <Link
                      href={`/${item.category_slug}/${item.slug}`}
                    >
                      <h3 className="text-2xl font-bold text-gray-900 hover:text-orange-500 transition">
                        {item.name}
                      </h3>
                    </Link> */}
                    <Link
                      href={`/${item.category_slug || "products"}/${item.slug || item.id}`}
                    >
                      <h3 className="font-semibold">{item.name}</h3>
                    </Link>

                    {/* <div className="mt-4">
                      <span className="text-3xl font-bold text-orange-500">
                        {symbol}
                        {(rate * item.price).toFixed(2)}
                      </span>
                    </div> */}

                    <div className="mt-4  text-sm text-orange-500">
                      <p className="font-normal mb-2">
                        {symbol}
                        {(rate * item.price).toFixed(2)}
                      </p>
                      <p className="font-normal">
                        Total: {symbol}
                        {(rate * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-col gap-3 min-w-[220px]">
                    {/* ADD TO CART */}

                    <button
                      onClick={() => {
                        addToCart(
                          {
                            id: item.id,
                            title: item.name,
                            image: item.image,
                            price: item.price,
                            slug: item.slug,
                            category_slug: item.category_slug,
                          },
                          isLoggedIn,
                        );
                      }}
                      className="bg-orange-500 hover:bg-orange-600 transition text-white rounded-xl py-3 px-5 font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart size={18} />
                      Add To Cart
                    </button>

                    {/* VIEW */}

                    <Link href={`/${item.category_slug}/${item.slug}`}>
                      <button className="w-full border border-gray-300 hover:bg-gray-50 transition rounded-xl py-3 px-5 font-medium cursor-pointer">
                        View Details
                      </button>
                    </Link>

                    {/* REMOVE */}

                    <button
                      onClick={() => removeFromWishlist(item.id, isLoggedIn)}
                      className="border border-red-200 text-red-500 hover:bg-red-50 transition rounded-xl py-3 px-5 font-medium flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Trash2 size={18} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================================
            CTA
        ========================================================= */}

        <div className="mt-14 rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-10 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <Sparkles className="text-orange-500" />
            </div>
          </div>

          <h2 className="mt-5 text-3xl font-bold text-gray-900">
            Ready to order your favorites?
          </h2>

          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Add your saved products to cart and continue your shopping
            experience.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/">
              <button className="border border-gray-300 bg-white hover:bg-gray-50 transition rounded-xl px-6 py-3 font-medium cursor-pointer">
                Continue Shopping
              </button>
            </Link>

            <Link href="/cart">
              <button className="bg-orange-500 hover:bg-orange-600 transition text-white rounded-xl px-6 py-3 font-semibold flex items-center gap-2 cursor-pointer">
                Go To Cart
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
