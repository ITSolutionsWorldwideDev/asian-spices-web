// apps/web/components/ui/ProductCard.tsx

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { BsCartPlus } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa6";
import { GoTag } from "react-icons/go";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useSession } from "next-auth/react";

type Product = {
  id: string;
  quantity: number;
  name: string;
  category_slug: string;
  slug: string;
  image: string;
  base_price: number;
  oldPrice: number | null;
  tag: string;
  off: string;
  rating: number;
  reviews: number;
  left: number;
  description: string;
  weight?: string;
  discount_value?: string;
  discount_type?: string;
};

interface ProductCardProps {
  products: Product[];
  disableSlicing?: boolean;
}

export default function ProductCard({
  products,
  disableSlicing = false,
}: ProductCardProps) {
  const { symbol, rate } = useCurrencyStore();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { cart, addToCart, increaseQty, decreaseQty, setQty } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleProducts =
    disableSlicing || showAll ? products : products.slice(0, 20);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {visibleProducts.map((product, index) => {
          const cartItem = cart.find(
            (item) =>
              item.id.toString().toLowerCase().trim() ===
              product.id.toString().toLowerCase().trim(),
          );

          // 1️⃣ Safe Numeric Extractions & Conversions
          const currentPrice = Number(product.base_price || 0);
          const originalPrice = product.oldPrice
            ? Number(product.oldPrice)
            : null;

          // 2️⃣ Dynamic Discount/Savings Math Engine with NaN Guards
          let discountBadgeText = null;
          let calculatedSavings = 0;

          if (originalPrice && originalPrice > currentPrice) {
            calculatedSavings = originalPrice - currentPrice;

            if (product.off && !product.off.includes("NaN")) {
              discountBadgeText = product.off;
            } else if (
              product.discount_value &&
              !isNaN(Number(product.discount_value))
            ) {
              discountBadgeText = `${Number(product.discount_value)}% OFF`;
            } else {
              // Mathematical fallback check if strings fail
              const rawPct = Math.round(
                ((originalPrice - currentPrice) / originalPrice) * 100,
              );
              discountBadgeText = rawPct > 0 ? `${rawPct}% OFF` : "SALE";
            }
          }

          return (
            <div
              key={`${product.id}-${index}`}
              className="bg-white rounded-2xl shadow hover:shadow-2xl transition p-4 relative hover:scale-105 flex flex-col justify-between"
            >
              {/* Upper Section */}
              <div className="relative">
                {/* Product Status Tag */}
                {product.tag && (
                  <span className="absolute top-4 left-4 bg-yellow-500 text-white text-xs px-2.5 py-1 font-semibold rounded-full flex items-center z-10 shadow-sm">
                    {product.tag}
                  </span>
                )}

                {/* Fixed Dynamic Discount Badge */}
                {discountBadgeText && (
                  <span className="absolute top-4 left-4 bg-red-500 font-bold text-white text-xs px-2.5 py-1 rounded-full flex items-center z-10 shadow-sm animate-fade-in">
                    <GoTag className="mr-1.5 w-3.5 h-3.5" />
                    {discountBadgeText}
                  </span>
                )}

                {/* Wishlist Heart Toggle */}
                <button
                  onClick={() =>
                    toggleWishlist(
                      {
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        base_price: product.base_price,
                        slug: product.slug,
                        category_slug: product.category_slug,
                      },
                      isLoggedIn,
                    )
                  }
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow transition hover:scale-110 z-10 cursor-pointer"
                >
                  <Heart
                    className={`w-5 h-5 transition ${
                      mounted && isInWishlist(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-500"
                    }`}
                  />
                </button>

                {/* Product Image Cover Container */}
                <div className="h-70 w-full overflow-hidden rounded-xl relative bg-gray-50">
                  <Image
                    src={
                      product.image ||
                      "/assets/home/premium_collection/8a94a27bd306859ae9b600c037a4132590040eeb.jpg"
                    }
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>

                {/* Routing Anchors */}
                <Link
                  href={`/${product.category_slug || "spices"}/${product.slug}`.replace(
                    /\/+/g,
                    "/",
                  )}
                  className="block mt-4"
                >
                  <h3 className="font-semibold text-gray-800 text-base line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 min-h-[32px]">
                    {product.description || "No description available."}
                  </p>
                </Link>

                {/* Price Presentation Segment */}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-orange-500 font-bold text-xl">
                    {symbol}
                    {(currentPrice * rate).toFixed(2)}
                  </span>

                  {originalPrice && originalPrice > currentPrice && (
                    <span className="text-gray-400 line-through text-sm font-medium">
                      {symbol}
                      {(originalPrice * rate).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* 3️⃣ "You Save" Calculated Tracker Info Label */}
                {calculatedSavings > 0 && (
                  <p className="text-green-600 text-xs font-semibold mt-1 flex items-center bg-green-50/70 py-0.5 px-2 rounded-md w-fit">
                    You save {symbol}
                    {(calculatedSavings * rate).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Dynamic Action Buttons Bottom Control Block */}
              <div className="mt-4">
                {cartItem ? (
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl overflow-hidden h-[40px]">
                    <button
                      onClick={() => decreaseQty(product.id, isLoggedIn)}
                      className="px-4 h-full text-lg hover:bg-gray-50 active:bg-gray-100 transition select-none cursor-pointer"
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
                        setQty(product.id, value, isLoggedIn);
                      }}
                      className="w-12 text-center text-sm font-semibold outline-none bg-transparent"
                    />
                    <button
                      onClick={() => increaseQty(product.id, isLoggedIn)}
                      className="px-4 h-full text-lg hover:bg-gray-50 active:bg-gray-100 transition select-none cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="cursor-pointer w-full h-[40px] bg-gradient-to-r from-orange-400 to-orange-500 hover:from-amber-600 hover:to-amber-400 text-white rounded-xl text-sm font-bold flex items-center justify-center transition shadow-sm active:scale-[0.99]"
                    onClick={() => {
                      addToCart(
                        {
                          id: product.id,
                          title: product.name,
                          base_price: currentPrice,
                          image: product.image || "/images/placeholder.png",
                          slug: product.slug,
                          category_slug: product.category_slug,
                        },
                        isLoggedIn,
                      );
                    }}
                  >
                    <BsCartPlus className="w-4 h-4 mr-2" />
                    Add To Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slicing Controls footer */}
      {!disableSlicing && products.length > 20 && (
        <div className="flex justify-center mt-8 mb-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center justify-center px-10 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-amber-600 hover:to-amber-400 text-white py-2 font-semibold rounded-lg transition cursor-pointer shadow"
          >
            {showAll ? (
              "See Less"
            ) : (
              <>
                See More
                <FaArrowRight className="ml-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/* "use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { BsCartPlus } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa6";
import { GoTag } from "react-icons/go";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useSession } from "next-auth/react";

type Product = {
  id: string;
  quantity: number;
  name: string;
  category_slug: string;
  slug: string;
  image: string;
  base_price: number;
  oldPrice: number | null;
  tag: string;
  off: string;
  rating: number;
  reviews: number;
  left: number;
  description: string;
  weight?: string;
  discount_value?: string;
};

interface ProductCardProps {
  products: Product[];
  disableSlicing?: boolean;
}

export default function ProductCard({
  products,
  disableSlicing = false,
}: ProductCardProps) {
  const { symbol, rate } = useCurrencyStore();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { cart, addToCart, increaseQty, decreaseQty, setQty } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleProducts =
    disableSlicing || showAll ? products : products.slice(0, 20);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 ">
        {visibleProducts.map((product, index) => {
          const cartItem = cart.find(
            (item) =>
              item.id.toString().toLowerCase().trim() ===
              product.id.toString().toLowerCase().trim(),
          );

          // Determine the badge display text based on available fields
          const discountBadgeText = product.off || (product.discount_value ? `${product.discount_value}% OFF` : null);

          return (
            <div
              key={`${product.id}-${index}`}
              className="bg-white rounded-2xl shadow hover:shadow-2xl transition p-4 relative hover:scale-105"
            >
              {product.tag && (
                <span className="absolute top-1/11 left-1/11 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  {product.tag}
                </span>
              )}

          
              {discountBadgeText && (
                <span className="absolute top-14 left-4 bg-red-500 font-bold text-white text-xs px-2.5 py-1 rounded-full flex items-center z-10 shadow-sm animate-fade-in">
                  <GoTag className="mr-1.5 w-3.5 h-3.5" />
                  {discountBadgeText}
                </span>
              )}

               

              <button
                onClick={() =>
                  toggleWishlist(
                    {
                      id: product.id,
                      name: product.name,
                      image: product.image,
                      base_price: product.base_price,
                      slug: product.slug,
                      category_slug: product.category_slug,
                    },
                    isLoggedIn,
                  )
                }
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow transition hover:scale-110 z-10"
              >
                <Heart
                  className={`w-5 h-5 transition ${
                    mounted && isInWishlist(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-500"
                  }`}
                />
              </button>

              <div className="h-70 w-full overflow-hidden rounded-xl relative">
                <Image
                  src={
                    product.image ||
                    "/assets/home/premium_collection/8a94a27bd306859ae9b600c037a4132590040eeb.jpg"
                  }
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

      
              <Link
                href={`/${product.category_slug || "spices"}/${product.slug}`.replace(
                  /\/+/g,
                  "/",
                )}
                className="block mt-4"
              >
                <h3 className="font-semibold text-gray-800 text-base line-clamp-1">
                  {product.name}
                </h3>
                <span className="text-xs text-gray-400 mt-0.5 block line-clamp-2 min-h-[32px]">
             
                  {product.description?.split(" ").slice(0, 3).join(" ") || "No description available."}...
                </span>
              </Link>

 
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-orange-500 font-bold text-xl">
                  {symbol}
                  {Number(product.base_price * rate).toFixed(2)}
                </span>
                
                {product.oldPrice && product.oldPrice > product.base_price && (
                  <span className="text-gray-400 line-through text-sm font-medium">
                    {symbol}
                    {Number(product.oldPrice * rate).toFixed(2)}
                  </span>
                )}
              </div>

              {cartItem ? (
                <div className="mt-4 flex items-center justify-between border border-gray-200 rounded-xl overflow-hidden h-[40px]">
                  <button
                    onClick={() => decreaseQty(product.id, isLoggedIn)}
                    className="px-4 h-full text-lg hover:bg-gray-50 active:bg-gray-100 transition select-none cursor-pointer"
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
                      setQty(product.id, value, isLoggedIn);
                    }}
                    className="w-12 text-center text-sm font-semibold outline-none bg-transparent"
                  />
                  <button
                    onClick={() => increaseQty(product.id, isLoggedIn)}
                    className="px-4 h-full text-lg hover:bg-gray-50 active:bg-gray-100 transition select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="cursor-pointer mt-4 w-full h-[40px] bg-gradient-to-r from-orange-400 to-orange-500 hover:from-amber-600 hover:to-amber-400 text-white rounded-xl text-sm font-bold flex items-center justify-center transition shadow-sm active:scale-[0.99]"
                  onClick={() => {
                    addToCart(
                      {
                        id: product.id,
                        title: product.name,
                        base_price: product.base_price,
                        image: product.image || "/images/placeholder.png",
                        slug: product.slug,
                        category_slug: product.category_slug,
                      },
                      isLoggedIn,
                    );
                  }}
                >
                  <BsCartPlus className="w-4 h-4 mr-2" />
                  Add To Cart
                </button>
              )}

            </div>
          );
        })}
      </div>

      {!disableSlicing && products.length > 20 && (
        <div className="flex justify-center mt-8 mb-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center justify-center px-10 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-amber-600 hover:to-amber-400 text-white py-2 font-semibold rounded-lg transition"
          >
            {showAll ? (
              "See Less"
            ) : (
              <>
                See More
                <FaArrowRight className="ml-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
} */

{
  /* <Image
                src={
                  product.image ||
                  "/assets/home/premium_collection/8a94a27bd306859ae9b600c037a4132590040eeb.jpg"
                }
                alt={product.name}
                width={300}
                height={250}
                className="h-70 w-full object-cover rounded-xl"
              /> */
}

{
  /* Rating */
}
{
  /* <div className="flex items-center text-yellow-500 text-sm mt-3">
              {"★".repeat(product.rating)}
              <span className="text-gray-400 ml-1">({product.reviews})</span>
            </div> */
}

{
  /* <Link
                href={`/${product.category_slug || "spices"}/${product.slug}`.replace(
                  /\/+/g,
                  "/",
                )}
              >
                <h3 className="font-semibold mt-1">
                  {product.name?.split(" ").slice(0, 3).join(" ")}
                </h3>
                <span className="text-sm text-gray-400">
                  {product.description?.split(" ").slice(0, 3).join(" ")}...
                </span>
              </Link> */
}

{
  /* <div className="flex items-center gap-2 mt-2">
                <span className="text-orange-400 font-bold text-xl">
                  {symbol}
                  {Number(product.base_price * rate).toFixed(2)}
                </span>
              </div> */
}

{
  /* {cartItem ? (
                <div className="mt-4 flex items-center justify-between border rounded-lg overflow-hidden">
                  <button
                    onClick={() => decreaseQty(product.id, isLoggedIn)}
                    className="px-4 py-2 text-lg hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={cartItem.quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (isNaN(value)) return;

                      setQty(product.id, value, isLoggedIn);
                    }}
                    className="w-8 text-center outline-none"
                  />

                  <button
                    onClick={() => increaseQty(product.id, isLoggedIn)}
                    className="px-4 py-2 text-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="cursor-pointer mt-4 w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-amber-600 hover:to-amber-400 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center"
                  onClick={() => {
                    addToCart(
                      {
                        id: product.id,
                        title: product.name,
                        base_price: product.base_price,
                        image: product.image || "/images/placeholder.png",
                        slug: product.slug,
                        category_slug: product.category_slug,
                      },
                      isLoggedIn,
                    );
                  }}
                >
                  <BsCartPlus className="w-5 h-5 mr-2" />
                  Add To Cart
                </button>
              )} */
}
