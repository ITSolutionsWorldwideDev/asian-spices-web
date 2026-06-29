// apps/web/store/useCartSync.ts

"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export const useCartSync = () => {
  const { data: session, status } = useSession();

  const { cart, clearCart, setCart } = useCartStore();
  const { items: wishlist, clearWishlist, setWishlist } = useWishlistStore();

  const hasSynced = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || hasSynced.current) return;

    const syncCart = async () => {
      try {
        // =========================================================
        //    CART SYNC
        // =========================================================

        const cartRes = await fetch("/api/cart");

        if (cartRes.ok) {
          const dbCart = await cartRes.json();

          const formattedCart = dbCart.map((item: any) => ({
            id: item.product_id,
            title: item.title || "Product",
            price: Number(item.price),
            quantity: item.quantity,
            image: item.image || "",
            category_slug: item.category_slug || "",
          }));

          setCart(formattedCart);
        }

        // =========================================================
        //    WISHLIST SYNC
        // =========================================================

        // OPTIONAL:
        // Merge local wishlist into DB

        const wishlistRes = await fetch("/api/wishlist");

        if (wishlistRes?.ok) {
          const dbWishlist = await wishlistRes?.json();

          const formattedWishlist = dbWishlist?.map((item: any) => ({
            id: item.id || item.product_id,
            name: item.name || "Product",
            image: item.image || "",
            price: Number(item.price),
            slug: item.slug || "",
            category_slug: item.category_slug || "",
          }));

          setWishlist(formattedWishlist);
        }

        hasSynced.current = true;
      } catch (err) {
        console.error("Cart sync failed", err);
      }
    };

    syncCart();
  }, [status]);
};

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
