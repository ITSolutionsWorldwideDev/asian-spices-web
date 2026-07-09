// apps/web/components/ui/ProductDesc.tsx

"use client";

import { useState } from "react";
import {
  Star,
  ShoppingCart,
  Check,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import Image from "next/image";

import ProductTabs from "../layout/productdescpage/ProductTabs";
import ProductImageGallery from "../layout/productdescpage/ProductImageGallery";

import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import Link from "next/link";

export default function ProductDesc({
  product,
  category,
}: {
  product: Product;
  category: string;
}) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const { symbol, rate } = useCurrencyStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { cart, addToCart, increaseQty, decreaseQty, setQty } = useCartStore();

  const cartItem = cart.find(
    (item) =>
      item.id.toString().toLowerCase().trim() ===
      product.id.toString().toLowerCase().trim(),
  );

  const isPriceAvailable =
    product.min_offered_price !== undefined &&
    product.min_offered_price !== null;

  // Fallback calculations safely guarded
  const rawBasePrice = Number(
    product.min_offered_price || product.base_price || 0,
  );

  // const currentPrice = product.sale_price
  //   ? Number(product.sale_price)
  //   : rawBasePrice;

  // const originalPrice = product.sale_price ? rawBasePrice : null;

  const currentPrice = Number(
    product.min_offered_price || product.base_price || 0,
  );
  let originalPrice: number | null = null;

  const discountValue = Number(product.discount_value);

  if (
    currentPrice > 0 &&
    product.discount_value &&
    !isNaN(discountValue) &&
    discountValue > 0
  ) {
    switch ((product.discount_type || "").toLowerCase()) {
      case "percentage":
      case "bulk":
        originalPrice = currentPrice / (1 - discountValue / 100);
        break;

      case "fixed":
        originalPrice = currentPrice + discountValue;
        break;

      default:
        originalPrice = null;
    }

    if (originalPrice !== null) {
      originalPrice = Number(originalPrice.toFixed(2));
    }
  }

  // const rawSave = originalPrice ? originalPrice - currentPrice : 0;
  const rawSave =
    originalPrice && originalPrice > currentPrice
      ? originalPrice - currentPrice
      : 0;

  let activeBadge = product.badge || "";

  if (rawSave > 0) {
    switch ((product.discount_type || "").toLowerCase()) {
      case "percentage":
      case "bulk":
        activeBadge = `${discountValue}% OFF`;
        break;

      case "fixed":
        activeBadge = `${symbol}${(discountValue * rate).toFixed(2)} OFF`;
        break;

      default:
        if (!activeBadge) {
          activeBadge = `${Math.round((rawSave / originalPrice!) * 100)}% OFF`;
        }
    }
  }

  // let activeBadge = product.badge || "";
  // if (isPriceAvailable && originalPrice && originalPrice > currentPrice) {
  //   const discountNum = Number(product.discount_value);
  //   if (
  //     product.discount_type === "percentage" ||
  //     product.discount_type === "Bulk"
  //   ) {
  //     activeBadge =
  //       product.discount_value && !isNaN(discountNum)
  //         ? `${product.discount_value}% OFF`
  //         : `${Math.round((rawSave / originalPrice) * 100)}% OFF`;
  //   } else if (product.discount_type === "fixed") {
  //     activeBadge =
  //       product.discount_value && !isNaN(discountNum)
  //         ? `€${product.discount_value} OFF`
  //         : `€${rawSave.toFixed(2)} OFF`;
  //   } else if (!activeBadge) {
  //     activeBadge = `${Math.round((rawSave / originalPrice) * 100)}% OFF`;
  //   }
  // }

  const features = [
    { icon: Truck, title: "Free Shipping on €50+" },
    { icon: RotateCcw, title: "30- Day Returns" },
    { icon: ShieldCheck, title: "Quality Guarantee" },
  ];
  const highlights = product?.highlights || [];
  const images =
    product.images && product?.images?.length > 0
      ? product.images.map((img: any) => img.url)
      : ["/assets/spices/spices-1.png"];

  const categorySlug = category
    .replace(/&/g, "-") // Replace & with -
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-") // Remove duplicate hyphens
    .toLowerCase();

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm sm:text-base">
        <p className="text-[#6A7282] whitespace-nowrap">Home</p>
        <span className="text-[#6A7282]">/</span>
        <Link
          href={`/${categorySlug}`}
          className="flex items-center gap-2 hover:underline"
        >
          <p className="text-[#6A7282] whitespace-nowrap">{category}</p>
          {/* Products-  */}
        </Link>

        <span className="text-[#6A7282]">/</span>
        <p className="text-gray-900 font-medium wrap-break-word">
          {product.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Gallery */}
        <div>
          <ProductImageGallery images={images} name={product.name} />
        </div>

        {/* Right Info Details */}
        <div className="space-y-6">
          {isPriceAvailable && activeBadge && (
            <span className="inline-block bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wide px-4 py-1 rounded-full shadow-sm">
              {activeBadge}
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-500">
            Origin: {product.country_of_origin || "International"}
          </p>

          {/* Star Ratings */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating || 5} ({product.reviews || 0} reviews)
            </span>
          </div>

          {/* Localized Price Blocks vs Unavailable Fallback Message */}
          {isPriceAvailable ? (
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-orange-500">
                  {symbol}
                  {(currentPrice * rate).toFixed(2)}
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <span className="line-through text-gray-400 text-xl font-medium">
                    {symbol}
                    {(originalPrice * rate).toFixed(2)}
                  </span>
                )}
              </div>
              {rawSave > 0 && (
                <p className="text-green-600 font-semibold bg-green-50 text-sm py-1 px-3 rounded-lg w-fit border border-green-100">
                  You save {symbol}
                  {(rawSave * rate).toFixed(2)}
                </p>
              )}
            </div>
          ) : (
            // 🟢 Render fallback message instead of broken/zero parameters
            <div className="flex items-start gap-2.5 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl">
              <AlertCircle className="size-5 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-semibold text-sm">Pricing Unavailable</p>
                <p className="text-xs text-amber-700/90 mt-0.5">
                  The product price is not available for this country.
                </p>
              </div>
            </div>
          )}

          {/* Quantity Controls / Add to Cart Actions (Only visible if item is purchaseable) */}
          {isPriceAvailable && (
            <>
              <div className="flex items-center gap-6">
                {cartItem && (
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden h-[44px] items-center bg-gray-50">
                    <button
                      onClick={() => decreaseQty(product.id, isLoggedIn)}
                      className="px-4 h-full text-lg font-medium hover:bg-gray-100 active:bg-gray-200 transition select-none cursor-pointer"
                    >
                      –
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
                      className="w-14 text-center font-semibold bg-transparent outline-none text-sm"
                    />
                    <button
                      onClick={() => increaseQty(product.id, isLoggedIn)}
                      className="px-4 h-full text-lg font-medium hover:bg-gray-100 active:bg-gray-200 transition select-none cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {cartItem ? (
                <button
                  onClick={() => increaseQty(product.id, isLoggedIn)}
                  className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold"
                >
                  <Check size={20} /> In Cart ({cartItem.quantity})
                </button>
              ) : (
                <button
                  onClick={() =>
                    addToCart(
                      {
                        id: product.id,
                        title: product.name,
                        base_price: Number(currentPrice || 0),
                        oldPrice: Number(originalPrice || 0),
                        discount_value: Number(product.discount_value || 0),
                        discount_type: product.discount_type,
                        image: images[0] || "/images/placeholder.png",
                        slug: product.slug,
                        category_slug: product.category_slug,
                        category_id: product.category_id,
                        promo_code: product.promo_code,
                      },
                      isLoggedIn,
                    )
                  }
                  className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold"
                >
                  <ShoppingCart size={20} /> Add To Cart
                </button>
              )}
            </>
          )}

          {/* Wishlist Action (Always allowed) */}
          <button
            onClick={() =>
              toggleWishlist(
                {
                  id: product.id,
                  name: product.name,
                  image: images[0],
                  base_price: isPriceAvailable ? currentPrice : 0,
                  slug: product.slug,
                  category_slug: product.category_slug,
                },
                isLoggedIn,
              )
            }
            className={`w-full border py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold transition cursor-pointer ${
              isInWishlist(product.id)
                ? "bg-red-500 border-red-500 text-white shadow-sm"
                : "border-gray-300 hover:border-red-500 hover:text-red-500 bg-white"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? "fill-white text-white" : ""}`}
            />
            {isInWishlist(product.id)
              ? "Remove From Wishlist"
              : "Add To Wishlist"}
          </button>

          {/* Highlights Checklist */}
          {highlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {highlights.map((item: any, idx: any) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <Check size={16} className="text-green-600 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Features Footer Block */}
          <section className="w-full mt-10 border-t border-gray-100 pt-8">
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center shadow-inner">
                      <Icon
                        className="w-6 h-6 text-orange-500"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-gray-600 text-xs font-medium">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      <ProductTabs product={product} />
    </div>
  );
}

/* "use client";

import { useState } from "react";
import {
  Star,
  ShoppingCart,
  Check,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

import ProductTabs from "../layout/productdescpage/ProductTabs";
import ProductImageGallery from "../layout/productdescpage/ProductImageGallery";

import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";

export default function ProductDesc({ product }: { product: Product }) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const { symbol, rate } = useCurrencyStore();

  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const { cart, addToCart, increaseQty, decreaseQty, setQty } = useCartStore();

  // const cartItem = cart.find((item) => item.id === product.id);
  const cartItem = cart.find(
    (item) =>
      item.id.toString().toLowerCase().trim() ===
      product.id.toString().toLowerCase().trim(),
  );

  const isPriceAvailable =
    product.min_offered_price !== undefined &&
    product.min_offered_price !== null;

  const rawBasePrice = Number(product.base_price || 0);
  const currentPrice = product.sale_price
    ? Number(product.sale_price)
    : rawBasePrice;
  const originalPrice = product.sale_price ? rawBasePrice : null;
  const rawSave = originalPrice ? originalPrice - currentPrice : 0;

  // 2️⃣ Dynamic Discount Badge Construction (Safe from ts(2367))
  let activeBadge = product.badge || "";

  if (isPriceAvailable && originalPrice && originalPrice > currentPrice) {
    const discountNum = Number(product.discount_value);
    if (
      product.discount_type === "percentage" ||
      product.discount_type === "Bulk"
    ) {
      activeBadge =
        product.discount_value && !isNaN(discountNum)
          ? `${product.discount_value}% OFF`
          : `${Math.round((rawSave / originalPrice) * 100)}% OFF`;
    } else if (product.discount_type === "fixed") {
      activeBadge =
        product.discount_value && !isNaN(discountNum)
          ? `€${product.discount_value} OFF`
          : `€${rawSave.toFixed(2)} OFF`;
    } else if (!activeBadge) {
      activeBadge = `${Math.round((rawSave / originalPrice) * 100)}% OFF`;
    }
  }
  

  const features = [
    {
      icon: Truck,
      title: "Free Shipping on €50+",
    },
    {
      icon: RotateCcw,
      title: "30- Day Returns",
    },
    {
      icon: ShieldCheck,
      title: "Quality Guarantee",
    },
  ];

  const highlights = product?.highlights || [];

  const images =
    product.images && product?.images?.length > 0
      ? product.images.map((img: any) => img.url)
      : [
          "/assets/spices/spices-1.png",
          "/assets/spices/spices-2.png",
          "/assets/spices/spices-3.png",
          "/assets/spices/spices-4.png",
        ];

  const [activeImage, setActiveImage] = useState(
    images.length > 0 ? images[0] : "/assets/spices/spices-1.png",
  );

  return (
    <div className="container mx-auto p-6">

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm sm:text-base">
        <p className="text-[#6A7282] whitespace-nowrap">Home</p>
        <span className="text-[#6A7282]">/</span>
        <p className="text-[#6A7282] whitespace-nowrap">Products</p>
        <span className="text-[#6A7282]">/</span>
        <p className="text-gray-900 font-medium wrap-break-word">
          {product.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <div>
          <ProductImageGallery images={images} name={product.name} />
        </div>


        <div className="space-y-6">
          {isPriceAvailable && activeBadge && (
            <span className="inline-block bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wide px-4 py-1 rounded-full shadow-sm animate-fade-in">
              {activeBadge}
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-500">
            Origin: {product.country_of_origin || "International"}
          </p>


          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating || 5} ({product.reviews || 0} reviews)
            </span>
          </div>

  
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-orange-500">
              {symbol}
              {(currentPrice * rate).toFixed(2)}
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="line-through text-gray-400 text-xl font-medium">
                {symbol}
                {(originalPrice * rate).toFixed(2)}
              </span>
            )}
          </div>


          {rawSave > 0 && (
            <p className="text-green-600 font-semibold bg-green-50 text-sm py-1 px-3 rounded-lg w-fit border border-green-100 animate-fade-in">
              You save {symbol}
              {(rawSave * rate).toFixed(2)}
            </p>
          )}


          <div className="flex items-center gap-6">
            {cartItem && (
              <div className="flex border border-gray-200 rounded-xl overflow-hidden h-[44px] items-center bg-gray-50">
                <button
                  onClick={() => decreaseQty(product.id, isLoggedIn)}
                  className="px-4 h-full text-lg font-medium hover:bg-gray-100 active:bg-gray-200 transition select-none cursor-pointer"
                >
                  –
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
                  className="w-14 text-center font-semibold bg-transparent outline-none text-sm"
                />
                <button
                  onClick={() => increaseQty(product.id, isLoggedIn)}
                  className="px-4 h-full text-lg font-medium hover:bg-gray-100 active:bg-gray-200 transition select-none cursor-pointer"
                >
                  +
                </button>
              </div>
            )}
          </div>


          {cartItem ? (
            <button
              onClick={() => increaseQty(product.id, isLoggedIn)}
              className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <Check size={20} />
              In Cart ({cartItem.quantity})
            </button>
          ) : (
            <button
              onClick={() =>
                addToCart(
                  {
                    id: product.id,
                    title: product.name,
                    base_price: Number(currentPrice || 0),
                    oldPrice: Number(originalPrice || 0),
                    discount_value: Number(product.discount_value || 0),
                    discount_type: product.discount_type,
                    image: images[0] || "/images/placeholder.png",
                    slug: product.slug,
                    category_slug: product.category_slug,
                    category_id: product.category_id,
                    promo_code: product.promo_code,
                  },
                  isLoggedIn,
                )
              }
              className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <ShoppingCart size={20} />
              Add To Cart
            </button>
          )}


          <button
            onClick={() =>
              toggleWishlist(
                {
                  id: product.id,
                  name: product.name,
                  image: images[0],
                  base_price: currentPrice,
                  slug: product.slug,
                  category_slug: product.category_slug,
                },
                isLoggedIn,
              )
            }
            className={`w-full border py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold transition cursor-pointer ${
              isInWishlist(product.id)
                ? "bg-red-500 border-red-500 text-white shadow-sm"
                : "border-gray-300 hover:border-red-500 hover:text-red-500 bg-white"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isInWishlist(product.id) ? "fill-white text-white" : ""
              }`}
            />
            {isInWishlist(product.id)
              ? "Remove From Wishlist"
              : "Add To Wishlist"}
          </button>

   
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {highlights.map((item: any, idx: any) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <Check size={16} className="text-green-600 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

     
          <section className="w-full mt-10 border-t border-gray-100 pt-8">
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center shadow-inner">
                      <Icon
                        className="w-6 h-6 text-orange-500"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-gray-600 text-xs font-medium">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      <ProductTabs product={product} />
    </div>
  );
}
 */
