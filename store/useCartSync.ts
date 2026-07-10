// store/useCartSync.ts

"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useGlobalStore } from "@/store/useGlobalStore";

export const useCartSync = () => {
  const { data: session, status } = useSession();
  const { selectedCountry } = useGlobalStore();

  // const { cart, clearCart, setCart } = useCartStore();
  const { cart, setCart, refreshGuestPrices } = useCartStore();
  const { items: wishlist, clearWishlist, setWishlist } = useWishlistStore();

  const hasSynced = useRef(false);

  const currentCountryCode = selectedCountry || "NL";

  useEffect(() => {
    // 🟢 CASE 1: If user is logged in, fetch matched DB row items using country param query context
    if (status === "authenticated") {
      const syncCart = async () => {
        try {
          const cartRes = await fetch(`/api/cart?country=${currentCountryCode}`);
          if (cartRes.ok) {
            const dbCart = await cartRes.json();
            const formattedCart = dbCart.map((item: any) => ({
              id: item.product_id,
              title: item.title || "Product",
              base_price: Number(item.base_price),
              quantity: item.quantity,
              image: item.image || "",
              category_slug: item.category_slug || "",
            }));
            setCart(formattedCart);
          }
        } catch (err) {
          console.error("Cart sync failed", err);
        }
      };

      const t = setTimeout(syncCart, 150);
      return () => clearTimeout(t);
    }

    // 🟢 CASE 2: If guest session, update the local memory array items directly from DB pricing mappings
    if (status === "unauthenticated") {
      const t = setTimeout(() => {
        refreshGuestPrices(currentCountryCode);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [status, currentCountryCode]);

  useEffect(() => {
    if (status !== "authenticated" || hasSynced.current) return;

    const syncCart = async () => {
      try {
        // =========================================================
        //    CART SYNC
        // =========================================================

        const cartRes = await fetch(`/api/cart?country=${currentCountryCode}`);

        if (cartRes.ok) {
          const dbCart = await cartRes.json();

          const formattedCart = dbCart.map((item: any) => ({
            id: item.product_id,
            title: item.title || "Product",
            base_price: Number(item.base_price),
            quantity: item.quantity,
            image: item.image || "",
            category_slug: item.category_slug || "",
          }));

          // const localCart = useCartStore.getState().cart;

          // if (localCart.length === 0 || formattedCart.length > 0) {
          //   setCart(formattedCart);
          // }

          setCart(formattedCart);
        }

        hasSynced.current = true;
      } catch (err) {
        console.error("Cart sync failed", err);
      }
    };

    const t = setTimeout(() => {
      syncCart();
    }, 300); // let localStorage settle

    return () => clearTimeout(t);
  }, [status, currentCountryCode]);
};

// =========================================================
//    WISHLIST SYNC
// =========================================================

// OPTIONAL:
// Merge local wishlist into DB

// const wishlistRes = await fetch("/api/wishlist");

// if (wishlistRes?.ok) {
//   const dbWishlist = await wishlistRes?.json();

//   const formattedWishlist = dbWishlist?.map((item: any) => ({
//     id: item.id || item.product_id,
//     name: item.name || "Product",
//     image: item.image || "",
//     base_price: Number(item.base_price),
//     slug: item.slug || "",
//     category_slug: item.category_slug || "",
//   }));

//   setWishlist(formattedWishlist);
// }

// ---------------- MERGE LOCAL → DB ----------------

/* if (cart.length > 0) {
          await fetch("/api/cart/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart }),
          });

          // clearCart(); // 🧹 clear local
        } */

// ---------------- FETCH DB CART ----------------
