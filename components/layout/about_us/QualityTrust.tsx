import { Ban, CheckCircle2, Globe, Sprout } from "lucide-react";

const standards = [
  {
    title: "Organic",
    description:
      "Grown and processed without synthetic chemicals — pure from farm to jar.",
    icon: Sprout,
    iconClass: "text-emerald-600",
  },
  {
    title: "Additive-Free",
    description:
      "Free from additives and preservatives — nothing artificial, ever.",
    icon: Ban,
    iconClass: "text-red-500",
  },
  {
    title: "Quality-Checked",
    description:
      "Checked for freshness so every jar and pack tastes as intended.",
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
  },
  {
    title: "Responsibly Sourced",
    description:
      "Working closely with trusted growers and suppliers across Asia.",
    icon: Globe,
    iconClass: "text-sky-600",
  },
];

export default function QualityTrust() {
  return (
    <section className="bg-[#FDF9F3] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-[#C4A574]" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C4A574] sm:text-sm">
              Quality You Can Trust
            </p>
            <span className="h-px w-6 bg-[#C4A574]" aria-hidden />
          </div>

          <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-[#1A1A1A] sm:text-4xl lg:text-[2.65rem]">
            Organic & Additive-Free
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#666666] sm:text-base">
            We believe real flavor doesn&apos;t need help from artificial
            shortcuts. That&apos;s why every product we sell meets these four
            non-negotiable standards.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {standards.map(({ title, description, icon: Icon, iconClass }) => (
            <article
              key={title}
              className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2ECE4]">
                <Icon className={`h-6 w-6 ${iconClass}`} strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-base font-bold text-[#1A1A1A]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#666666]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
