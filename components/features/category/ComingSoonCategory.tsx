// apps/web/components/ui/ComingSoonCategory.tsx

import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";

type ComingSoonCategoryProps = {
  title?: string;
  description?: string;
  features?: [string, string, string];
};

export default function ComingSoonCategory({
  title = "Kitchen Appliances & Cooking Tools",
  description =
    "We're preparing an exciting collection of premium kitchen appliances designed to make cooking easier, faster, and more enjoyable.",
  features = ["Smart Cookware", "Modern Appliances", "Premium Quality"],
}: ComingSoonCategoryProps) {
  return (
    <section className="container mx-auto px-4 py-10 md:py-16">
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border-2
          border-orange-300
          bg-gradient-to-br
          from-orange-100
          via-white
          to-amber-100
          px-6
          py-16
          md:px-12
          md:py-20
          text-center
          shadow-lg
        "
      >
        <div className="absolute top-0 left-0 h-56 w-56 rounded-full bg-orange-400/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-amber-400/30 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto inline-flex items-center gap-3 rounded-full bg-orange-500 px-6 py-3 text-base font-bold uppercase tracking-wider text-white shadow-md sm:text-lg">
            <Clock3 size={22} className="shrink-0" />
            Launching Soon
          </div>

          <p
            className="
              mt-8
              text-6xl
              font-black
              uppercase
              leading-none
              tracking-tight
              text-orange-600
              sm:text-7xl
              md:text-8xl
              lg:text-9xl
              drop-shadow-sm
            "
          >
            Coming Soon
          </p>

          <h2 className="mt-8 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            {title}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-slate-600 sm:text-lg">
            {description}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl bg-white p-6 text-base font-semibold text-slate-800 shadow-sm"
              >
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
