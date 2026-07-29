import Image from "next/image";
import Link from "next/link";
import FlashSaleProductCard from "./Flash_Sale_Product_Card";
import { FlashSaleTimer } from "./Flash_Sale_Timer";

export default function FlashSale() {
  return (
    <section className="relative mx-auto mt-10 w-full max-w-full overflow-hidden rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 px-3 py-8 text-white sm:mt-14 sm:rounded-3xl sm:px-6 sm:py-10 md:mt-20 md:px-10 md:py-12">
      {/* Spice pattern background */}
      <div className="pointer-events-none absolute inset-0 opacity-20 sm:opacity-25">
        <Image
          src={`/assets/home/hot_sale/8357fc982c16b069a3bee90343077e780562649f.png`}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover object-right"
          loading="lazy"
        />
      </div>

      {/* Header: stacks on mobile, row on lg */}
      <div className="relative z-10 mb-6 flex w-full flex-col items-center gap-4 sm:mb-8 sm:gap-6 lg:mb-10 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black px-3 py-1 text-sm font-bold uppercase tracking-wide fire-icon-animated sm:px-4 sm:py-1.5 sm:text-base">
          <img
            className="h-8 w-11 object-contain sm:h-10 sm:w-14"
            src={`/assets/home/hot_sale/af61c09c418181db6f7977fb75c765cfd193908e.gif`}
            alt=""
            loading="lazy"
            decoding="async"
          />
          Flash Sale
        </div>

        <div className="max-w-md px-2 text-center lg:flex-1 lg:max-w-none">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] opacity-90 sm:text-xs">
            Limited Time Offer
          </p>
          <h2 className="mt-1 text-sm font-semibold leading-snug sm:text-base md:text-lg">
            Grab these exclusive deals before time runs out!
          </h2>
        </div>

        <div className="w-full max-w-full shrink-0 overflow-x-auto sm:w-auto">
          <div className="mx-auto flex w-max max-w-full justify-center">
            <FlashSaleTimer startDate="2026-07-29T00:00:00Z" cycleDays={3} />
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="relative z-10 w-full min-w-0">
        <FlashSaleProductCard />
      </div>

      {/* Footer link */}
      <div className="relative z-10 mt-6 flex justify-center sm:mt-8">
        <Link
          href="/spices"
          className="inline-flex items-center gap-2 text-sm font-medium text-white transition hover:opacity-80"
        >
          View all flash deals
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
