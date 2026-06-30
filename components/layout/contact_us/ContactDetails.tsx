import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";

const contactCards = [
  {
    icon: Mail,
    label: "CONTACT US",
    value: "support@asianspices.com",
    subtext: "Respond within 24 hours",
    href: "mailto:support@asianspices.com",
  },
  {
    icon: Phone,
    label: "CALL US",
    value: "+1 (555) 123-4567",
    subtext: "Mon-Fri 10AM-5PM EST",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "VISIT US",
    value: "123 Spice Street, NY 10001",
    subtext: "By appointment only",
  },
  {
    icon: Clock,
    label: "BUSINESS HOURS",
    value: "Mon – Fri: 10AM – 6PM",
    subtext: "Weekend: Closed",
  },
];

export default function ContactDetails() {
  return (
    <div className="relative z-20 -mt-20 md:-mt-24 container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {contactCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="bg-white rounded-t-2xl shadow-lg px-6 py-8 text-center border-t-4 border-orange-500"
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Icon className="h-5 w-5 text-orange-500" />
              </div>

              <p className="mb-2 text-xs font-bold tracking-wide text-orange-500">
                {card.label}
              </p>

              {card.href ? (
                <Link
                  href={card.href}
                  className="mb-2 block text-base font-bold text-gray-900 hover:text-orange-600"
                >
                  {card.value}
                </Link>
              ) : (
                <p className="mb-2 text-base font-bold text-gray-900">
                  {card.value}
                </p>
              )}

              <p className="text-sm text-gray-500">{card.subtext}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
