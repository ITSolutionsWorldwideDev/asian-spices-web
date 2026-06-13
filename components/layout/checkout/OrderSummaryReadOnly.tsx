// apps/web/components/layout/checkout/OrderSummaryReadOnly.tsx

import Image from "next/image";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { SHIPPING_OPTIONS, ShippingMethod } from "@/lib/pricing";

interface Props {
  items: any[];
  shippingMethod: "standard" | "express" | "overnight";

  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

/* export const SHIPPING_OPTIONS = {
  standard: { label: "Standard Shipping", price: 5.99 },
  express: { label: "Express Shipping", price: 12.99 },
  overnight: { label: "Overnight Shipping", price: 24.99 },
} as const; */

export const BASE_CURRENCY = "EUR";

export function convertPrice(
  amount: number,
  rate: number,
  currency: string,
  baseCurrency: string = "EUR",
) {
  if (currency === baseCurrency) {
    return amount; // ✅ no conversion
  }

  return amount * rate;
}

const safeNumber = (value: any) => {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
};

export default function OrderSummaryReadOnly({
  items,
  shippingMethod,
  subtotal,
  tax,
  shipping,
  total,
}: Props) {
  // const subtotal = items.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );

  // const shipping =
  //   SHIPPING_OPTIONS[shippingMethod]?.price ?? SHIPPING_OPTIONS.standard.price;

  // const tax = subtotal * 0.08;
  // const total = subtotal + tax + shipping;
  // const { symbol, rate, currency } = useCurrencyStore();
  const { symbol, rate, selectedCurrency } = useCurrencyStore();

  const safeSubtotal = safeNumber(subtotal);
  const safeTax = safeNumber(tax);
  const safeShipping = safeNumber(shipping);
  const safeTotal = safeNumber(total);

  const subtotalConverted = convertPrice(safeSubtotal, rate, selectedCurrency);
  const taxConverted = convertPrice(safeTax, rate, selectedCurrency);
  const shippingConverted = convertPrice(safeShipping, rate, selectedCurrency);
  const totalConverted = convertPrice(safeTotal, rate, selectedCurrency);

  const shippingOption = SHIPPING_OPTIONS[shippingMethod];
  const isFreeShipping = shipping === 0;

  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {items.map((item: any) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-14 w-14 rounded-lg overflow-hidden">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.title}
                fill
                className="object-cover"
              />
              {/* <span className="absolute top-0 -right-1 bg-black text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {item.quantity}
              </span> */}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              
              <p className="text-xs text-gray-500 space-x-0.5">{symbol}{item.price} x {item.quantity} = {symbol}
                      {(rate * (item.price * item.quantity)).toFixed(2)}</p>
              {/* <p className="text-xs text-gray-500">{item.weight}</p> */}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {symbol}
            {subtotalConverted.toFixed(2)}
            {/* {subtotal.toFixed(2)} */}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className={isFreeShipping ? "text-green-600" : ""}>
            {isFreeShipping
              ? "FREE"
              : `${symbol}${shippingConverted.toFixed(2)}`}
          </span>
          {/* <span>{symbol}{shipping.toFixed(2)}</span> */}
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>
            {" "}
            {symbol}
            {taxConverted.toFixed(2)}
            {/* {tax.toFixed(2)}  */}
          </span>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>
          {symbol}
          {totalConverted.toFixed(2)}
        </span>
        {/* <span>{symbol}{total.toFixed(2)}</span> */}
      </div>
    </div>
  );
}
