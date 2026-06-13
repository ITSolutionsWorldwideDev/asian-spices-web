// apps/web/components/layout/productdescpage/RelatedProductsSlider.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function RelatedProductsSlider({ products }: any) {
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
        {products?.map((product: any) => (
          <SwiperSlide key={product.id} className="!h-aut py-10">
            <Link
              href={`/${product.category_slug || "products"}/${product.slug}`}
              className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* IMAGE */}
              <div className="relative w-full h-40 overflow-hidden">
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-orange-500 font-bold text-sm mt-1">
                  ${product.price}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

/* "use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function RelatedProductsSlider({ products }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  // -----------------------------
  // AUTO SCROLL (smooth loop)
  // -----------------------------
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let direction = 1;

    const interval = setInterval(() => {
      if (isHovered.current) return;

      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll) direction = -1;
      if (el.scrollLeft <= 0) direction = 1;

      el.scrollBy({
        left: direction * 220,
        behavior: "smooth",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // -----------------------------
  // BUTTON SCROLL
  // -----------------------------
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full">

      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow p-2 z-10 rounded-full hover:scale-110 transition"
      >
        ◀
      </button>


      <div
        ref={scrollRef}
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false)}
        className="
          flex gap-4 overflow-x-auto px-10
          scroll-smooth scrollbar-hide
          snap-x snap-mandatory  md:py-10 lg:py-10 
          carousel
          cursor-grab active:cursor-grabbing
        "
      >
        {products?.map((product: any) => (
          <Link
            key={product.id}
            href={`/${product.category_slug || "products"}/${product.slug}`}
            className="
              min-w-[180px]
              snap-start
              flex-shrink-0
              bg-white rounded-xl p-3
              shadow hover:shadow-md transition
            "
          >

            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              width={180}
              height={180}
              className="w-full h-40 object-cover rounded-lg"
            />

  
            <h3 className="text-sm font-semibold mt-2 line-clamp-1">
              {product.name}
            </h3>


            <p className="text-orange-500 font-bold text-sm">
              ${product.price}
            </p>
          </Link>
        ))}
      </div>


      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow p-2 z-10 rounded-full hover:scale-110 transition"
      >
        ▶
      </button>
    </div>
  );
} */
