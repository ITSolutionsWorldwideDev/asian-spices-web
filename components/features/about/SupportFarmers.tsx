import Image from "next/image";

const cards = [
  {
    title: "Fairer Value for Their Hard Work",
    description:
      "We work to create better market access so farmers can receive a more meaningful return for the time, effort, and resources invested in growing quality spices.",
    image: "/assets/about/farmers/fairer-value.jpg",
  },
  {
    title: "Direct Access to New Markets",
    description:
      "We help connect farmers and their products with businesses and customers beyond traditional local markets, creating new opportunities to grow.",
    image: "/assets/about/farmers/new-markets.jpg",
  },
  {
    title: "More Opportunities to Grow",
    description:
      "Better market access can open doors to increased demand, new partnerships, and long-term business opportunities.",
    image: "/assets/about/farmers/opportunities.jpg",
  },
  {
    title: "Greater Visibility for Their Products",
    description:
      "Quality products deserve to be seen. Our platform helps bring farmers and their products closer to retailers, businesses, and consumers.",
    image: "/assets/about/farmers/visibility.jpg",
  },
  {
    title: "Supporting Sustainable Livelihoods",
    description:
      "By creating better commercial opportunities, we aim to contribute to stronger and more sustainable livelihoods for farming communities.",
    image: "/assets/about/farmers/livelihoods.jpg",
  },
  {
    title: "Building Long-Term Connections",
    description:
      "We focus on creating relationships between growers, suppliers, retailers, and customers that can support continued growth rather than one-time transactions.",
    image: "/assets/about/farmers/connections.jpg",
  },
];

export default function SupportFarmers() {
  return (
    // Yahan top padding ko bilkul minimum (pt-1 sm:pt-2 lg:pt-3) kar diya hai
    <section className="bg-white pt-1 pb-16 sm:pt-2 sm:pb-20 lg:pt-3 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-container text-center">
          <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] sm:text-4xl lg:text-[2.65rem]">
            How We Support Farmers
          </h2>
          <p className="mt-5 text-[15px] leading-[1.7] text-[#333] sm:text-base">
            At Asian Spices, we believe the people who grow our food should have
            better opportunities to benefit from their hard work. We aim to
            create a stronger connection between farmers and the market, helping
            their products reach more customers while creating opportunities for
            sustainable growth.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ title, description, image }) => (
            <article
              key={title}
              className="overflow-hidden rounded-[1.25rem] bg-[#FDF8F3]"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-serif text-[1.05rem] font-bold leading-snug text-[#1A1A1A]">
                  {title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#5C5C5C] sm:text-[13.5px]">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[1.15rem] border border-[#C9A06B] bg-[#FDF8F3] px-5 py-7 text-center sm:mt-12 sm:px-8 sm:py-8">
          <p className="font-serif text-[15px] leading-[1.7] text-[#1A1A1A] sm:text-[1.05rem] lg:text-[1.125rem]">
            <span className="font-bold">Our goal:</span> Help farmers turn their
            hard work into better opportunities, stronger market access, and a
            more sustainable future.
          </p>
        </div>
      </div>
    </section>
  );
}