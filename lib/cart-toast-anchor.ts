import type { MouseEvent } from "react";

export type ToastAnchor = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function anchorFromClick(e: MouseEvent<HTMLElement>): ToastAnchor {
  const card =
    (e.currentTarget.closest("[data-cart-anchor]") as HTMLElement | null) ??
    e.currentTarget;
  const rect = card.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}
