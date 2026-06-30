//  components/layout/checkout/OrderSummary.tsx

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { CartItem } from "@/store/useCartStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import {
  SHIPPING_OPTIONS,
  ShippingMethod,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/pricing";

interface Props {
  items: CartItem[];
  // shippingMethod: ShippingMethod;
  shippingMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingMethodName?: string;
  deliveryDaysText?: string;
}

export default function OrderSummary({
  items,
  shippingMethod,
  subtotal,
  tax,
  shipping,
  total,
  shippingMethodName = "Shipping",
  deliveryDaysText,
}: Props) {
  const { symbol, rate } = useCurrencyStore();
  const { taxRate, taxName } = useGlobalStore();

  const isValidShippingMethod = (method: any): method is ShippingMethod => {
    return method in SHIPPING_OPTIONS;
  };

  const safeMethod: ShippingMethod = isValidShippingMethod(shippingMethod)
    ? shippingMethod
    : "standard";

  const convertedThreshold = FREE_SHIPPING_THRESHOLD * (rate || 1);

  const amountForFreeShipping =
    subtotal < FREE_SHIPPING_THRESHOLD ? convertedThreshold - subtotal : 0;

  const hasFreeShipping = shipping <= 0;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
      <h2 className="font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => {
          // Safe conversions to numbers to completely prevent formatting crashes
          const itemPrice = Number(item.price || 0);
          const itemQuantity = Number(item.quantity || 1);
          const itemTotalPrice = rate * (itemPrice * itemQuantity);

          return (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-14 w-14 rounded-lg overflow-hidden">
                <Image
                  src={
                    item.image ||
                    "/assets/home/premium_collection/268598abe4d4ba567742332ae571b20ea98ce9d9.jpg"
                  }
                  alt={item.title || "Product item"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                {/* Fixed line below using safely converted numeric values */}
                <p className="text-xs text-gray-500 space-x-0.5">
                  {symbol}
                  {itemPrice.toFixed(2)} x {itemQuantity} = {symbol}
                  {itemTotalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 text-sm py-5">
        <div className="flex justify-between mt-3">
          <span>Subtotal</span>
          <span>
            {symbol}
            {Number(subtotal || 0).toFixed(2)}
          </span>
        </div>

        {/* DYNAMIC SHIPPING LABEL */}
        <div className="flex justify-between mt-3">
          <span>{shippingMethodName}</span>
          <span className={hasFreeShipping ? "text-[#00A63E]" : ""}>
            {hasFreeShipping
              ? "FREE"
              : `${symbol}${Number(shipping || 0).toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between mt-3">
          <span>
            {taxName} ({(Number(taxRate || 0) * 100).toFixed(2)}%)
          </span>
          <span>
            {symbol}
            {(rate * Number(tax || 0)).toFixed(2)}
          </span>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>
          {symbol}
          {(rate * Number(total || 0)).toFixed(2)}
        </span>
      </div>

      <p className="text-xs text-gray-500">
        {shippingMethod === "standard" && "Delivery in 5-7 days"}
        {shippingMethod === "express" && "Delivery in 2-3 days"}
        {shippingMethod === "overnight" && "Next day delivery"}
      </p>

      <div className="bg-white border-gray-200 py-5 border-b mb-6">
        <label
          htmlFor="promo-code"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          Promo Code
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="promo-code"
            type="text"
            placeholder="Enter code"
            readOnly
            className="w-full sm:flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />

          <button
            disabled
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Apply
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">Try: SPICE20 or WELCOME10</p>
      </div>

      {/* FREE SHIPPING CTA */}
      {!hasFreeShipping && amountForFreeShipping > 0 && (
        <>
          <div className="px-5 py-4 rounded-xl mt-5">
            <div className="text-[#F83600] flex items-center justify-center w-full">
              <ShoppingCart className="mr-3" />
              Add {symbol}
              {(rate * amountForFreeShipping).toFixed(2)} more for free shipping
            </div>
          </div>

          <div className="bg-linear-to-r from-[#FE8C00] to-[#F83600] px-5 py-4 rounded-xl mt-5">
            <Link href="/">
              <button className="cursor-pointer text-white flex items-center justify-center w-full">
                Continue Shopping
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

{
  /* {items.map((item) => (
          
          <div key={item.id} className="flex gap-4">
            <div className="relative h-14 w-14 rounded-lg overflow-hidden">
              <Image
                src={`/assets/home/premium_collection/268598abe4d4ba567742332ae571b20ea98ce9d9.jpg`}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">
                {item.title} 
              </p>
              <p className="text-xs text-gray-500 space-x-0.5">{symbol}{(item.price)?.toFixed(2)} x {item.quantity} = {symbol}
                      {(rate * (item.price * item.quantity)).toFixed(2)}</p>
            </div>
          </div>
        ))} */
}
