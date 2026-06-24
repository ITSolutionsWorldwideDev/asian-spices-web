// apps/web/store/useWishlistStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  slug?: string;
  category_slug?: string;
}

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem, isLoggedIn: boolean) => Promise<void>;
  removeFromWishlist: (id: string, isLoggedIn: boolean) => Promise<void>;
  toggleWishlist: (item: WishlistItem, isLoggedIn: boolean) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  setWishlist: (items: WishlistItem[]) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: async (item, isLoggedIn) => {
        const exists = get().items.some(
          (i) => String(i.id) === String(item.id),
        );

        if (exists) return;

        // optimistic update
        set({
          items: Array.from(
            new Map(
              [...get().items, item].map((i) => [String(i.id), i]),
            ).values(),
          ),
        });

        if (!isLoggedIn) return;

        try {
          await fetch("/api/wishlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product_id: item.id,
            }),
          });
        } catch (err) {
          console.error("Add wishlist failed", err);
        }
      },

      removeFromWishlist: async (id, isLoggedIn) => {
        // optimistic update
        set({
          items: get().items.filter((i) => i.id !== id),
        });

        if (!isLoggedIn) return;

        try {
          await fetch("/api/wishlist", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product_id: id,
            }),
          });
        } catch (err) {
          console.error("Remove wishlist failed", err);
        }
      },

      toggleWishlist: async (item, isLoggedIn) => {
        const exists = get().items.some(
          (i) => String(i.id) === String(item.id),
        );

        set({
          items: exists
            ? get().items.filter((i) => String(i.id) !== String(item.id))
            : Array.from(
                new Map(
                  [...get().items, item].map((i) => [String(i.id), i]),
                ).values(),
              ),
        });

        if (!isLoggedIn) return;

        try {
          if (exists) {
            await fetch("/api/wishlist", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product_id: item.id,
              }),
            });
          } else {
            await fetch("/api/wishlist", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product_id: item.id,
              }),
            });
          }
        } catch (err) {
          console.error("Wishlist sync failed", err);
        }
      },

      isInWishlist: (id) => get().items.some((item) => item.id === id),
      setWishlist: (items) => set({ items }),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
      version: 1,

      // migrate: (persistedState: any, version: number) => {
      //   return {
      //     items: Array.isArray(persistedState?.items) ? persistedState.items : [],
      //   };
      // },

      migrate: (state: any): WishlistState => {
        return {
          items: state?.items || [],
          addToWishlist: async () => {},
          removeFromWishlist: async () => {},
          toggleWishlist: async () => {},
          isInWishlist: () => false,
          setWishlist: () => {},
          clearWishlist: () => {},
        };
      },
    },
  ),
);
