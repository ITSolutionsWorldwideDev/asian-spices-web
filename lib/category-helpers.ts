// lib/category-helpers.ts

/**
 * Cleans unwanted em-dashes (—), en-dashes (–), double dashes (--), and double underscores (__)
 * from text while preserving line breaks and single hyphens in compound words (e.g. "gluten-free").
 */
export function cleanDashes(text: string): string {
  if (!text) return "";
  return text
    .replace(/[—–]/g, " ")
    .replace(/--+/g, " ")
    .replace(/__+/g, " ")
    .replace(/[^\S\r\n]{2,}/g, " ") // Collapse horizontal whitespace only
    .replace(/\s+([,.:;?!])/g, "$1") // Clean up any spacing before punctuation
    .trim();
}

export interface GuideSection {
  title: string;
  description: string;
}

export interface ParsedCategoryGuide {
  bannerHeading: string;
  bannerText: string;
  extendedText: string;
  guideSections: GuideSection[];
}

/**
 * Parses category guide content:
 * - Banner heading: e.g. "Explore Beverages" (from section title)
 * - Banner text: 1st paragraph of description (cleaned of dashes)
 * - Extended text: Remaining paragraphs (e.g. "Browse Beverages by Type: ...") for Read More toggle
 */
export function parseCategoryGuide(
  content: {
    sections?: { title: string; description: string }[];
    image?: string;
    faqs?: { question: string; answer: string }[];
  } | null,
  defaultHeading: string,
): ParsedCategoryGuide {
  if (!content || !content.sections || content.sections.length === 0) {
    return {
      bannerHeading: defaultHeading,
      bannerText: "",
      extendedText: "",
      guideSections: [],
    };
  }

  const firstSection = content.sections[0];
  const bannerHeading = firstSection.title || `Explore ${defaultHeading}`;

  const rawDescription = firstSection.description || "";
  const parts = rawDescription.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  if (parts.length === 0) {
    return {
      bannerHeading,
      bannerText: "",
      extendedText: "",
      guideSections: [],
    };
  }

  // 1st paragraph moves into the top hero banner
  const bannerText = cleanDashes(parts[0]);

  // Remaining paragraphs become extended text (joined with hero via Read More)
  const remainingText = cleanDashes(parts.slice(1).join("\n\n").trim());

  return {
    bannerHeading,
    bannerText,
    extendedText: remainingText,
    guideSections: [],
  };
}
