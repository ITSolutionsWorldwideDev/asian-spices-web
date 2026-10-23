import Link from "next/link";
import { Home, Store, UtensilsCrossed, Utensils } from "lucide-react";

const audiences = [
  {
    title: "Home Cooks",
    description:
      "Recipes, inspiration & premium pantry staples delivered to your door.",
    icon: Home,
    iconClass: "text-orange-400",
  },
  {
    title: "Restaurants",
    description: "Bulk supply of authentic ingredients with consistent quality.",
    icon: UtensilsCrossed,
    iconClass: "text-amber-200",
  },
  {
    title: "Caterers",
    description: "Flexible wholesale orders to match your event calendar.",
    icon: Utensils,
    iconClass: "text-amber-400",
  },
  {
    title: "Retailers",
    description:
      "Stock our curated range in your store with competitive margins.",
    icon: Store,
    iconClass: "text-emerald-400",
  },
];

export default function ForEveryone() {
  return (
    <section className="bg-[#110C09] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:px-8">
        {/* Left copy */}
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-5 bg-[#D17D39]" aria-hidden />
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D17D39] sm:text-xs">
              For Home Cooks & Businesses Alike
            </p>
            <span className="h-px w-5 bg-[#D17D39]" aria-hidden />
          </div>

          <h2 className="mt-5 max-w-md font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
            Whatever the Size, the Standard Never Changes
          </h2>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#A09B97] sm:text-base">
            Asian Spices proudly serves both retail customers across the
            Netherlands looking to stock their home kitchens, and wholesale
            partners, restaurants, caterers, and retailers looking for a
            reliable, high-quality supply of authentic Asian ingredients at
            scale. Whatever the size of your order, our standard for quality
            never changes.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/spices"
              className="inline-flex items-center justify-center rounded-full bg-[#D17D39] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#c06f30]"
            >
              Shop Retail
            </Link>
            <Link
              href="/partnerplatform"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Wholesale Enquiries
            </Link>
          </div>
        </div>

        {/* Right audience cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {audiences.map(({ title, description, icon: Icon, iconClass }) => (
            <article
              key={title}
              className="rounded-2xl bg-[#1D1714] p-5 sm:p-6"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${iconClass}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A09B97]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
