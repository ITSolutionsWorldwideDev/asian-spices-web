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
  guideSections: GuideSection[];
}

/**
 * Splits category guide content between the top hero banner and Section 2:
 * - Banner heading: e.g. "Explore Beverages" (from section title)
 * - Banner text: 1st paragraph of description (cleaned of dashes)
 * - Section 2 guide card: 2nd paragraph starts with heading (e.g. "Browse Beverages by Type:")
 *   and the remaining body/bullets become the collapsible guide description.
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
      guideSections: [],
    };
  }

  // 1st paragraph moves into the top hero banner
  const bannerText = cleanDashes(parts[0]);

  // Remaining paragraphs go into Section 2 (CategoryGuideSection)
  const remainingText = parts.slice(1).join("\n\n").trim();
  const guideSections: GuideSection[] = [];

  if (remainingText) {
    const firstNewline = remainingText.indexOf("\n");
    if (firstNewline !== -1) {
      const headingLine = remainingText.slice(0, firstNewline).trim();
      const bodyLines = remainingText.slice(firstNewline + 1).trim();

      guideSections.push({
        title: cleanDashes(headingLine),
        description: cleanDashes(bodyLines),
      });
    } else {
      guideSections.push({
        title: cleanDashes(remainingText),
        description: "",
      });
    }
  }

  return {
    bannerHeading,
    bannerText,
    guideSections,
  };
}
