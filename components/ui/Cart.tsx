// apps/web/components/ui/Cart.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Heart, Trash2, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useSession } from "next-auth/react";
import {
  calculateTotals,
  SHIPPING_OPTIONS,
  ShippingMethod,
} from "@/lib/pricing";

const FALLBACK_IMAGE = "/images/placeholder.png";

export default function Cart() {
  const { cart, removeFromCart, clearCart, increaseQty, decreaseQty, setQty } =
    useCartStore();

  const { symbol, rate } = useCurrencyStore();
  const { addToWishlist } = useWishlistStore();

  const { countries, selectedCountry, taxRate, taxName, fetchInitialData, setSelectedCountry } = useGlobalStore();

  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const router = useRouter();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const currentShippingPrice = SHIPPING_OPTIONS[shippingMethod]?.price ?? 0;

  const { subtotal, tax, shipping, total } = calculateTotals(
    cart,
    currentShippingPrice,
    taxRate,
    shippingMethod
  );

  const itemInCart = cart.length;

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-10">🛒 Your cart is empty</p>
    );
  }

  return (
    <div className="bg-white p-8">
      <div className="p-4 sm:p-6 container mx-auto">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-1 text-sm sm:text-base">
          <Link href={"/"}>
            <p className="text-[#6A7282]">Home</p>
          </Link>
          <p className="text-[#6A7282]"> / </p>
          <p className="text-[#6A7282]">Shopping Cart</p>
        </div>

        {/* Title */}
        <div className="mt-4 sm:mt-5">
          <h1 className="font-bold text-3xl sm:text-5xl">Shopping Cart</h1>
        </div>

        {/* Item count */}
        <div className="mt-3 sm:mt-5">
          <h1 className="font-bold text-lg sm:text-xl">
            {itemInCart} items in your cart
          </h1>
        </div>
      </div>

      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white">
        {/* LEFT - CART ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-5"
            >
              {/* IMAGE */}
              <div className="h-30 w-full sm:w-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {/* src={`${item.image}`}
                  alt={item.title} */}
                <Link
                  href={`/${item.category_slug || "products"}/${item.slug || item.id}`}
                >
                  <Image
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.title || "Product"}
                    width={96}
                    height={96}
                    className="object-cover h-full w-full"
                  />
                </Link>
              </div>

              {/* DETAILS */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div>
                    <Link
                      href={`/${item.category_slug || "products"}/${item.slug || item.id}`}
                    >
                      <h3 className="font-semibold">{item.title}</h3>
                    </Link>
                    {/* <p className="text-sm text-gray-500">
                      Weight: {item.weight}
                    </p> */}
                    <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                      In Stock
                    </span>
                  </div>

                  <div className="sm:text-right  text-sm">
                    <p className="font-normal mb-2">
                      {symbol}
                      {(rate * item.price).toFixed(2)} x {item.quantity}
                    </p>
                    <p className="font-normal">
                      Total: {symbol}
                      {(rate * (item.price * item.quantity)).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* QTY */}
                  <div className="flex items-center border rounded-lg w-fit">
                    <button
                      onClick={() => decreaseQty(item.id, isLoggedIn)}
                      className="px-3 py-1 text-lg hover:bg-gray-100 cursor-pointer rounded-lg"
                    >
                      −
                    </button>
                    {/* <span className="px-4 text-center">{item.quantity}</span> */}
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (isNaN(value)) return;

                        setQty(item.id, value, isLoggedIn);
                      }}
                      className="w-16 text-center outline-none"
                    />
                    <button
                      onClick={() => increaseQty(item.id, isLoggedIn)}
                      className="px-3 py-1 text-lg hover:bg-gray-100 cursor-pointer rounded-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* ICONS */}
                  <div className="flex items-center gap-4 text-gray-500 flex-wrap">
                    <button
                      className="flex items-center gap-1 cursor-pointer"
                      // onClick={() => addToWishlist(item)}
                    >
                      <Heart size={16} /> Save
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id, isLoggedIn)}
                      className="flex items-center gap-1 text-red-500 cursor-pointer"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          {/* Optional Shipping Selector UI inside Cart */}
          {/* <div className="flex flex-col gap-2 mb-4">
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Shipping Method</label>
            <select
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
              className="border p-2 rounded-xl text-sm bg-gray-50 outline-none cursor-pointer"
            >
              {Object.entries(SHIPPING_OPTIONS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label} (+{symbol}{(rate * value.price).toFixed(2)})
                </option>
              ))}
            </select>
          </div> */}

          {/* <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Shipping Destination Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border p-2.5 rounded-xl text-sm bg-gray-50 outline-none cursor-pointer w-full h-[42px]"
            >
              {countries.map((c) => (
                <option key={c.id} value={c.iso2}>
                  {(c as any).emoji || "🏳️"} {c.name} ({c.iso2})
                </option>
              ))}
            </select>
          </div> */}

          <div className="space-y-2 text-sm py-5">
            <div className="flex justify-between mt-3">
              <span>Subtotal</span>
              <span>
                {symbol}
                {(rate * subtotal).toFixed(2)}
              </span>
            </div>

            {/* <div className="flex justify-between mt-3">
              <span>Tax (21%)</span>
              <span>
                {symbol}
                {(rate * tax).toFixed(2)}
              </span>
            </div> */}

            <div className="flex justify-between mt-3">
              <span>{taxName} ({(taxRate * 100).toFixed(2)}%)</span>
              <span>{symbol}{(rate * tax).toFixed(2)}</span>
            </div>

            {/* <div className="flex justify-between mt-3">
              <span>Estimated Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  `${symbol}${(rate * shipping).toFixed(2)}`
                )}
              </span>
            </div> */}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>
              {symbol}
              {(rate * (total-shipping)).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="cursor-pointer w-full mt-5 bg-linear-to-r from-[#FF6900] to-[#F83701] hover:bg-orange-600 text-white py-3 rounded-xl flex items-center justify-center"
          >
            Proceed to Checkout
            <ArrowRight className="text-white ml-4 size-[20]" />
          </button>

          <Link href={"/"}>
            <button className="w-full mt-3 border py-3 rounded-xl text-sm cursor-pointer">
              Continue Shopping
            </button>
          </Link>

          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-500" />
              Secure Checkout
            </div>
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-orange-500" />
              Free Shipping on orders over {symbol}({(rate * 50).toFixed(2)}) on Standard Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
