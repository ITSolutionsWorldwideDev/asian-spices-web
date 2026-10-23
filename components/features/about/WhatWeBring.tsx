import Image from "next/image";

const topRow = [
  {
    title: "A Better Marketplace to Grow",
    description:
      "We provide businesses with a dedicated platform to discover, source, and sell quality Asian products.",
    image: "/assets/about/business_owners/marketplace.jpg",
    alt: "Glass jars filled with colorful Asian spices on a wooden counter",
  },
  {
    title: "More Sales Opportunities",
    description:
      "Our platform helps businesses reach new customers and explore additional sales channels without having to build everything from scratch.",
    image: "/assets/about/business_owners/sales.jpg",
    alt: "Woman packing spice products into a box in a specialty spice shop",
  },
  {
    title: "Access to New Customers",
    description:
      "We create opportunities for local shops, retailers, online sellers, and other businesses to connect with customers looking for authentic Asian products.",
    image: "/assets/about/business_owners/customers.jpg",
    alt: "Group of customers browsing spice products together",
  },
  {
    title: "Better Product Access",
    description:
      "Businesses can discover a range of spices and related products in one convenient marketplace, making sourcing easier and more efficient.",
    image: "/assets/about/business_owners/product-access.jpg",
    alt: "Woven baskets filled with star anise, cinnamon sticks, and chili powder",
  },
];

const bottomRow = [
  {
    title: "Opportunities Beyond the Local Market",
    description:
      "We help businesses expand their reach and connect with a wider customer base across the European market.",
    image: "/assets/about/business_owners/beyond-local.jpg",
    alt: "Cargo ship carrying shipping containers across the sea",
  },
  {
    title: "A Platform Built for Growth",
    description:
      "Whether you are a small local shop, an online seller, or a growing retailer, Asian Spices provides opportunities to expand your product range and reach new markets.",
    image: "/assets/about/business_owners/platform-growth.jpg",
    alt: "Fresh herbs, green cardamom pods, and sliced ginger on a wooden surface",
  },
  {
    title: "Simpler Business Operations",
    description:
      "From discovering products to ordering and connecting with customers, we aim to reduce complexity and make everyday business easier.",
    image: "/assets/about/business_owners/operations.jpg",
    alt: "Business owner using a tablet in a modern spice shop",
  },
];

function BenefitCard({
  title,
  description,
  image,
  alt,
}: {
  title: string;
  description: string;
  image: string;
  alt: string;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[#EDE8DF] bg-[#FDF8F3] p-3.5 shadow-[0_8px_24px_-12px_rgba(40,30,20,0.12)] sm:p-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[0.9rem]">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col px-0.5 pb-1 pt-3.5 sm:pt-4">
        <h3 className="font-serif text-[1.05rem] font-bold leading-snug text-[#1A1A1A] sm:text-[1.1rem]">
          {title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-[#5C5C5C] sm:text-[13.5px]">
          {description}
        </p>
      </div>
    </article>
  );
}

export default function WhatWeBring() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "url('/assets/about/business_owners/leaf-watermark.svg')",
          backgroundSize: "420px 420px",
          backgroundRepeat: "repeat",
        }}
        aria-hidden
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold leading-tight text-[#1A1A1A] sm:text-4xl lg:text-[2.65rem]">
            What We Bring to Business Owners
          </h2>
          <p className="mx-auto mt-5 max-w-7xl text-[15px] leading-[1.7] text-[#333333] sm:text-base lg:text-[17px] lg:leading-[1.65]">
            We understand that running a business is about more than finding
            products. It is about finding the right products, reaching the right
            customers, controlling costs, and finding opportunities to grow.
            Asian Spices is designed to make that process simpler by giving
            small businesses and retailers access to a growing marketplace for
            quality Asian spices and products.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {topRow.map((card) => (
            <BenefitCard key={card.title} {...card} />
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:mt-5 lg:grid-cols-3 lg:gap-5">
          {bottomRow.map((card) => (
            <BenefitCard key={card.title} {...card} />
          ))}
        </div>

        <div className="mt-10 rounded-[1.15rem] border border-[#C9A06B] bg-[#FDF8F3] px-5 py-8 text-center sm:mt-12 sm:px-8 sm:py-9 lg:px-10 lg:py-5">
          <p className="font-serif text-[15px] leading-[1.7] text-[#1A1A1A] sm:text-[1.05rem] sm:leading-[1.75] lg:text-[1.425rem] lg:leading-[1.8]">
            Our goal:{" "}
            <span className="text-[#C58B58]">
              Give business owners better access
            </span>{" "}
            to products, customers, and opportunities—so they can spend less
            time
            <br />
            managing complexity and more time growing their business.
          </p>
        </div>
      </div>
    </section>
  );
}
