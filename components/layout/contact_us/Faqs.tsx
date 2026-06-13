import React from "react";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

const Faqs = () => {
  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "You can track your order by logging into your account and viewing your order history. You'll also receive tracking information via email once your order ships.",
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
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <HelpCircle className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {faq.question}
            </h3>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* Browse Products Button */}
      <button className="w-full mt-8 bg-white border-2 border-gray-200 hover:border-orange-600 hover:text-orange-600 text-gray-700 font-semibold py-4 rounded-lg transition-all duration-200 cursor-pointer">
        <Link href="/">Browse Products</Link>
      </button>
    </div>
  );
};

export default Faqs;
