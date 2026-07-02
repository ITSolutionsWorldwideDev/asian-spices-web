//  components/layout/home/Flash_Sale_Product_Card.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { TfiTimer } from "react-icons/tfi";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";

import Flash_Sale_Hover_product_Card from "./Flash_Sale_Hover_product_Card";

export default function FlashSaleProductCard() {
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

          let offBadge = "SALE";
          if (p.discount_type === "percentage" || p.discount_type === "Bulk") {
            offBadge =
              p.discount_value && p.discount_value !== "NaN"
                ? `${p.discount_value}% OFF`
                : "7.00% OFF"; // fallback matching video
          } else if (p.discount_type === "fixed") {
            offBadge = `€${p.discount_value} OFF`;
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
          };
        });

        setProducts(mapped);
      } catch (err) {
        console.error("Failed downloading slider collection layout:", err);
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

  if (loading)
    return (
      <div className="text-center py-12 text-sm text-gray-500 font-medium">
        Loading Deals...
      </div>
    );
  if (products.length === 0) return null;

  return (
    <div className="relative group w-full">
      {/* Slider Controls */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-40 bg-black p-2 rounded-full shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-40 bg-black p-2 rounded-full shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight size={20} />
      </button>

      {/* Horizontal Scroll Box */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-4 px-2"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((item) => {
          // 2️⃣ Locate current product in cart state if active
          const cartItem = cart?.find((c) => c.id === item.id);

          return (
            <div
              key={item.id}
              className="bg-white text-black rounded-2xl p-5 shadow-lg relative min-w-[300px] max-w-[350px] flex-shrink-0 snap-start border border-gray-50"
            >
              {/* Image Box */}
              <div className="relative">
                <span className="absolute z-20 top-3 left-3 bg-red-600 text-white text-xs px-2.5 py-1 font-bold rounded-full uppercase tracking-wider">
                  {item.off}
                </span>

                <div
                  className="relative h-48 w-full overflow-hidden rounded-xl cursor-pointer"
                  onMouseEnter={() => setHoveredId(item.id)}
                >
                  <Image
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : `/assets/home/hot_sale/${item.image}`
                    }
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </div>

              {/* Content Labels */}
              <h3 className="mt-4 text-gray-800 font-semibold text-lg truncate">
                {item.title}
              </h3>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-orange-500 text-xl font-bold">
                  €{item.base_price.toFixed(2)}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  €{item.oldPrice.toFixed(2)}
                </span>
              </div>

              <p className="text-green-600 text-xs font-semibold mt-1.5 flex items-center">
                <TfiTimer className="mr-1.5" />
                You save {item.save}
              </p>

              {cartItem ? (
                <div className="mt-4 flex items-center justify-between border border-gray-200 rounded-xl overflow-hidden h-[44px]">
                  <button
                    onClick={() => decreaseQty(item.id, isLoggedIn)}
                    className="px-4 h-full text-xl font-medium hover:bg-gray-50 active:bg-gray-100 transition w-1/4 select-none cursor-pointer"
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
                    className="w-2/4 text-center text-sm font-semibold outline-none bg-transparent"
                  />
                  <button
                    onClick={() => increaseQty(item.id, isLoggedIn)}
                    className="px-4 h-full text-xl font-medium hover:bg-gray-50 active:bg-gray-100 transition w-1/4 select-none cursor-pointer"
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
                        base_price: item.base_price, // maps the valid discounted value
                        image: item.image,
                        slug: item.slug,
                        category_slug: item.category_slug,
                      },
                      isLoggedIn,
                    );
                  }}
                  className="mt-4 w-full h-[44px] bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition cursor-pointer text-sm tracking-wide shadow-sm active:scale-[0.98]"
                >
                  Grab This Deal
                </button>
              )}

              {/* Hover Frame Component Overlay */}

              {hoveredId === item.id && (
                <div
                  className="absolute -top-4 -left-4 -right-4 bg-white rounded-2xl z-50 shadow-2xl p-4 border border-gray-100 min-w-[340px] max-w-[420px]"
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
              className="relative h-48 w-full overflow-hidden rounded-xl  cursor-pointer"
              onMouseEnter={() => setHoveredId(item.id)}
            >
              <Image
                src={`/assets/home/hot_sale/${item.image}`}
                alt={item.title}
                fill
                className="object-cover hover:scale-110"
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
