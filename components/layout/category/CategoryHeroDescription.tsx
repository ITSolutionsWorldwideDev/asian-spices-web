"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CategoryHeroDescriptionProps {
  initialText: string;
  extendedText?: string;
}

export default function CategoryHeroDescription({
  initialText,
  extendedText,
}: CategoryHeroDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!initialText && !extendedText) return null;

  return (
    <div className="mt-1.5 max-w-4xl lg:max-w-5xl mx-auto text-center">
      {/* 1. Initial Hero Paragraph */}
      {initialText && (
        <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed font-normal">
          {initialText}
        </p>
      )}

      {/* 2. Extended Content (Browse / Bullet items) */}
      {extendedText && isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-left sm:text-center text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed space-y-2.5 transition-all">
          {extendedText.split(/\n\s*\n/).map((paragraph, pIdx) => {
            const lines = paragraph.split("\n").map((l) => l.trim()).filter(Boolean);
            return (
              <div key={pIdx} className="space-y-1">
                {lines.map((line, lIdx) => {
                  const isBullet = line.startsWith("•") || line.startsWith("-");
                  const isSubheading =
                    !isBullet && (line.endsWith(":") || (lines.length > 1 && lIdx === 0));

                  if (isSubheading) {
                    return (
                      <p
                        key={lIdx}
                        className="font-semibold text-gray-900 mt-2.5 first:mt-0"
                      >
                        {line}
                      </p>
                    );
                  }

                  if (isBullet) {
                    return (
                      <p
                        key={lIdx}
                        className="text-gray-700 pl-2 sm:pl-0"
                      >
                        {line}
                      </p>
                    );
                  }

                  return (
                    <p key={lIdx} className="text-gray-700">
                      {line}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Read More / Show Less Button */}
      {extendedText && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50/70 rounded-full transition-colors cursor-pointer select-none"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? "Show less" : "Read more"}</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      )}
    </div>
  );
}
