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

  // Prevent background scrolling while the advertisement modal is active
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

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
      onClick={closeModal} // Closes modal when user clicks backdrop
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/60
        backdrop-blur-sm
        p-4 md:p-6
      "
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the modal from closing it
        className="
          animate-in
          fade-in
          zoom-in-95
          duration-300
          relative
          w-full
          max-w-md md:max-w-xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl md:rounded-3xl
          bg-gradient-to-br
          from-orange-600
          to-orange-500
          shadow-[0_25px_60px_rgba(0,0,0,0.4)]
        "
      >
        {/* Close Button - repositioned slightly for tighter padding */}
        <button
          onClick={closeModal}
          aria-label="Close Advertisement"
          className="
            absolute
            top-4
            right-4
            z-50
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            text-gray-800
            text-sm
            font-bold
            shadow-md
            hover:bg-gray-50
            active:scale-95
            transition-all
            cursor-pointer
          "
        >
          ✕
        </button>

        {/* Outer wrapper to fix inner spacing overflow bugs */}
        <div className="p-1">
          <RegisterOnApp />
        </div>
      </div>
    </div>
  );
}

/* "use client";

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
} */
