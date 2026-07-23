// components/layout/home/Smart_Appliances.tsx

import Image from "next/image";
import Link from "next/link";
import React from "react";

const banners = [
  {
    src: "/assets/home/smart_appliances/slow-cooker-banner.png",
    alt: "New Slow Cooker by Signora — pre-order now",
    href: "/kitchen-appliances",
  },
  {
    src: "/assets/home/smart_appliances/summer-sale-banner.png",
    alt: "Summer Sale — Cool Tech, Hot Prices",
    href: "/kitchen-appliances",
  },
] as const;

const Smart_Appliances: React.FC = () => {
  return (
    <section className="container mx-auto my-10 space-y-5 px-3 sm:my-14 sm:space-y-6 sm:px-4 md:my-16 md:space-y-8">
      {banners.map((banner) => (
        <Link
          key={banner.src}
          href={banner.href}
          className="group relative block w-full overflow-hidden rounded-2xl shadow-md transition hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          <Image
            src={banner.src}
            alt={banner.alt}
            width={1600}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.01]"
            loading="lazy"
          />
        </Link>
      ))}
    </section>
  );
};

export default Smart_Appliances;
