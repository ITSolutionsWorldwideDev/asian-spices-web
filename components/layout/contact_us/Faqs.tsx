"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const FAQ_PAGE_SIZE = 6;

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(FAQ_PAGE_SIZE);

  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "You can track your order by logging into your account and viewing your order history. You'll also receive tracking info via email.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, you can return it for a full refund within 30 days of delivery.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes! We ship to over 50 countries worldwide. International shipping times vary by location, typically 7-14 business days.",
    },
    {
      question: "Are your spices organic?",
      answer:
        'Many of our spices are certified organic. Look for the "Organic" badge on product pages. All our spices are natural and free from artificial additives.',
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    {
      question: "How should I store my spices?",
      answer:
        "Store spices in airtight containers in a cool, dry place away from direct sunlight. Whole spices can last 2-3 years, while ground spices maintain peak flavor for 1-2 years.",
    },
    
    
    
    

  ];

  const visibleFaqs = faqs.slice(0, visibleCount);
  const allVisible = visibleCount >= faqs.length;
  const canShowLess = allVisible && faqs.length > FAQ_PAGE_SIZE;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + FAQ_PAGE_SIZE, faqs.length));
  };

  const handleShowLess = () => {
    setVisibleCount(FAQ_PAGE_SIZE);
    setOpenIndex(0);
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#1b0d07] font-serif">
        Frequently Asked Questions
      </h2>
      <div className="mt-3 mb-6 h-1 w-12 bg-orange-500 rounded-full" />

      <div className="divide-y divide-gray-200">
        {visibleFaqs.map((faq, index) => (
          <div key={index}>
            <button
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
        ))}
      </div>

      {(allVisible ? canShowLess : true) && (
        <div className="mt-4">
          {allVisible ? (
            <button
              type="button"
              onClick={handleShowLess}
              className="text-sm font-semibold text-orange-500 hover:underline cursor-pointer"
            >
              Show Less
            </button>
          ) : (
            <button
              type="button"
              onClick={handleShowMore}
              className="text-sm font-semibold text-orange-500 hover:underline cursor-pointer"
            >
              Show More
            </button>
          )}
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
