"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, ShoppingBag, ShieldCheck } from "lucide-react";

type Block =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | {
      type: "contactCards";
      cards: { icon: string; label: string; value: string }[];
    };

interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

interface SupportInfo {
  heading: string;
  text: string;
  email: string;
}

interface TermsContentProps {
  sections: Section[];
  support: SupportInfo;
}

const iconMap: Record<string, React.ElementType> = {
  mail: Mail,
  orders: ShoppingBag,
  privacy: ShieldCheck,
  phone: Phone,
};

function ContactCards({
  cards,
}: {
  cards: { icon: string; label: string; value: string }[];
}) {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card) => {
        const Icon = iconMap[card.icon] || Mail;
        return (
          <div
            key={card.label}
            className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100">
              <Icon className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                {card.label}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="mt-4 text-[15px] leading-relaxed text-gray-600">
          {block.text}
        </p>
      );
    case "subheading":
      return (
        <h3
          key={index}
          className="mt-6 mb-1 text-sm font-bold text-gray-900"
        >
          {block.text}
        </h3>
      );
    case "list":
      return (
        <ul
          key={index}
          className="mt-3 space-y-2 pl-5 text-[15px] leading-relaxed text-gray-600"
        >
          {block.items.map((item, i) => (
            <li key={i} className="list-disc marker:text-orange-400">
              {item}
            </li>
          ))}
        </ul>
      );
    case "contactCards":
      return <ContactCards key={index} cards={block.cards} />;
    default:
      return null;
  }
}

export default function TermsContent({ sections, support }: TermsContentProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-120px 0px -70% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="bg-[#fdf6ef]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          {/* TABLE OF CONTENTS */}
          <aside className="lg:sticky lg:top-24 h-max">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              Table of Contents
            </p>

            <nav className="space-y-1">
              {sections.map((section) => {
                const isActive = activeId === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleScrollTo(section.id)}
                    className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                      isActive
                        ? "bg-orange-500 font-semibold text-white"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {section.title}
                  </button>
                );
              })}
            </nav>

            {/* Support card */}
            <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-bold text-orange-600">
                {support.heading}
              </p>
              <p className="mt-1 text-xs text-gray-600">{support.text}</p>
              <a
                href={`mailto:${support.email}`}
                className="mt-2 inline-block text-xs font-semibold text-orange-600 hover:underline"
              >
                {support.email}
              </a>
            </div>
          </aside>

          {/* CONTENT */}
          <div>
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="mb-12 scroll-mt-28"
              >
                <div className="flex items-center gap-3">
                  <span className="h-6 w-1 rounded-full bg-orange-500" />
                  <h2 className="text-2xl font-bold text-gray-900 font-serif">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-2">
                  {section.blocks.map((block, i) => renderBlock(block, i))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
