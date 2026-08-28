import { create } from "zustand";

export type CartToastVariant = "added" | "increased";

export type ToastAnchor = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type CartToastPayload = {
  variant: CartToastVariant;
  title: string;
  subtitle?: string;
  anchor?: ToastAnchor;
};

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

export type CartActionOptions = {
  anchor?: ToastAnchor;
  showToast?: boolean;
};
