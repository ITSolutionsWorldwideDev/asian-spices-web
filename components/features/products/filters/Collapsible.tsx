// apps/web/components/layout/product_filter_search/Collapsible.tsx
"use client";

import { useState } from "react";

export default function Collapsible({ title, children }: any) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-6 border-b pb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center font-semibold"
      >
        {title}
        <span className={`transition ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}