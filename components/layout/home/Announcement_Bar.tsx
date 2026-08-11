const announcements = [
  "Organic",
  "Free Shipping Over €50",
  "14-Day Money Back",
  "500+ Partner Farms",
  "Fair Trade",
];

function Item({ text }: { text: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap px-1">
      <span className="text-[11px] font-semibold tracking-wide sm:text-xs md:text-sm lg:text-base">
        {text}
      </span>
    </span>
  );
}

export default function AnnouncementBar() {
  // Duplicate list so the marquee loops seamlessly on small screens
  const mobileTrack = [...announcements, ...announcements];

  return (
    <div className="relative z-10 bg-black text-white">
      {/* Mobile / small tablet: scrolling strip so labels never crush together */}
      <div className="overflow-hidden py-2.5 md:hidden">
        <div className="animate-marquee flex w-max items-center gap-8 px-4">
          {mobileTrack.map((text, index) => (
            <span key={`${text}-${index}`} className="flex items-center gap-8">
              <Item text={text} />
              <span
                className="h-1 w-1 shrink-0 rounded-full bg-white/50"
                aria-hidden
              />
            </span>
          ))}
        </div>
      </div>

      {/* md+: static row with comfortable gaps */}
      <div className="container mx-auto hidden flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-3 md:flex lg:justify-around lg:gap-x-10 lg:py-4">
        {announcements.map((text) => (
          <Item key={text} text={text} />
        ))}
      </div>
    </div>
  );
}
