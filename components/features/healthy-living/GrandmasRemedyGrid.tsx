"use client";

import { useState } from "react";

interface RemedySection {
  title: string;
  description: string;
}

export default function GrandmasRemedyGrid({
  sections,
}: {
  sections: RemedySection[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeSection = activeIndex !== null ? sections[activeIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl border border-neutral-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-md"
          >
            <div>
              <span className="inline-block border border-[#f2ab92] text-[#d95325] text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full mb-3">
                REMEDY {index + 1}
              </span>
              <h3 className="text-base font-bold text-neutral-900 mb-2 leading-snug">
                {section.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="mt-4 pt-3 border-t border-neutral-100 text-[#d95325] font-semibold text-xs flex items-center justify-between hover:underline"
            >
              <span>View Recipe</span>
              <span className="text-xs">▼</span>
            </button>
          </div>
        ))}
      </div>

      {activeSection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            >
              ✕
            </button>

            <span className="inline-block border border-[#f2ab92] text-[#d95325] text-[10px] font-bold tracking-wider px-3 py-1 rounded-full mb-3">
              REMEDY {(activeIndex ?? 0) + 1}
            </span>
            <h3 className="text-lg font-bold text-neutral-900 mb-4 pr-8">
              {activeSection.title}
            </h3>
            <div className="whitespace-pre-line rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-600">
              {activeSection.description}
            </div>
          </div>
        </div>
      )}
    </>
  );
}