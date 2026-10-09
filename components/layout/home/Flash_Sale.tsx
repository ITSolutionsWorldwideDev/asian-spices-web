// components/ui/FlashSale.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FlashSaleProductCard from "./Flash_Sale_Product_Card";
import { FlashSaleTimer } from "./Flash_Sale_Timer";

export default function FlashSale() {
  const [visible, setVisible] = useState<boolean | null>(null);

  if (visible === false) return null;

  return (
    <section
      id="flash-sale"
      className={`relative mx-auto mt-1 w-full max-w-full overflow-hidden rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 px-3 py-3 text-white sm:mt-2 sm:rounded-3xl sm:px-6 sm:py-5 md:mt-3 md:px-10 md:py-6 ${visible === null ? "hidden" : ""}`}
    >
      {/* Spice pattern background */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <Image
          src={`/assets/home/hot_sale/8357fc982c16b069a3bee90343077e780562649f.png`}
          alt="Illustration of Indian spices and herbs"
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover object-right"
          loading="lazy"
        />
      </div>

      {/* Header: compact layout with clean spacing */}
      <div className="relative z-10 mb-3 flex w-full flex-col items-center gap-2 sm:mb-4 sm:gap-3 lg:mb-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Yahan justify-center aur items-center add kiya hai taaki text bilkul middle mein ho */}
        <div className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-black px-3 py-1 text-[11px] font-bold uppercase tracking-wide fire-icon-animated sm:px-3.5 sm:py-1.5 sm:text-xs">
          <img
            className="h-5 w-6 object-contain sm:h-7 sm:w-9"
            src={`/assets/home/hot_sale/af61c09c418181db6f7977fb75c765cfd193908e.gif`}
            alt="Flash sale"
            loading="lazy"
            decoding="async"
          />
          Flash Sale
        </div>

        <div className="max-w-md px-2 text-center lg:flex-1 lg:max-w-none">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] opacity-90 sm:text-[11px]">
            Limited Time Offer
          </p>
          <h2 className="text-[11px] font-semibold leading-tight sm:text-xs md:text-sm">
            Grab these exclusive deals before time runs out!
          </h2>
        </div>

        <div className="w-full max-w-full shrink-0 overflow-x-auto sm:w-auto">
          <div className="mx-auto flex w-max max-w-full justify-center scale-90 sm:scale-100 origin-center">
            <FlashSaleTimer startDate="2026-07-29T00:00:00Z" cycleDays={3} />
          </div>
        </div>
      </div>

      {/* Products Alignment Fix */}
      <div className="relative z-10 w-full min-w-0">
        <FlashSaleProductCard onLoad={(count) => setVisible(count > 0)} />
      </div>
    </section>
  );
}