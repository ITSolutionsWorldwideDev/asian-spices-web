// RegisterOnAppModal.tsx

"use client";

import { useEffect, useState } from "react";
import RegisterOnApp from "./RegisterOnApp";

export default function RegisterOnAppModal() {
  const [open, setOpen] = useState(false);

  const STORAGE_KEY = "app-modal-dismissed";

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);

    if (!dismissed) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeModal = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-md
            p-4
        "
    >
      <div
        className="
            animate-in
            fade-in
            zoom-in-95
            duration-300
            relative
            w-full
            max-w-6xl
            overflow-hidden
            rounded-3xl
            bg-gradient-to-r
            from-orange-600
            to-orange-400
            shadow-[0_20px_80px_rgba(0,0,0,0.35)]
        "
      >
        <button
          onClick={closeModal}
          className="
                absolute
                top-5
                right-5
                z-50
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white
                text-xl
                font-bold
                shadow-lg
                hover:scale-105
                transition
            "
        >
          ✕
        </button>
        <RegisterOnApp />
      </div>
    </div>
  );
}
