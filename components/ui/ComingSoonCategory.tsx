// apps/web/components/ui/ComingSoonCategory.tsx

import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";

export default function ComingSoonCategory() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-orange-100
          bg-gradient-to-br
          from-orange-50
          via-white
          to-amber-50
          px-6
          py-16
          md:px-12
          text-center
        "
      >
        {/* Decorative Blobs */}

        <div className="absolute top-0 left-0 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />

        {/* Badge */}

        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold text-orange-700">
          <Clock3 size={16} />
          Coming Soon
        </div>

        {/* Heading */}

        <h1 className="mt-6 text-4xl font-bold text-slate-900 md:text-5xl">
          Kitchen Appliances
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          We're preparing an exciting collection of premium kitchen appliances
          designed to make cooking easier, faster, and more enjoyable.
        </p>

        {/* Features */}

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            🍳 Smart Cookware
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            🔥 Modern Appliances
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            ✨ Premium Quality
          </div>
        </div>

        {/* CTA */}

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              px-6
              py-3
              font-medium
              hover:bg-slate-50
            "
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <Link
            href="/signup"
            className="
              rounded-xl
              bg-gradient-to-r
              from-orange-500
              to-amber-500
              px-6
              py-3
              font-semibold
              text-white
              shadow-lg
              hover:shadow-xl
            "
          >
            Notify Me When Available
          </Link>
        </div>
      </div>
    </section>
  );
}