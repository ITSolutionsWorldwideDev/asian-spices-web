"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import faqsData from "./faqsData.json";

const FAQ_PAGE_SIZE = 6;

type FaqItem = {
  question: string;
  answer: string;
};

type SectionId = "general" | "category" | "chatbot";

const SECTION_ORDER: SectionId[] = ["general", "category", "chatbot"];

const Faqs = () => {
  const sections = faqsData.sections;
  const [activeSection, setActiveSection] = useState<SectionId>("general");
  const [activeSubId, setActiveSubId] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(FAQ_PAGE_SIZE);

  const sectionMeta = sections[activeSection];

  const subGroups = useMemo(() => {
    if (activeSection === "category") {
      return sections.category.categories.map((c) => ({
        id: c.id,
        name: c.name,
        count: c.faqs.length,
      }));
    }
    if (activeSection === "chatbot") {
      return sections.chatbot.topics.map((t) => ({
        id: t.id,
        name: t.name,
        count: t.faqs.length,
      }));
    }
    return [];
  }, [activeSection, sections]);

  const filteredFaqs = useMemo((): FaqItem[] => {
    if (activeSection === "general") {
      return sections.general.faqs;
    }

    if (activeSection === "category") {
      const cats = sections.category.categories;
      if (activeSubId === "all") {
        return cats.flatMap((c) => c.faqs);
      }
      return cats.find((c) => c.id === activeSubId)?.faqs ?? [];
    }

    const topics = sections.chatbot.topics;
    if (activeSubId === "all") {
      return topics.flatMap((t) => t.faqs);
    }
    return topics.find((t) => t.id === activeSubId)?.faqs ?? [];
  }, [activeSection, activeSubId, sections]);

  const visibleFaqs = filteredFaqs.slice(0, visibleCount);
  const allVisible = visibleCount >= filteredFaqs.length;
  const canShowLess = allVisible && filteredFaqs.length > FAQ_PAGE_SIZE;

  const resetListState = () => {
    setVisibleCount(FAQ_PAGE_SIZE);
    setOpenIndex(0);
  };

  const handleSectionChange = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    setActiveSubId("all");
    resetListState();
  };

  const handleSubChange = (subId: string) => {
    setActiveSubId(subId);
    resetListState();
  };

  const handleShowMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + FAQ_PAGE_SIZE, filteredFaqs.length)
    );
  };

  const handleShowLess = () => {
    setVisibleCount(FAQ_PAGE_SIZE);
    setOpenIndex(0);
  };

  const totalForSection = (id: SectionId) => {
    if (id === "general") return sections.general.faqs.length;
    if (id === "category") {
      return sections.category.categories.reduce(
        (sum, c) => sum + c.faqs.length,
        0
      );
    }
    return sections.chatbot.topics.reduce((sum, t) => sum + t.faqs.length, 0);
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#1b0d07] font-serif">
        {faqsData.title}
      </h2>
      <div className="mt-3 mb-6 h-1 w-12 bg-orange-500 rounded-full" />

      {/* Primary: General / Category / Chatbot */}
      <div
        className="mb-4 flex flex-wrap gap-x-1 gap-y-2 border-b border-stone-200"
        role="tablist"
        aria-label="FAQ sections"
      >
        {SECTION_ORDER.map((id) => {
          const active = activeSection === id;
          const label = sections[id].name;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleSectionChange(id)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                active
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {label}
              <span className="ml-1 font-normal text-gray-400">
                ({totalForSection(id)})
              </span>
            </button>
          );
        })}
      </div>

      {sectionMeta.description ? (
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">
          {sectionMeta.description}
        </p>
      ) : null}

      {/* Secondary: product category or chatbot topic */}
      {subGroups.length > 0 ? (
        <div className="mb-6">
          <label htmlFor="faq-subgroup" className="sr-only">
            {activeSection === "category"
              ? "Product category"
              : "Chatbot topic"}
          </label>
          <select
            id="faq-subgroup"
            value={activeSubId}
            onChange={(e) => handleSubChange(e.target.value)}
            className="w-full max-w-md rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">
              All{" "}
              {activeSection === "category" ? "categories" : "topics"} (
              {totalForSection(activeSection)})
            </option>
            {subGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.count})
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="divide-y divide-gray-200">
        {visibleFaqs.length === 0 ? (
          <p className="py-4 text-sm text-gray-500">
            No questions in this section.
          </p>
        ) : (
          visibleFaqs.map((faq, index) => (
            <div key={`${activeSection}-${activeSubId}-${index}`}>
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full flex items-center justify-between gap-3 text-left py-4 cursor-pointer"
              >
                <h3 className="text-sm md:text-base font-bold text-gray-900">
                  {faq.question}
                </h3>

                {openIndex === index ? (
                  <ChevronUp className="w-4 h-4 text-orange-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-orange-500 shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <p className="pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {filteredFaqs.length > FAQ_PAGE_SIZE && (
        <div className="mt-4">
          {allVisible && canShowLess ? (
            <button
              type="button"
              onClick={handleShowLess}
              className="text-sm font-semibold text-orange-500 hover:underline cursor-pointer"
            >
              Show Less
            </button>
          ) : !allVisible ? (
            <button
              type="button"
              onClick={handleShowMore}
              className="text-sm font-semibold text-orange-500 hover:underline cursor-pointer"
            >
              Show More
            </button>
          ) : null}
        </div>
      )}

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-orange-500 text-sm font-semibold hover:underline"
        >
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default Faqs;
