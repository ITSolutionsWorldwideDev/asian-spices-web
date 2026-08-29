//  components/layout/home/Flash_Sale_Product_Card.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";

import Flash_Sale_Hover_product_Card from "./Flash_Sale_Hover_product_Card";

type FlashSaleProductCardProps = {
  onLoad?: (count: number) => void;
};

export default function FlashSaleProductCard({ onLoad }: FlashSaleProductCardProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const { cart, addToCart, increaseQty, decreaseQty, setQty } = useCartStore();

  useEffect(() => {
    async function loadSaleItems() {
      try {
        const res = await fetch(
          "/api/products?sale_only=true&sort=random&limit=5",
        );
        const json = await res.json();

        // Transform the DB structure to fit your design templates
        const mapped = (json.data || []).map((p: any) => {
          const basePrice = Number(p.base_price);
          const salePrice = Number(p.sale_price || basePrice);
          const rawSave = basePrice - salePrice;
          const discountPct =
            basePrice > 0 ? Math.round((rawSave / basePrice) * 100) : 0;

          let offBadge = "HOT DEAL";
          if (p.discount_type === "percentage" || p.discount_type === "Bulk") {
            const pct = Number(p.discount_value);
            if (!isNaN(pct) && pct > 0) {
              // Match mock: very strong deals can show HOT DEAL
              offBadge = pct >= 50 ? "HOT DEAL" : `${pct}% OFF`;
            } else if (discountPct > 0) {
              offBadge = discountPct >= 50 ? "HOT DEAL" : `${discountPct}% OFF`;
            }
          } else if (p.discount_type === "fixed") {
            offBadge = `€${p.discount_value} OFF`;
          } else if (discountPct > 0) {
            offBadge = discountPct >= 50 ? "HOT DEAL" : `${discountPct}% OFF`;
          }

          return {
            id: p.id,
            title: p.name,
            image: p.image || "fallback-placeholder.jpg",
            base_price: salePrice, // The actual cost to buy now
            oldPrice: basePrice, // Crossed out cost
            off: offBadge,
            save: `€${rawSave > 0 ? rawSave.toFixed(2) : "0.00"}`,
            description: p.description || "",
            qualities: p.health_benefits
              ? [p.health_benefits]
              : ["Premium Quality", "Intense Aroma", "Hand-Harvested"],
            rating: 5,
            rating_percentage: "100%",
            seller_name: p.seller_name || null,
            slug: p.slug,
            category_slug: p.category_slug,
            category_id: p.category_id,
            promo_code: p.promo_code,
          };
        });

        setProducts(mapped);
        onLoad?.(mapped.length);
      } catch (err) {
        console.error("Failed downloading slider collection layout:", err);
        onLoad?.(0);
      } finally {
        setLoading(false);
      }
    }
    loadSaleItems();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading || products.length === 0) return null;

  return (
    <div className="group relative w-full min-w-0">
      {/* Slider Controls — inset so they stay on-screen on mobile */}
      <button
        type="button"
        aria-label="Previous deals"
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-40 -translate-y-1/2 rounded-full border border-gray-100 bg-black p-1.5 opacity-100 shadow-md transition sm:left-1 sm:p-2 md:left-0 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Next deals"
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-40 -translate-y-1/2 rounded-full border border-gray-100 bg-black p-1.5 opacity-100 shadow-md transition sm:right-1 sm:p-2 md:right-0 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronRight size={18} />
      </button>

      {/* Horizontal Scroll Box */}
      <div
        ref={sliderRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-8 py-3 scrollbar-hide sm:gap-4 sm:px-10 sm:py-4 md:justify-center md:gap-6 md:px-12"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {products.map((item, index) => {
          const cartItem = cart?.find((c) => c.id === item.id);

          return (
            <div
              key={item.id}
              className="relative w-[min(280px,78vw)] max-w-[350px] flex-shrink-0 snap-center rounded-2xl border border-gray-50 bg-white p-4 text-black shadow-lg sm:w-[300px] sm:snap-start sm:p-5"
            >
              {/* Image Box */}
              <div className="relative">
                <span className="absolute left-2 top-2 z-20 rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:left-3 sm:top-3 sm:text-[11px]">
                  {item.off}
                </span>

                <div
                  className="relative h-40 w-full cursor-pointer overflow-hidden rounded-xl bg-gray-50 sm:h-48"
                  onMouseEnter={() => {
                    if (
                      typeof window !== "undefined" &&
                      window.matchMedia("(hover: hover)").matches
                    ) {
                      setHoveredId(item.id);
                    }
                  }}
                >
                  <Image
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : `/assets/home/hot_sale/${item.image}`
                    }
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 78vw, 300px"
                    className="object-contain transition-transform duration-300 hover:scale-110"
                    priority={index < 2}
                  />
                </div>
              </div>

              <h3 className="mt-3 truncate text-base font-semibold text-gray-800 sm:mt-4 sm:text-lg">
                {item.title}
              </h3>
              {item.seller_name ? (
                <p className="mt-1 truncate text-xs font-medium text-orange-700">
                  Sold by {item.seller_name}
                </p>
              ) : null}

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-lg font-bold text-orange-500 sm:text-xl">
                  €{item.base_price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  €{item.oldPrice.toFixed(2)}
                </span>
              </div>

              <p className="mt-1.5 text-xs font-semibold text-green-600">
                You save {item.save}
              </p>

              {cartItem ? (
                <div className="mt-4 flex h-[44px] items-center justify-between overflow-hidden rounded-xl border border-gray-200">
                  <button
                    onClick={() => decreaseQty(item.id, isLoggedIn)}
                    className="h-full w-1/4 cursor-pointer select-none px-4 text-xl font-medium transition hover:bg-gray-50 active:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={cartItem.quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (isNaN(value) || value < 1) return;
                      setQty(item.id, value, isLoggedIn);
                    }}
                    className="w-2/4 bg-transparent text-center text-sm font-semibold outline-none"
                  />
                  <button
                    onClick={() => increaseQty(item.id, isLoggedIn)}
                    className="h-full w-1/4 cursor-pointer select-none px-4 text-xl font-medium transition hover:bg-gray-50 active:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    addToCart(
                      {
                        id: item.id,
                        title: item.title,
                        base_price: Number(item.base_price || 0),
                        oldPrice: Number(item.base_price || 0),
                        discount_value: Number(item.oldPrice || 0),
                        discount_type: item.discount_type,
                        image: item.image,
                        slug: item.slug,
                        category_slug: item.category_slug,
                        category_id: item.category_id,
                        promo_code: item.promo_code,
                      },
                      isLoggedIn,
                    );
                  }}
                  className="mt-4 h-[44px] w-full cursor-pointer rounded-xl bg-orange-500 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98]"
                >
                  Grab This Now
                </button>
              )}

              {/* Desktop hover overlay only */}
              {hoveredId === item.id && (
                <div
                  className="absolute -left-2 -right-2 -top-2 z-50 hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl md:block md:min-w-[320px] lg:min-w-[340px]"
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Flash_Sale_Hover_product_Card
                    item={item}
                    setHoveredId={setHoveredId}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
/* "use client";
import { useState } from "react";
import Image from "next/image";
import Flash_Sale_Hover_product_Card from "./Flash_Sale_Hover_product_Card";
import { TfiTimer } from "react-icons/tfi";

interface FlashSaleProduct {
  id: number;
  title: string;
  image: string;
  base_price: number;
  oldPrice: number;
  off: string;
  left: number;
  save: string;
  description: string;
  qualities: string[];
  rating: number;
  rating_percentage: string;
}

const FlashSaleProductCard = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const FalshSaleProducts: FlashSaleProduct[] = [
    {
      id: 1,
      title: "Premium Saffron",
      image: "6a6c5e09b8f76078ff74a389fb2e9d49eb1a02b9.jpg",
      base_price: 39.99,
      oldPrice: 69.99,
      off: "43% OFF",
      left: 12,
      save: "€30.00",
      description:
        "Premium saffron, known as the “king of spices” or “red gold,” is a rare and valuable spice harvested from the Crocus sativus flower requiring about 75,000 blossoms for just one pound. Its rich aroma and vibrant color make it a prized ingredient in gourmet dishes, traditional remedies for mood and digestion, and luxury skincare for its soothing and brightening effects.",
      qualities: [
        `Deep Red Threads`,
        `Intense Aroma`,
        `Hand-Harvested`,
        `Strong Coloring Power`,
        `Distinct Flavor`,
        `ISO Grade I Certified`,
      ],
      rating: 324,
      rating_percentage: "90%",
    },
    {
      id: 2,
      title: "Organic Garam Masala",
      image: "083782e31e411838bf8aa3bec2c2d18932e8e7c8.jpg",
      base_price: 14.99,
      oldPrice: 24.99,
      off: "43% OFF",
      left: 12,
      save: "€10.00",
      description:
        "Premium saffron, known as the “king of spices” or “red gold,” is a rare and valuable spice harvested from the Crocus sativus flower requiring about 75,000 blossoms for just one pound. Its rich aroma and vibrant color make it a prized ingredient in gourmet dishes, traditional remedies for mood and digestion, and luxury skincare for its soothing and brightening effects.",
      qualities: [
        `Deep Red Threads`,
        `Intense Aroma`,
        `Hand-Harvested`,
        `Strong Coloring Power`,
        `Distinct Flavor`,
        `ISO Grade I Certified`,
      ],
      rating: 324,
      rating_percentage: "90%",
    },
    {
      id: 3,
      title: "Star Anise Whole",
      image: "6618d6869cf24a597449d4b814eba26459cdc371.jpg",
      base_price: 11.99,
      oldPrice: 19.99,
      off: "43% OFF",
      left: 12,
      save: "€8.00",
      description:
        "Premium saffron, known as the “king of spices” or “red gold,” is a rare and valuable spice harvested from the Crocus sativus flower requiring about 75,000 blossoms for just one pound. Its rich aroma and vibrant color make it a prized ingredient in gourmet dishes, traditional remedies for mood and digestion, and luxury skincare for its soothing and brightening effects.",
      qualities: [
        `Deep Red Threads`,
        `Intense Aroma`,
        `Hand-Harvested`,
        `Strong Coloring Power`,
        `Distinct Flavor`,
        `ISO Grade I Certified`,
      ],
      rating: 324,
      rating_percentage: "90%",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
      {FalshSaleProducts.map((item) => (
        <div
          key={item.id}
          className="bg-white text-black rounded-2xl p-5 shadow-lg relative"
        >
    
          <div className="relative ">
            <span className="absolute z-20 top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {item.off}
            </span>
            <span className="absolute bottom-3 z-50 right-3 bg-white/90 text-black text-xs px-2 py-1 rounded-full">
              only {item.left} left!
            </span>

            <div
              className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-50 cursor-pointer"
              onMouseEnter={() => setHoveredId(item.id)}
            >
              <Image
                src={`/assets/home/hot_sale/${item.image}`}
                alt={item.title}
                fill
                className="object-contain hover:scale-110"
              />
            </div>
          </div>

  
          <h3 className="mt-4 text-gray-500 text-lg">{item.title}</h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-orange-500 text-xl font-bold">
              €{item.base_price}
            </span>
            <span className="text-gray-400 line-through text-sm">
              €{item.oldPrice}
            </span>
          </div>

          <p className="text-green-600 text-sm mt-1 flex items-center ">
            <TfiTimer className="mr-2" />
            You save {item.save}
          </p>

          <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition cursor-pointer">
            Grab This Deal
          </button>

          <div
            className={`absolute -top-1/4 left-0  h-full   rounded-2xl transition-transform duration-300 ${
              hoveredId === item.id ? "translate-x-0" : "hidden"
            } z-50`}
          >
            {item && (
              <Flash_Sale_Hover_product_Card
                item={item}
                setHoveredId={setHoveredId}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashSaleProductCard; */
