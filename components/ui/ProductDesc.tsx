// apps/web/components/ui/ProductDesc.tsx

"use client";

import { useState } from "react";
import {
  Star,
  Check,
  Heart,
  AlertCircle,
  Clock3,
  ShoppingCart,
  Zap,
} from "lucide-react";
import CartPlusIcon from "@/components/ui/CartPlusIcon";
import { useRouter } from "next/navigation";

import ProductTabs from "../layout/productdescpage/ProductTabs";
import ProductImageGallery from "../layout/productdescpage/ProductImageGallery";

import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import Link from "next/link";
import { anchorFromClick } from "@/lib/cart-toast-anchor";
import { resolveTaxRate } from "@/lib/tax";

export default function ProductDesc({
  product,
  category,
}: {
  product: Product;
  category: string;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const { symbol, rate } = useCurrencyStore();
  const { taxRules, taxRulesLoaded } = useGlobalStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const taxRate = taxRulesLoaded
    ? resolveTaxRate(taxRules, product.category_id)
    : null;

  const isPriceAvailable =
    product.min_offered_price !== undefined &&
    product.min_offered_price !== null;

  const basePrice = Number(product.base_price || 0);
  const salePriceRaw =
    product.sale_price !== undefined && product.sale_price !== null
      ? Number(product.sale_price)
      : null;
  const offeredPrice = isPriceAvailable
    ? Number(product.min_offered_price)
    : null;

  // Catalog sale: same fields used by flash sale / sale_only filter
  const hasCatalogSale =
    salePriceRaw !== null &&
    !Number.isNaN(salePriceRaw) &&
    basePrice > 0 &&
    salePriceRaw < basePrice;

  const discountValue = Number(product.discount_value);
  const discountType = (product.discount_type || "").toLowerCase();
  const hasDiscountMeta =
    product.discount_value != null &&
    !Number.isNaN(discountValue) &&
    discountValue > 0;

  /**
   * Payable price:
   * - Always need a country offer (min_offered_price) to sell
   * - On catalog sale, take the better of sale_price and country offer
   *   so we never ignore sale_price (previous bug: only min_offered + reverse %)
   */
  let currentPrice = 0;
  let originalPrice: number | null = null;

  if (isPriceAvailable && offeredPrice != null && !Number.isNaN(offeredPrice)) {
    if (hasCatalogSale) {
      currentPrice = Math.min(offeredPrice, salePriceRaw!);
      originalPrice = basePrice > currentPrice ? basePrice : null;
    } else {
      currentPrice = offeredPrice;

      // Discount-only sales (no sale_price): recover list price from discount meta
      if (hasDiscountMeta) {
        switch (discountType) {
          case "percentage":
          case "bulk":
            if (discountValue < 100) {
              originalPrice = currentPrice / (1 - discountValue / 100);
            }
            break;
          case "fixed":
            originalPrice = currentPrice + discountValue;
            break;
          default:
            if (basePrice > currentPrice) originalPrice = basePrice;
        }
      } else if (basePrice > currentPrice) {
        originalPrice = basePrice;
      }
    }
  }

  if (originalPrice != null) {
    originalPrice = Number(originalPrice.toFixed(2));
    if (originalPrice <= currentPrice) originalPrice = null;
  }

  // Admin/catalog prices are net — VAT once tax rules load (category → global → 21%)
  // Match flash sale: VAT the base first, then apply % / fixed on that
  if (
    taxRate != null &&
    currentPrice > 0 &&
    hasDiscountMeta &&
    basePrice > 0 &&
    (discountType === "fixed" ||
      ((discountType === "percentage" || discountType === "bulk") &&
        discountValue < 100))
  ) {
    const baseWithTax = Number((basePrice * (1 + taxRate)).toFixed(2));
    originalPrice = baseWithTax;
    currentPrice =
      discountType === "fixed"
        ? Number(Math.max(0, baseWithTax - discountValue).toFixed(2))
        : Number((baseWithTax * (1 - discountValue / 100)).toFixed(2));
  } else {
    if (taxRate != null && currentPrice > 0) {
      currentPrice = Number((currentPrice * (1 + taxRate)).toFixed(2));
    }
    if (taxRate != null && originalPrice != null) {
      originalPrice = Number((originalPrice * (1 + taxRate)).toFixed(2));
    }
  }

  const priceReady = taxRate != null;

  const rawSave =
    originalPrice && originalPrice > currentPrice
      ? originalPrice - currentPrice
      : 0;
  const hasSale = Boolean(originalPrice && originalPrice > currentPrice);

  let activeBadge = product.badge || "";

  if (rawSave > 0) {
    switch (discountType) {
      case "percentage":
      case "bulk":
        if (hasDiscountMeta) {
          activeBadge = `${discountValue}% OFF`;
        } else if (originalPrice) {
          activeBadge = `${Math.round((rawSave / originalPrice) * 100)}% OFF`;
        }
        break;

      case "fixed":
        if (hasDiscountMeta) {
          activeBadge = `${symbol}${(discountValue * rate).toFixed(2)} OFF`;
        } else {
          activeBadge = `${symbol}${(rawSave * rate).toFixed(2)} OFF`;
        }
        break;

      default:
        if (!activeBadge && originalPrice) {
          activeBadge = `${Math.round((rawSave / originalPrice) * 100)}% OFF`;
        }
    }
  }

  const whyChooseUs = [
    "Reliable Delivery",
    "Warranty Protection",
    "Easy Returns",
    "Wide Product Selection",
  ];
  const highlights = product?.highlights || [];
  const [pendingQty, setPendingQty] = useState(1);
  const [showSeller, setShowSeller] = useState(false);
  const images =
    product.images && product?.images?.length > 0
      ? product.images.map((img: any) => img.url)
      : ["/assets/spices/spices-1.png"];

  const categorySlug =
    product.category_slug ||
    category
      .replace(/&/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

  const numericRating =
    typeof product.rating === "number" ? Number(product.rating) : 0;
  const displayedRating = numericRating > 0 ? numericRating.toFixed(1) : null;
  const displayedReviews =
    typeof product.reviews === "number" ? Number(product.reviews) : 0;
  const stockCount = Number((product as any)?.total_available_stock || 0);

  const addConfiguredQuantity = (e: React.MouseEvent<HTMLElement>) => {
    if (!priceReady) return;
    const quantityToAdd = Math.max(1, pendingQty);
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
        subcategory_slug: product.subcategory_slug,
        category_id: product.category_id,
        promo_code: product.promo_code,
      },
      isLoggedIn,
      {
        quantity: quantityToAdd,
        anchor: anchorFromClick(e),
      },
    );
    setPendingQty(1);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 sm:mb-6 text-xs sm:text-sm">
        <Link
          href={`/${categorySlug}`}
          className="flex items-center gap-2 hover:underline"
        >
          <p className="text-[#6A7282] whitespace-nowrap">{category}</p>
        </Link>

        {product.subcategory_name && product.subcategory_slug && (
          <>
            <span className="text-[#6A7282]">/</span>
            <Link
              href={`/${categorySlug}/${product.subcategory_slug}`}
              className="hover:underline"
            >
              <p className="text-[#6A7282] whitespace-nowrap">
                {product.subcategory_name}
              </p>
            </Link>
          </>
        )}

        <span className="text-[#6A7282]">/</span>
        <p className="text-gray-900 font-medium wrap-break-word">
          {product.name}
          {product.weight ? ` ${product.weight}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* Left Gallery */}
        <div>
          <ProductImageGallery
            images={images}
            name={`${product.name}${product.weight ? ` ${product.weight}` : ""}`}
            badge={
              (product as any).category_name ||
              category ||
              undefined
            }
          />
        </div>

        {/* Right Info Details */}
        <div className="space-y-4 sm:space-y-5" data-cart-anchor>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
            {product.name}
            {product.weight ? ` ${product.weight}` : ""}
          </h1>
          {product.seller_name ? (
            showSeller ? (
              <p className="text-xs sm:text-sm font-medium text-orange-700">
                Sold by {product.seller_name}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setShowSeller(true)}
                className="text-xs sm:text-sm font-medium text-orange-700 underline-offset-2 hover:underline"
              >
                View seller
              </button>
            )
          ) : null}
          <p className="text-sm sm:text-base text-gray-500">
            Origin: {product.country_of_origin || "International"}
          </p>

          {/* Star Ratings */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={
                      i < Math.round(Math.max(0, Math.min(5, numericRating)))
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                    fill={
                      i < Math.round(Math.max(0, Math.min(5, numericRating)))
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
            </div>
            {displayedRating ? (
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {displayedRating}
              </span>
            ) : (
              <span className="text-xs sm:text-sm text-gray-500">No rating yet</span>
            )}
            <span className="text-xs sm:text-sm font-semibold text-orange-500">
              ({displayedReviews} reviews)
            </span>
          </div>

          {/* Price / savings */}
          {isPriceAvailable ? (
            <div
              className={`flex flex-wrap items-center gap-3 sm:gap-4 ${
                hasSale ? "rounded-xl border border-slate-200 p-3 sm:px-4 sm:py-3 bg-white" : ""
              }`}
            >
              {!priceReady ? (
                <span
                  className="inline-block h-10 sm:h-12 w-28 animate-pulse rounded bg-orange-100"
                  aria-hidden
                />
              ) : (
                <>
                  {hasSale && originalPrice && (
                    <span className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-none text-gray-400 line-through">
                      {symbol}
                      {(originalPrice * rate).toFixed(2)}
                    </span>
                  )}
                  <span
                    className={`font-extrabold leading-none text-orange-500 ${
                      hasSale ? "text-3xl sm:text-4xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-5xl"
                    }`}
                  >
                    {symbol}
                    {(currentPrice * rate).toFixed(2)}
                  </span>
                  {hasSale && rawSave > 0 && (
                    <p className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-green-100 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm lg:text-lg font-bold text-green-700">
                      <Clock3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                      You save {symbol}
                      {(rawSave * rate).toFixed(2)}
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 sm:p-4 text-amber-800">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-semibold">Pricing Unavailable</p>
                <p className="mt-0.5 text-xs text-amber-700/90">
                  The product price is not available for this country.
                </p>
              </div>
            </div>
          )}

          {/* Availability */}
          <div
            className={`rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold ${
              stockCount > 0
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Check size={16} />
              {stockCount > 0
                ? "In Stock - Ships Within 24 hours"
                : "Out of stock"}
            </span>
          </div>

          {/* Qty picker + cart icon (+ wishlist) */}
          {isPriceAvailable && (
            <div className="notranslate space-y-2.5 sm:space-y-3" translate="no">
              <div className="flex flex-col items-start gap-2 sm:gap-2.5">
                {product.weight ? (
                  <span className="inline-flex rounded-lg bg-gray-100 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700">
                    {product.weight} per unit
                  </span>
                ) : null}
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  Quantity
                </p>
              </div>
              <div className="flex items-stretch gap-2.5 sm:gap-3">
                <div className="flex flex-1 items-center overflow-hidden rounded-xl border border-gray-200 bg-white h-12 sm:h-14">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${product.name}`}
                    onClick={() =>
                      setPendingQty((prev) => Math.max(1, prev - 1))
                    }
                    disabled={pendingQty <= 1}
                    className="h-full w-12 shrink-0 flex items-center justify-center bg-gray-100 text-lg font-medium text-stone-700 transition hover:bg-gray-200 active:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    aria-label={`Quantity of ${product.name}`}
                    value={pendingQty}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (isNaN(value) || value < 1) return;
                      setPendingQty(value);
                    }}
                    className="h-full min-w-0 flex-1 border-x border-gray-200 bg-white text-center text-sm sm:text-base font-semibold text-stone-900 outline-none"
                  />
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${product.name}`}
                    onClick={() => setPendingQty((prev) => prev + 1)}
                    className="h-full w-12 shrink-0 flex items-center justify-center bg-gray-100 text-lg font-medium text-stone-700 transition hover:bg-gray-200 active:bg-gray-300 select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  aria-label={`Add ${pendingQty} ${product.name} to cart`}
                  onClick={addConfiguredQuantity}
                  disabled={!priceReady}
                  className="cursor-pointer shrink-0 h-12 sm:h-14 min-w-[88px] sm:min-w-[100px] px-4 rounded-xl bg-[#FE8C00] hover:bg-[#e57e00] text-white flex items-center justify-center transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CartPlusIcon className="h-8 w-auto sm:h-9" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toggleWishlist(
                      {
                        id: product.id,
                        name: product.name,
                        image: images[0],
                        base_price: isPriceAvailable ? currentPrice : 0,
                        slug: product.slug,
                        category_slug: product.category_slug,
                        subcategory_slug: product.subcategory_slug,
                      },
                      isLoggedIn,
                    )
                  }
                  className={`inline-flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border transition cursor-pointer shadow-sm ${
                    isInWishlist(product.id)
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-red-400 hover:text-red-500"
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${isInWishlist(product.id) ? "fill-white text-white" : ""}`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Buy now */}
          {isPriceAvailable && (
            <div className="notranslate space-y-2.5 sm:space-y-3 pt-1" translate="no">
              <button
                type="button"
                onClick={(e) => {
                  if (!priceReady) return;
                  addConfiguredQuantity(e);
                  router.push("/checkout");
                }}
                className="inline-flex h-12 sm:h-14 w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 text-sm sm:text-base lg:text-lg font-bold text-white transition hover:bg-black shadow-md shadow-black/15 active:scale-[0.99] cursor-pointer ring-1 ring-stone-800/10"
              >
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 fill-amber-400" />
                <span>Buy Now</span>
              </button>
            </div>
          )}

          {/* Why choose us */}
          <section className="pt-2">
            <p className="text-xl sm:text-2xl font-bold text-gray-900">Why choose us?</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {whyChooseUs.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={15} className="text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Product highlights if available */}
          {highlights.length > 0 && (
            <div className="grid grid-cols-1 gap-2 border-t border-gray-100 pt-4 sm:grid-cols-2">
              {highlights.map((item: any, idx: any) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check size={16} className="flex-shrink-0 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ProductTabs product={product} />
    </div>
  );
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


        <div className="space-y-6" data-cart-anchor>
          {isPriceAvailable && activeBadge && (
            <span className="inline-block bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wide px-4 py-1 rounded-full shadow-sm animate-fade-in">
              {activeBadge}
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900">
            {product.name}
            {product.weight ? ` ${product.weight}` : ""}
          </h1>
          {product.seller_name ? (
            <p className="text-sm font-medium text-orange-700">
              Sold by {product.seller_name}
            </p>
          ) : null}
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
                  onClick={(e) =>
                    increaseQty(product.id, isLoggedIn, {
                      anchor: anchorFromClick(e),
                    })
                  }
                  className="px-4 h-full text-lg font-medium hover:bg-gray-100 active:bg-gray-200 transition select-none cursor-pointer"
                >
                  +
                </button>
              </div>
            )}
          </div>


          {cartItem ? (
            <button
              onClick={(e) =>
                increaseQty(product.id, isLoggedIn, {
                  anchor: anchorFromClick(e),
                })
              }
              className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <Check size={20} />
              In Cart ({cartItem.quantity})
            </button>
          ) : (
            <button
              onClick={(e) =>
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
          subcategory_slug: product.subcategory_slug,
                    category_id: product.category_id,
                    promo_code: product.promo_code,
                  },
                  isLoggedIn,
                  { anchor: anchorFromClick(e) },
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
          subcategory_slug: product.subcategory_slug,
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
