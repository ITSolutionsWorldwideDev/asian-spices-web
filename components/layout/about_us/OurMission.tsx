export default function OurMission() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left: mission copy */}
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#C8752D]" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C8752D] sm:text-sm">
              Our Mission
            </p>
            <span className="h-px w-6 bg-[#C8752D]" aria-hidden />
          </div>

          <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.15]">
            Preserving Authenticity.
            <br />
            Making It Accessible.
          </h2>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-zinc-600 sm:text-base">
            <p>
              Our mission is simple — preserve the authenticity of Asian cuisine
              while making high-quality ingredients accessible to everyone.
            </p>
            <p>
              Every product in our collection is carefully selected for
              freshness, purity, and genuine flavor — the kind that turns an
              ordinary meal into a memorable one. Whether you&apos;re recreating
              a cherished family recipe or discovering Asian cooking for the
              first time, we make sure the ingredients never get in the way of
              the experience.
            </p>
          </div>
        </div>

        {/* Right: quote card */}
        <aside className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#C8752D] to-[#a85f24] p-8 shadow-[0_25px_50px_-12px_rgba(168,95,36,0.45)] sm:p-10">
          <span
            className="pointer-events-none absolute left-5 top-2 select-none font-serif text-[7rem] leading-none text-white/15 sm:left-7 sm:text-[8.5rem]"
            aria-hidden
          >
            “
          </span>

          <p className="relative z-10 mt-8 font-serif text-xl font-semibold leading-relaxed text-white sm:mt-10 sm:text-2xl sm:leading-snug">
            Real flavor doesn&apos;t need help from artificial shortcuts. When
            you buy from Asian Spices, you&apos;re getting the ingredient in its
            truest form — not a diluted imitation.
          </p>

          <div className="relative z-10 mt-10 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
              AS
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Asian Spices Team
              </p>
              <p className="text-xs text-white/80">Amsterdam, Netherlands</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
