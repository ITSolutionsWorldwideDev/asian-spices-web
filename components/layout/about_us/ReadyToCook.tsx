import Link from "next/link";

export default function ReadyToCook() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-3xl px-4 text-center sm:px-6">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-[#C0712C]" aria-hidden />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C0712C] sm:text-sm">
            Ready to Cook Authentically?
          </p>
          <span className="h-px w-6 bg-[#C0712C]" aria-hidden />
        </div>

        <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.2]">
          Bring the Authentic Taste of{" "}
          <span className="text-[#C0712C]">Asia</span> Into Your Kitchen
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-zinc-500 sm:text-base">
          Bring the authentic taste of Asia into your kitchen. Shop our full
          range of spices, blends, herbs, rice, and lentils today — or get in
          touch about wholesale pricing for your business.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/spices"
            className="inline-flex items-center justify-center rounded-full bg-[#C0712C] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_-5px_rgba(192,113,44,0.45)] transition hover:bg-[#a85f24]"
          >
            Shop Now
          </Link>
          <Link
            href="/partnerplatform"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-7 py-3.5 text-sm font-semibold text-[#C0712C] transition hover:bg-zinc-50"
          >
            Wholesale Enquiries
          </Link>
          <Link
            href="/recipes"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-7 py-3.5 text-sm font-semibold text-[#C0712C] transition hover:bg-zinc-50"
          >
            Explore Recipes
          </Link>
        </div>
      </div>
    </section>
  );
}
