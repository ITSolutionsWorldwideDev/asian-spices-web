"use client";

// components/layout/category/CategoryGuideSection.tsx

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Section {
  title: string;
  description: string;
}

interface CategoryGuideSectionProps {
  sections: Section[];
  image?: string;
  categoryName: string;
}

export default function CategoryGuideSection({
  sections,
}: CategoryGuideSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="container mx-auto px-5 py-10">
      <div className="flex flex-col gap-5">
        {sections.map((section, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className="bg-white border border-neutral-100 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              <div className="px-6 pt-6 pb-5">
                {/* Badge */}
                <span className="inline-flex items-center border border-[#f2ab92] text-[#d95325] text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase mb-3">
                  Guide
                </span>

                {/* Title + chevron row */}
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg md:text-xl font-bold text-[#111111] leading-snug">
                    {section.title}
                  </h2>

                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    aria-expanded={isExpanded}
                    className={`shrink-0 w-8 h-8 rounded-full bg-[#fff4ee] flex items-center justify-center text-[#ff7733] transition-transform duration-300 focus:outline-none ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Description — 2-line clamp when collapsed, full when expanded */}
                <p
                  className={`mt-3 text-[#555555] text-xs md:text-sm leading-relaxed whitespace-pre-line transition-all duration-300 ${
                    isExpanded ? "" : "line-clamp-2"
                  }`}
                >
                  {section.description}
                </p>

                {/* Read more / Show less */}
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
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
