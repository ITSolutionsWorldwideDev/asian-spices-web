// apps/web/components/layout/productdescpage/RelatedProductsSlider.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useGlobalStore } from "@/store/useGlobalStore";

export default function RelatedProductsSlider({ products }: any) {
  const { symbol, rate } = useCurrencyStore();
  const { taxRules } = useGlobalStore();
  const globalRule = taxRules.find((r) => r.category_id === null);

  return (
    <div className="relative w-full px-2 sm:px-4">
      <Swiper
        modules={[Autoplay, Navigation, Keyboard]}
        loop={true}
        speed={800}
        spaceBetween={16}
        centeredSlides={true}
        grabCursor={true}
        keyboard={{ enabled: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation
        breakpoints={{
          320: {
            slidesPerView: 2, // mobile: 2 products
            centeredSlides: false,
          },
          640: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 5,
          },
        }}
        className="py-6"
      >
        {products?.map((product: any) => {
          const netPrice = Number(
            product.min_offered_price || product.base_price || 0,
          );
          const matchingRule = taxRules.find(
            (r) => r.category_id === product.category_id,
          );
          const taxRate =
            parseFloat(
              matchingRule?.tax_rate ?? globalRule?.tax_rate ?? "21",
            ) / 100;
          const displayPrice = netPrice * (1 + taxRate);

          return (
          <SwiperSlide key={product.id} className="!h-aut py-10">
            <Link
              href={`/${product.category_slug || "products"}/${product.slug}`}
              className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* IMAGE */}
              <div className="relative w-full h-40 overflow-hidden bg-gray-50">
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-1">
                  {product.name}
                </h3>
                {product.seller_name ? (
                  <p className="mt-0.5 text-[11px] font-medium text-orange-700 line-clamp-1">
                    Sold by {product.seller_name}
                  </p>
                ) : null}

                <p className="text-orange-500 font-bold text-sm mt-1">
                  {symbol}
                  {(displayPrice * rate).toFixed(2)}
                </p>
              </div>
            </Link>
          </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

