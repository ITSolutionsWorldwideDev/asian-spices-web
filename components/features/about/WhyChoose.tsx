import {
  BookOpen,
  Heart,
  Package,
  Sparkles,
  Sprout,
  Truck,
} from "lucide-react";

const reasons = [
  {
    title: "Authentic sourcing",
    description: "Authentic ingredients, sourced with care from trusted growers",
    icon: Sparkles,
    iconClass: "text-amber-600",
  },
  {
    title: "Organic & additive-free",
    description: "Organic, additive-free products in every order",
    icon: Sprout,
    iconClass: "text-emerald-600",
  },
  {
    title: "Retail & wholesale",
    description: "Retail & wholesale options for kitchens of every size",
    icon: Package,
    iconClass: "text-amber-700",
  },
  {
    title: "Fast Netherlands delivery",
    description: "Fast, reliable delivery across the Netherlands",
    icon: Truck,
    iconClass: "text-orange-500",
  },
  {
    title: "Recipes included free",
    description:
      "Recipes and cooking guidance included, not sold separately",
    icon: BookOpen,
    iconClass: "text-zinc-700",
  },
  {
    title: "Tradition, modern standards",
    description:
      "A brand built on tradition — run with modern standards",
    icon: Heart,
    iconClass: "text-red-500",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-[#F7F6F3] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-[#C8752D]" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C8752D] sm:text-sm">
              Why Choose Asian Spices
            </p>
            <span className="h-px w-6 bg-[#C8752D]" aria-hidden />
          </div>

          <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl lg:text-[2.5rem]">
            Six Reasons Our Customers Keep Coming Back
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {reasons.map(({ title, description, icon: Icon, iconClass }) => (
            <article
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2ECE4] ${iconClass}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-zinc-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
