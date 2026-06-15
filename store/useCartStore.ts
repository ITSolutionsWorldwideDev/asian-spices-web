// apps/web/store/useCartStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;

  slug?: string;
  category_slug?: string;
}

interface CartState {
  cart: CartItem[];

  addToCart: (item: Omit<CartItem, "quantity">, isLoggedIn: boolean) => void;
  removeFromCart: (id: string, isLoggedIn: boolean) => void;

  increaseQty: (id: string, isLoggedIn: boolean) => void;
  decreaseQty: (id: string, isLoggedIn: boolean) => void;
  setQty: (id: string, quantity: number, isLoggedIn: boolean) => void;

  setCart: (items: CartItem[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: async (item, isLoggedIn) => {
        const existing = get().cart.find((i) => i.id === item.id);

        let updatedCart;

        if (existing) {
          updatedCart = get().cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        } else {
          updatedCart = [...get().cart, { ...item, quantity: 1 }];
        }

        set({ cart: updatedCart });

        // ✅ Only sync if logged in
        if (!isLoggedIn) return;

        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: item.id,
              // price: item.price,
              quantity: 1,
            }),
          });
        } catch (err) {
          console.error("Cart sync failed", err);
        }
      },

      /* ---------------- REMOVE ---------------- */

      removeFromCart: async (id, isLoggedIn) => {
        set({
          cart: get().cart.filter((i) => i.id !== id),
        });

        if (!isLoggedIn) return;

        try {
          const res = await fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: id }),
          });

          if (!res.ok) {
            throw new Error("Delete failed");
          }
        } catch (err) {
          console.error("Remove failed, reverting", err);

          const res = await fetch("/api/cart");
          const dbCart = await res.json();

          set({
            cart: dbCart.map((item: any) => ({
              id: item.product_id,
              title: item.title || "Product",
              price: Number(item.price),
              quantity: item.quantity,
              image: item.image || "",
              category_slug: item.category_slug || "",
            })),
          });
        }
      },

      /* ---------------- INCREASE ---------------- */
      increaseQty: async (id, isLoggedIn) => {
        set({
          cart: get().cart.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        });

        if (!isLoggedIn) return;

        try {
          await fetch("/api/cart/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: id,
              delta: 1,
            }),
          });
        } catch (err) {
          console.error("Increase failed", err);
        }
      },

      /* ---------------- DECREASE ---------------- */
      decreaseQty: async (id, isLoggedIn) => {
        const item = get().cart.find((i) => i.id === id);
        if (!item) return;

        if (item.quantity === 1) {
          return get().removeFromCart(id, isLoggedIn);
        }

        set({
          cart: get().cart.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
          ),
        });

        if (!isLoggedIn) return;

        try {
          await fetch("/api/cart/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: id,
              delta: -1,
            }),
          });
        } catch (err) {
          console.error("Decrease failed", err);
        }
      },

      setQty: async (id, quantity, isLoggedIn) => {
        // prevent invalid values
        const qty = Math.max(1, quantity);

        set({
          cart: get().cart.map((i) =>
            i.id === id ? { ...i, quantity: qty } : i,
          ),
        });

        if (!isLoggedIn) return;

        try {
          await fetch("/api/cart/set-qty", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product_id: id,
              quantity: qty,
            }),
          });
        } catch (err) {
          console.error("Set qty failed", err);
        }
      },

      setCart: (items) => set({ cart: items }),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
      version: 1,
      migrate: (state: any): CartState => {
        return {
          cart: state?.cart || [],
          addToCart: () => {},
          removeFromCart: () => {},
          increaseQty: () => {},
          decreaseQty: () => {},
          setQty: () => {},
          setCart: () => {},
          clearCart: () => {},
        };
      },
    },
  ),
);
