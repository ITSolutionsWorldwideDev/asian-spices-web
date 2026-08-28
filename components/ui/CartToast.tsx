"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ShoppingBag, Plus, X } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

export default function CartToast() {
  const toast = useToastStore((s) => s.toast);
  const hide = useToastStore((s) => s.hide);
  const popupRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    bottom: "1.25rem",
    left: "50%",
    transform: "translateX(-50%)",
  });

  useLayoutEffect(() => {
    if (!toast) return;

    const popup = popupRef.current;
    if (!toast.anchor || !popup) {
      setStyle({
        bottom: "1.25rem",
        left: "50%",
        transform: "translateX(-50%)",
        top: undefined,
        width: undefined,
        maxWidth: "28rem",
      });
      return;
    }

    const { top, left, width, height } = toast.anchor;
    const popupRect = popup.getBoundingClientRect();
    const popupH = popupRect.height || 88;
    const popupW = Math.min(Math.max(width - 8, 240), 360, window.innerWidth - 24);
    const centerX = left + width / 2;

    let x = centerX;
    const half = popupW / 2;
    x = Math.max(half + 12, Math.min(window.innerWidth - half - 12, x));

    const gap = 10;
    const belowY = top + height + gap;
    const fitsBelow = belowY + popupH <= window.innerHeight - 12;
    const aboveY = top - gap;

    if (fitsBelow) {
      setStyle({
        top: belowY,
        left: x,
        transform: "translateX(-50%)",
        width: popupW,
        maxWidth: popupW,
        bottom: undefined,
      });
    } else {
      setStyle({
        top: aboveY,
        left: x,
        transform: "translate(-50%, -100%)",
        width: popupW,
        maxWidth: popupW,
        bottom: undefined,
      });
    }
  }, [toast]);

  if (!toast) return null;

  const isAdded = toast.variant === "added";

  return (
    <div
      ref={popupRef}
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed z-[9998]"
      style={style}
    >
      <div className="animate-fade-in pointer-events-auto overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.15)]">
        <div
          className={`h-1 w-full bg-gradient-to-r ${
            isAdded
              ? "from-orange-500 to-amber-400"
              : "from-amber-500 to-orange-400"
          }`}
        />

        <div className="flex items-start gap-2.5 p-3 sm:gap-3 sm:p-4">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${
              isAdded
                ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200"
                : "bg-gradient-to-br from-amber-100 to-orange-100 text-orange-600"
            }`}
          >
            {isAdded ? (
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.25} />
            ) : (
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900">{toast.title}</p>
            {toast.subtitle ? (
              <p className="mt-0.5 text-xs text-slate-500">{toast.subtitle}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={hide}
            aria-label="Dismiss"
            className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
