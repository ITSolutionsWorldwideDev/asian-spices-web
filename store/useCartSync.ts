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

  const { setCart, refreshGuestPrices } = useCartStore();
  const { items: wishlist, clearWishlist, setWishlist } = useWishlistStore();

  const hasSynced = useRef(false);
  /** Skip the first guest price refresh so localStorage gross prices are kept on reload */
  const guestCountryRef = useRef<string | null>(null);

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
              slug: item.slug || "",
              category_id: item.category_id ? String(item.category_id) : "",
              category_slug: item.category_slug || "",
              subcategory_slug: item.subcategory_slug || "",
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

    // 🟢 CASE 2: Guest — only refresh prices when country changes (not on every reload)
    if (status === "unauthenticated") {
      if (guestCountryRef.current === null) {
        guestCountryRef.current = currentCountryCode;
        return;
      }
      if (guestCountryRef.current === currentCountryCode) return;

      guestCountryRef.current = currentCountryCode;
      const t = setTimeout(() => {
        refreshGuestPrices(currentCountryCode);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [status, currentCountryCode, setCart, refreshGuestPrices]);

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
            slug: item.slug || "",
            category_id: item.category_id ? String(item.category_id) : "",
            category_slug: item.category_slug || "",
            subcategory_slug: item.subcategory_slug || "",
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
