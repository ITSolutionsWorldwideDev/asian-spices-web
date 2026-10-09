// apps/web/components/ui/ProductCard.tsx

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight, Heart, Tag } from "lucide-react";
import CartPlusIcon from "@/components/ui/CartPlusIcon";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import Link from "next/link";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useSession } from "next-auth/react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { anchorFromClick } from "@/lib/cart-toast-anchor";
import { getProductPath } from "@/lib/product-path";
import { resolveTaxRate } from "@/lib/tax";

type Product = {
  id: string;
  quantity: number;
  name: string;
  category_id: string;
  category_slug: string;
  subcategory_slug?: string;
  slug: string;
  image: string;
  base_price: number;
  oldPrice: number | null;
  min_offered_price: number | null;
  tag: string;
  off: string;
  rating: number;
  reviews: number;
  left: number;
  description: string;
  weight?: string;
  discount_value?: string;
  discount_type?: string;
  promo_code?: string;
  seller_name?: string | null;
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
  const { taxRules, taxRulesLoaded } = useGlobalStore();

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [qtyByProduct, setQtyByProduct] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPickQty = (productId: string) => qtyByProduct[productId] ?? 1;

  const setPickQty = (productId: string, qty: number) => {
    setQtyByProduct((prev) => ({
      ...prev,
      [productId]: Math.max(1, qty),
    }));
  };

  const visibleProducts =
    disableSlicing || showAll ? products : products.slice(0, 20);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {visibleProducts.map((product, index) => {
          const pickQty = getPickQty(product.id);

          // 1️⃣ Safe Numeric Extractions & Conversions
          // Match flash sale / ProductDesc: VAT the base first, then apply % / fixed
          const basePrice = Number(product.base_price || 0);
          const netPrice = Number(
            product.min_offered_price || product.base_price || 0,
          );
          const taxRate = taxRulesLoaded
            ? resolveTaxRate(taxRules, product.category_id)
            : null;
          const discountValue = Number(product.discount_value);
          const discountType = (product.discount_type || "").toLowerCase();
          const hasDiscountMeta =
            !!product.discount_value &&
            !isNaN(discountValue) &&
            discountValue > 0;

          let currentPrice: number | null = null;
          let originalPrice: number | null = null;

          if (taxRate != null && netPrice > 0) {
            if (
              hasDiscountMeta &&
              basePrice > 0 &&
              (discountType === "fixed" ||
                ((discountType === "percentage" || discountType === "bulk") &&
                  discountValue < 100))
            ) {
              const baseWithTax = Number(
                (basePrice * (1 + taxRate)).toFixed(2),
              );
              originalPrice = baseWithTax;
              currentPrice =
                discountType === "fixed"
                  ? Number(
                      Math.max(0, baseWithTax - discountValue).toFixed(2),
                    )
                  : Number(
                      (baseWithTax * (1 - discountValue / 100)).toFixed(2),
                    );
            } else {
              currentPrice = Number((netPrice * (1 + taxRate)).toFixed(2));
            }
          }

          // Fallback if originalPrice is not set from discount metadata but oldPrice exists
          if (
            originalPrice == null &&
            product.oldPrice &&
            Number(product.oldPrice) > (currentPrice ?? 0)
          ) {
            const oldPriceNum = Number(product.oldPrice);
            originalPrice =
              taxRate != null
                ? Number((oldPriceNum * (1 + taxRate)).toFixed(2))
                : oldPriceNum;
          }

          // 2️⃣ Dynamic Discount/Savings Math Engine with NaN Guards
          let discountBadgeText: string | null = null;
          let calculatedSavings = 0;

          if (originalPrice && currentPrice != null && originalPrice > currentPrice) {
            calculatedSavings = originalPrice - currentPrice;

            if (discountType === "fixed" && discountValue > 0) {
              discountBadgeText = `${symbol}${discountValue.toFixed(2)} OFF`;
            } else if (discountValue > 0) {
              discountBadgeText = `${discountValue}% OFF`;
            } else if (product.off && !product.off.includes("NaN")) {
              discountBadgeText = product.off;
            } else {
              const rawPct = Math.round(
                ((originalPrice - currentPrice) / originalPrice) * 100,
              );
              if (rawPct > 0) discountBadgeText = `${rawPct}% OFF`;
            }
          } else if (product.off && !product.off.includes("NaN")) {
            discountBadgeText = product.off;
          }

          return (
            <div
              key={`${product.id}-${index}`}
              className="h-full bg-white rounded-2xl shadow hover:shadow-2xl transition p-4 relative flex flex-col justify-between"
              data-cart-anchor
            >
              {/* Upper Section */}
              <div className="relative flex flex-col flex-1">
                {/* Badges Container */}
                <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 flex flex-col gap-1 items-start pointer-events-none">
                  {discountBadgeText && (
                    <span className="bg-red-500 font-bold text-white text-[11px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center shadow-sm animate-fade-in">
                      <Tag className="mr-1 w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span>{discountBadgeText}</span>
                    </span>
                  )}
                  {product.tag && (
                    <span className="bg-yellow-500 text-white text-[11px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-full flex items-center shadow-sm">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Wishlist Heart Toggle */}
                <button
                  type="button"
                  aria-label={
                    mounted && isInWishlist(product.id)
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  onClick={() =>
                    toggleWishlist(
                      {
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        base_price: product.base_price,
                        slug: product.slug,
                        category_slug: product.category_slug,
                        subcategory_slug: product.subcategory_slug,
                      },
                      isLoggedIn,
                    )
                  }
                  translate="no"
                  className="notranslate absolute top-2.5 right-2.5 sm:top-4 sm:right-4 bg-white rounded-full p-2 min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center shadow transition hover:scale-110 active:scale-95 z-20 cursor-pointer"
                >
                  <Heart
                    className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition ${
                      mounted && isInWishlist(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-500"
                    }`}
                  />
                </button>

                {/* Product Image Cover Container */}
                <div className="h-60 sm:h-70 w-full overflow-hidden rounded-xl relative bg-gray-50">
                  <Image
                    src={
                      product.image ||
                      "/assets/home/premium_collection/8a94a27bd306859ae9b600c037a4132590040eeb.jpg"
                    }
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-contain p-2"
                    priority={index < 4}
                  />
                </div>

                {/* Routing Anchors */}
                <Link
                  href={getProductPath(product, "spices")}
                  className="block mt-3 sm:mt-4"
                >
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem]">
                    {product.name}
                    {product.weight ? ` ${product.weight}` : ""}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2 min-h-[32px]">
                    {product.description
                      ? product.description.replace(/<[^>]*>/g, "").trim() || "No description available."
                      : "No description available."}
                  </p>
                </Link>

                {/* Price Presentation Segment */}
                <div className="flex items-baseline gap-2 mt-2 min-h-[1.75rem]">
                  {currentPrice == null ? (
                    <span
                      className="inline-block h-6 w-16 animate-pulse rounded bg-orange-100"
                      aria-hidden
                    />
                  ) : (
                    <>
                      <span className="text-orange-500 font-bold text-lg sm:text-xl">
                        {symbol}
                        {(currentPrice * rate).toFixed(2)}
                      </span>

                      {originalPrice && originalPrice > currentPrice && (
                        <span className="text-gray-400 line-through text-xs sm:text-sm font-medium">
                          {symbol}
                          {(originalPrice * rate).toFixed(2)}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* 3️⃣ "You Save" Calculated Tracker Info Label */}
                <div className="min-h-[1.375rem] mt-1 flex items-center">
                  {calculatedSavings > 0 ? (
                    <p className="text-green-600 text-xs font-semibold flex items-center bg-green-50/70 py-0.5 px-2 rounded-md w-fit">
                      You save {symbol}
                      {(calculatedSavings * rate).toFixed(2)}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Qty picker + cart icon — counter resets to 1 after add */}
              <div
                className="notranslate mt-4 pt-1 flex items-stretch gap-2"
                translate="no"
              >
                <div className="flex flex-1 items-center overflow-hidden rounded-xl border border-gray-200 bg-white h-[44px] sm:h-[46px]">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${product.name}`}
                    onClick={() => setPickQty(product.id, pickQty - 1)}
                    disabled={pickQty <= 1}
                    className="h-full w-11 shrink-0 flex items-center justify-center bg-gray-100 text-lg font-medium text-stone-700 transition hover:bg-gray-200 active:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    aria-label={`Quantity of ${product.name}`}
                    value={pickQty}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (isNaN(value) || value < 1) return;
                      setPickQty(product.id, value);
                    }}
                    className="h-full min-w-0 flex-1 border-x border-gray-200 bg-white text-center text-sm font-semibold text-stone-900 outline-none"
                  />
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${product.name}`}
                    onClick={() => setPickQty(product.id, pickQty + 1)}
                    className="h-full w-11 shrink-0 flex items-center justify-center bg-gray-100 text-lg font-medium text-stone-700 transition hover:bg-gray-200 active:bg-gray-300 select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  aria-label={`Add ${pickQty} ${product.name} to cart`}
                  className="cursor-pointer shrink-0 h-[44px] sm:h-[46px] min-w-[76px] sm:min-w-[82px] px-4 rounded-xl bg-[#FE8C00] hover:bg-[#e57e00] text-white flex items-center justify-center transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={(e) => {
                    if (currentPrice == null) return;
                    addToCart(
                      {
                        id: product.id,
                        title: product.name,
                        base_price: Number(currentPrice || 0),
                        oldPrice: Number(originalPrice || 0),
                        discount_value: Number(product.discount_value || 0),
                        discount_type: product.discount_type,
                        image: product.image || "/images/placeholder.png",
                        slug: product.slug,
                        category_slug: product.category_slug,
                        subcategory_slug: product.subcategory_slug,
                        category_id: product.category_id,
                        promo_code: product.promo_code,
                      },
                      isLoggedIn,
                      {
                        quantity: pickQty,
                        anchor: anchorFromClick(e),
                      },
                    );
                    setPickQty(product.id, 1);
                  }}
                  disabled={currentPrice == null}
                >
                  <CartPlusIcon className="h-7 w-auto sm:h-8" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slicing Controls footer */}
      {!disableSlicing && products.length > 20 && (
        <div className="flex justify-center mt-8 mb-10">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            translate="no"
            className="notranslate flex items-center justify-center px-10 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-amber-600 hover:to-amber-400 text-white py-2 font-semibold rounded-lg transition cursor-pointer shadow"
          >
            {showAll ? (
              "See Less"
            ) : (
              <>
                See More
                <ArrowRight className="ml-5 h-4 w-4" />
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
  subcategory_slug?: string;
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
              data-cart-anchor
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
                      subcategory_slug: product.subcategory_slug,
                    },
                    isLoggedIn,
                  )
                }
                className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-full p-2.5 sm:p-2 min-h-[44px] min-w-[44px] flex items-center justify-center shadow transition hover:scale-110 active:scale-95 z-10"
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
                href={getProductPath(product, "spices")}
                className="block mt-4"
              >
                <h3 className="font-semibold text-gray-800 text-base line-clamp-1">
                  {product.name}
                </h3>
                <span className="text-xs text-gray-400 mt-0.5 block line-clamp-2 min-h-[32px]">
                  {product.description
                    ? product.description.replace(/<[^>]*>/g, "").trim().split(" ").slice(0, 3).join(" ") + "..."
                    : "No description available."}
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
                <div className="mt-4 flex items-center justify-between border border-gray-200 rounded-xl overflow-hidden h-[44px]">
                  <button
                    onClick={() => decreaseQty(product.id, isLoggedIn)}
                    className="w-11 min-w-[44px] h-full flex items-center justify-center text-lg hover:bg-gray-50 active:bg-gray-100 transition select-none cursor-pointer"
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
                    onClick={(e) =>
                      increaseQty(product.id, isLoggedIn, {
                        anchor: anchorFromClick(e),
                      })
                    }
                    className="w-11 min-w-[44px] h-full flex items-center justify-center text-lg hover:bg-gray-50 active:bg-gray-100 transition select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="cursor-pointer mt-4 w-full h-[44px] bg-gradient-to-r from-orange-400 to-orange-500 hover:from-amber-600 hover:to-amber-400 text-white rounded-xl text-sm font-bold flex items-center justify-center transition shadow-sm active:scale-[0.99]"
                  onClick={(e) => {
                    addToCart(
                      {
                        id: product.id,
                        title: product.name,
                        base_price: product.base_price,
                        image: product.image || "/images/placeholder.png",
                        slug: product.slug,
                        category_slug: product.category_slug,
                        subcategory_slug: product.subcategory_slug,
                      },
                      isLoggedIn,
                      { anchor: anchorFromClick(e) },
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
                href={getProductPath(product, "spices")}
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
                        subcategory_slug: product.subcategory_slug,
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
