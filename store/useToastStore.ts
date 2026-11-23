import { create } from "zustand";
import type { CartToastPayload } from "@/types/cart";

export type {
  CartToastVariant,
  ToastAnchor,
  CartToastPayload,
  CartActionOptions,
} from "@/types/cart";

type ToastState = {
  toast: CartToastPayload | null;
  show: (payload: CartToastPayload) => void;
  hide: () => void;
};

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  show: (payload) => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ toast: payload });
    hideTimer = setTimeout(() => {
      set({ toast: null });
      hideTimer = null;
    }, 3000);
  },
  hide: () => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ toast: null });
  },
}));
