import Image from "next/image";

const features = [
  {
    title: "100% Organic",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-linear-to-b from-green-400 to-green-600",
    icon: "Vector (1).png",
  },
  {
    title: "Premium Quality",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-linear-to-b from-amber-300 to-orange-500",
    icon: "fluent_premium-12-filled.png",
  },
  {
    title: "Fast Delivery",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-linear-to-b from-sky-400 to-blue-600",
    icon: "material-symbols_delivery-truck-speed-rounded.png",
  },
  {
    title: "Quality Guarantee",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-linear-to-b from-violet-400 to-purple-600",
    icon: "mingcute_medal-fill.png",
  },
  {
    title: "Fair Trade",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-linear-to-b from-pink-400 to-rose-500",
    icon: "hugeicons_trade-up.png",
  },
  {
    title: "Fresh & Potent",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-linear-to-b from-orange-500 to-red-600",
    icon: "mdi_thunder.png",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="overflow-visible pt-10 pb-24 sm:pt-12 sm:pb-28 md:pt-14 md:pb-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
          {/* Left — 2×3 feature cards */}
          <div className="order-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:order-1">
            {features.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3.5 rounded-2xl bg-white px-4 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-[52px] sm:w-[52px] ${item.iconBg}`}
                >
                  <Image
                    src={`/assets/home/why_choose_us/${item.icon}`}
                    alt={item.title}
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain brightness-0 invert"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold leading-tight text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-snug text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — matches left height on desktop; on mobile shown first without huge empty gap */}
          <div className="relative order-1 mx-auto mb-20 w-full max-w-[360px] sm:mb-24 sm:max-w-[400px] lg:order-2 lg:mx-0 lg:mb-0 lg:max-w-none">
            {/* Amber plate behind */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl bg-[#e8b86d] rotate-[7deg]"
            />

            {/* Black card — compact height on mobile to eliminate dead space; stretches on desktop */}
            <div className="relative z-10 flex h-[200px] flex-col overflow-hidden rounded-2xl bg-neutral-950 shadow-xl sm:h-[220px] lg:h-full lg:min-h-0">
              <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
                <Image
                  src="/assets/home/collections/collection-bg.webp"
                  alt="Decorative spice pattern with star anise, cloves, and peppercorns"
                  fill
                  sizes="400px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>

              <div className="relative z-10 px-5 pt-6 text-center sm:pt-8 lg:pt-12">
                <h2 className="text-2xl font-bold leading-[1.15] sm:text-3xl lg:text-[2.15rem]">
                  <span className="block text-orange-400">Why Choose</span>
                  <span className="block text-white">Asian Spices</span>
                </h2>
              </div>

              <div className="flex-1" aria-hidden />
            </div>

            {/* Only the spice image hangs below the black card */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex translate-y-[42%] justify-center">
              <Image
                src="/assets/home/why_choose_us/e901a8e43e221c4b953024f51bc6d8ba79e7809c.png"
                alt="Assortment of spices"
                width={640}
                height={520}
                className="h-auto w-[92%] max-w-[380px] object-contain sm:w-[95%] sm:max-w-[400px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
