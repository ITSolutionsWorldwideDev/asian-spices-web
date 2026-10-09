"use client";

// components/layout/category/CategoryGuideSection.tsx

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cleanDashes } from "@/lib/category-helpers";

interface Section {
  title: string;
  description: string;
}

interface CategoryGuideSectionProps {
  sections: Section[];
  image?: string;
  categoryName: string;
  hideReadMore?: boolean;
}

export default function CategoryGuideSection({
  sections,
  hideReadMore = false,
}: CategoryGuideSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!sections || sections.length === 0) return null;

  return (
    <section className="w-full py-2 sm:py-3">
      <div className="flex flex-col gap-3 sm:gap-4">
        {sections.map((section, index) => {
          const isExpanded = expandedIndex === index;
          const displayTitle = cleanDashes(section.title);
          const displayDesc = cleanDashes(section.description);

          return (
            <div
              key={index}
              className="bg-gradient-to-b from-white to-[#faf8f5] border border-neutral-200/80 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] hover:border-neutral-300/80 transition-all overflow-hidden"
            >
              <div className="px-5 py-4 sm:px-6 sm:py-5">
                {/* Title + chevron row */}
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base sm:text-lg font-bold text-neutral-800 leading-snug">
                    {displayTitle}
                  </h2>

                  {!hideReadMore && displayDesc && (
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? "Collapse guide section" : "Expand guide section"}
                      className={`shrink-0 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200/80 flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-all duration-300 focus:outline-none active:scale-95 cursor-pointer ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <ChevronDown size={16} />
                    </button>
                  )}
                </div>

                {/* Description with soft bottom fade when collapsed */}
                {displayDesc && (
                  <div className="relative mt-2.5">
                    <div
                      className={`text-neutral-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line transition-all duration-300 ${
                        hideReadMore || isExpanded ? "" : "max-h-[50px] overflow-hidden"
                      }`}
                    >
                      <p>{displayDesc}</p>
                    </div>

                    {/* Soft fade overlay for collapsed text */}
                    {!hideReadMore && !isExpanded && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-6 h-8 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/80 to-transparent" />
                    )}

                    {/* Read more / Show less */}
                    {!hideReadMore && (
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        className="mt-2 inline-flex items-center gap-1.5 py-1 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-red-600 transition-colors focus:outline-none cursor-pointer"
                      >
                        <span>{isExpanded ? "Show less" : "Read more"}</span>
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-300 ${
                            isExpanded ? "rotate-180 text-red-600" : "text-neutral-400"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
