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
    <section className="w-full py-6">
      <div className="flex flex-col gap-5">
        {sections.map((section, index) => {
          const isExpanded = expandedIndex === index;
          const displayTitle = cleanDashes(section.title);
          const displayDesc = cleanDashes(section.description);

          return (
            <div
              key={index}
              className="bg-white border border-neutral-100 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              <div className="px-6 pt-6 pb-5">
                {/* Title + chevron row */}
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg md:text-xl font-bold text-[#111111] leading-snug">
                    {displayTitle}
                  </h2>

                  {!hideReadMore && displayDesc && (
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      aria-expanded={isExpanded}
                      className={`shrink-0 w-8 h-8 rounded-full bg-[#fff4ee] flex items-center justify-center text-[#ff7733] transition-transform duration-300 focus:outline-none ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <ChevronDown size={16} />
                    </button>
                  )}
                </div>

                {/* Description — 2-line clamp when collapsed, full when expanded or hideReadMore */}
                {displayDesc && (
                  <>
                    <p
                      className={`mt-3 text-[#555555] text-xs md:text-sm leading-relaxed whitespace-pre-line transition-all duration-300 ${
                        hideReadMore || isExpanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {displayDesc}
                    </p>

                    {/* Read more / Show less */}
                    {!hideReadMore && (
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        className="mt-3 inline-flex items-center gap-1 text-[#d95325] text-xs font-semibold hover:text-[#b84320] transition-colors focus:outline-none"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
