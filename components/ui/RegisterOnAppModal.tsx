// RegisterOnAppModal.tsx

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import RegisterOnApp from "./RegisterOnApp";

const STORAGE_KEY = "app-modal-dismissed";

/** Must sit above fixed site nav (zIndex 999999 in Nav.tsx). */
const MODAL_Z_INDEX = 1000000;

export default function RegisterOnAppModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setOpen(true);
    }
  }, []);

  // Prevent background scrolling while the advertisement modal is active
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const closeModal = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="App early access"
      onClick={closeModal}
      style={{ zIndex: MODAL_Z_INDEX }}
      className="fixed inset-0 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm md:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 shadow-[0_25px_60px_rgba(0,0,0,0.4)] duration-300 animate-in fade-in zoom-in-95 md:max-w-xl md:rounded-3xl"
      >
        {/* Close sits above modal content so the phone image cannot steal clicks */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }}
          aria-label="Close advertisement"
          className="absolute top-3 right-3 z-[20] flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800 shadow-md transition-all hover:bg-gray-50 active:scale-95 cursor-pointer pointer-events-auto"
        >
          ✕
        </button>

        <div className="pointer-events-auto p-1 pt-2">
          <RegisterOnApp />
        </div>
      </div>
    </div>,
    document.body,
  );
}
