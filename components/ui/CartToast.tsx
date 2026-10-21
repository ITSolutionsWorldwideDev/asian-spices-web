"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ShoppingBag, Plus, X } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

export default function CartToast() {
  const toast = useToastStore((s) => s.toast);
  const hide = useToastStore((s) => s.hide);
  const popupRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    bottom: "1.5rem",
    left: "50%",
    transform: "translateX(-50%)",
  });

  useLayoutEffect(() => {
    if (!toast) return;

    const popup = popupRef.current;
    if (!popup) return;

    const updatePosition = () => {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const popupRect = popup.getBoundingClientRect();
      const popupH = popupRect.height || 88;
      const popupW = Math.min(360, Math.max(260, winW - 32));

      // Safe top clearance below sticky navbar
      const navSafeTop = winW < 1280 ? 115 : 90;
      // Safe bottom clearance (accounts for mobile bottom navbar ~70-80px on smaller screens)
      const bottomSafe = winW < 1280 ? 85 : 24;

      // Fallback helper: always-visible centered toast
      const setCenteredFallback = () => {
        setStyle({
          bottom: `${bottomSafe}px`,
          left: "50%",
          transform: "translateX(-50%)",
          top: undefined,
          width: popupW,
          maxWidth: "calc(100vw - 32px)",
        });
      };

      if (!toast.anchor || winH < 450) {
        setCenteredFallback();
        return;
      }

      const { top, left, width, height } = toast.anchor;

      // If anchor card is completely out of the viewport, fall back to safe bottom center
      if (top + height < 0 || top > winH) {
        setCenteredFallback();
        return;
      }

      // Horizontal alignment: Center above/below the card, clamped strictly within viewport margins
      const centerX = left + width / 2;
      let targetLeft = centerX - popupW / 2;
      targetLeft = Math.max(16, Math.min(winW - popupW - 16, targetLeft));

      const gap = 10;
      const belowY = top + height + gap;
      const fitsBelow = belowY + popupH <= winH - bottomSafe;

      const aboveY = top - gap - popupH;
      const fitsAbove = aboveY >= navSafeTop;

      if (fitsBelow) {
        setStyle({
          top: `${belowY}px`,
          left: `${targetLeft}px`,
          transform: "none",
          width: popupW,
          maxWidth: "calc(100vw - 32px)",
          bottom: undefined,
        });
      } else if (fitsAbove) {
        setStyle({
          top: `${aboveY}px`,
          left: `${targetLeft}px`,
          transform: "none",
          width: popupW,
          maxWidth: "calc(100vw - 32px)",
          bottom: undefined,
        });
      } else {
        // Neither fits (common on high zoom levels where card height exceeds viewport)
        // Never hide or clip: place in safe visible area at bottom
        setCenteredFallback();
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [toast]);

  if (!toast) return null;

  const isAdded = toast.variant === "added";

  return (
    <div
      ref={popupRef}
      role="status"
      aria-live="polite"
      translate="no"
      className="notranslate pointer-events-none fixed"
      style={{
        ...style,
        zIndex: 10000000,
      }}
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
