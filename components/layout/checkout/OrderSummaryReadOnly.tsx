//  components/layout/checkout/OrderSummaryReadOnly.tsx

import Image from "next/image";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import { SHIPPING_OPTIONS, ShippingMethod } from "@/lib/pricing";

interface Props {
  items: any[];
  shippingMethod: "standard" | "express" | "overnight";
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export const BASE_CURRENCY = "EUR";

export function convertPrice(
  amount: number,
  rate: number,
  currency: string,
  baseCurrency: string = "EUR",
) {
  if (currency === baseCurrency) {
    return amount;
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
  const { symbol, rate, selectedCurrency } = useCurrencyStore();

  // 🌟 Extract multi-tier taxRules array instead of singular scalar values
  const { taxRules } = useGlobalStore();

  const safeSubtotal = safeNumber(subtotal);
  const safeTax = safeNumber(tax);
  const safeShipping = safeNumber(shipping);
  const safeTotal = safeNumber(total);

  const subtotalConverted = convertPrice(safeSubtotal, rate, selectedCurrency);
  const taxConverted = convertPrice(safeTax, rate, selectedCurrency);
  const shippingConverted = convertPrice(safeShipping, rate, selectedCurrency);
  const totalConverted = convertPrice(safeTotal, rate, selectedCurrency);

  const isFreeShipping = shipping === 0;

  // Global backup defaults if map fails to catch localized row constraints
  const globalRule = taxRules.find((r) => r.category_id === null);

  let totalOrderSavings = 0;

  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {items.map((item: any) => {
          const isCancelled = item?.status === "cancelled";
          const itemPrice = safeNumber(item?.price);
          const itemQuantity = safeNumber(item?.quantity || 1);
          const itemLineTotalConverted = rate * (itemPrice * itemQuantity);

          // 1️⃣ Safe Discount & Cross-out Price Calculation Logic
          const originalPrice = item?.oldPrice ? safeNumber(item.oldPrice) : null;
          const discountNum = safeNumber(item?.discount_value);
          const rawSave = originalPrice && originalPrice > itemPrice ? originalPrice - itemPrice : 0;

          // Cancelled lines are excluded from the subtotal/total already
          // (those come straight from the order record), so don't let them
          // contribute to the savings summary either.
          if (rawSave > 0 && !isCancelled) {
            totalOrderSavings += (rawSave * itemQuantity);
          }

          let activeBadge = "";
          if (originalPrice && originalPrice > itemPrice) {
            if (item?.discount_type === "percentage" || item?.discount_type === "Bulk") {
              activeBadge = item?.discount_value && !isNaN(discountNum)
                ? `${item.discount_value}% OFF`
                : `${Math.round((rawSave / originalPrice) * 100)}% OFF`;
            } else if (item?.discount_type === "fixed") {
              activeBadge = item?.discount_value && !isNaN(discountNum)
                ? `€${item.discount_value} OFF`
                : `€${rawSave.toFixed(2)} OFF`;
            } else {
              activeBadge = `${Math.round((rawSave / originalPrice) * 100)}% OFF`;
            }
          }

          // 🌟 Match row item against its respective category tax parameters
          const matchingRule = taxRules.find(
            (r) => r.category_id === item?.category_id,
          );
          const rulePercent = matchingRule
            ? matchingRule.tax_rate
            : globalRule?.tax_rate || "21";

            console.log('item?.category_id === ',item?.category_id);
            console.log('matchingRule === ',matchingRule);
            console.log('rulePercent === ',rulePercent);
            console.log('taxRules === ',taxRules);

          return (
            <div
              key={item.id}
              className={`flex gap-4 ${isCancelled ? "opacity-50" : ""}`}
            >
              <div className="relative h-14 w-14 rounded-lg overflow-hidden">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.title || "Product item"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p
                    className={`text-sm font-medium text-gray-900 truncate ${isCancelled ? "line-through" : ""}`}
                  >
                    {item.title}
                  </p>

                  {/* 2️⃣ Render dynamic item badge inside summary line */}
                  {isCancelled ? (
                    <span className="text-[9px] bg-red-100 text-red-600 rounded px-1 py-0.5 font-bold uppercase shrink-0">
                      Cancelled
                    </span>
                  ) : (
                    activeBadge && (
                      <span className="text-[9px] bg-red-100 text-red-600 rounded px-1 py-0.5 font-bold uppercase shrink-0">
                        {activeBadge}
                      </span>
                    )
                  )}
                </div>

                <div
                  className={`text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-x-1 ${isCancelled ? "line-through" : ""}`}
                >
                  {originalPrice && originalPrice > itemPrice && (
                    <span className="line-through text-gray-400">
                      {symbol}{(rate * originalPrice).toFixed(2)}
                    </span>
                  )}
                  <span>
                    {symbol}{(rate * itemPrice).toFixed(2)} x {itemQuantity} =
                  </span>
                  <span className="font-medium text-gray-900">
                    {symbol}{itemLineTotalConverted.toFixed(2)}
                  </span>
                </div>

                <span className="text-[10px] bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 font-medium inline-block mt-1">
                  Includes {Number(rulePercent).toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {symbol}
            {subtotalConverted.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className={isFreeShipping ? "text-green-600" : ""}>
            {isFreeShipping
              ? "FREE"
              : `${symbol}${shippingConverted.toFixed(2)}`}
          </span>
        </div>

        {totalOrderSavings > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discounts Saved</span>
            <span>
              -{symbol}{(totalOrderSavings * rate).toFixed(2)}
            </span>
          </div>
        )}

        {/* 🌟 Consolidated label for multi-item embedded pricing structures */}
        <div className="flex justify-between text-gray-500 italic">
          <span>Total Included Tax</span>
          <span>
            {symbol}
            {taxConverted.toFixed(2)}
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
      </div>
    </div>
  );
}

/* export default function OrderSummaryReadOnly({
  items,
  shippingMethod,
  subtotal,
  tax,
  shipping,
  total,
}: Props) {
  const { symbol, rate, selectedCurrency } = useCurrencyStore();
  const { taxRate, taxName } = useGlobalStore();

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

        {items.map((item: any) => {
          // 🚀 Parse the specific item variables defensively to prevent runtime crashes
          const itemPrice = safeNumber(item?.base_price);
          const itemQuantity = safeNumber(item?.quantity || 1);
          const itemLineTotalConverted = rate * (itemPrice * itemQuantity);

          return (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-14 w-14 rounded-lg overflow-hidden">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.title || "Product item"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">{item.title}</p>

                {/
                <p className="text-xs text-gray-500 space-x-0.5">
                  {symbol}
                  {itemPrice.toFixed(2)} x {itemQuantity} = {symbol}
                  {itemLineTotalConverted.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {symbol}
            {subtotalConverted.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className={isFreeShipping ? "text-green-600" : ""}>
            {isFreeShipping
              ? "FREE"
              : `${symbol}${shippingConverted.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span>
            {taxName} ({(safeNumber(taxRate) * 100).toFixed(2)}%)
          </span>
          <span>
            {symbol}
            {taxConverted.toFixed(2)}
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
      </div>
    </div>
  );
} */

/* export const SHIPPING_OPTIONS = {
  standard: { label: "Standard Shipping", price: 5.99 },
  express: { label: "Express Shipping", price: 12.99 },
  overnight: { label: "Overnight Shipping", price: 24.99 },
} as const; */
// const subtotal = items.reduce(
//   (acc, item) => acc + item.base_price * item.quantity,
//   0
// );

// const shipping =
//   SHIPPING_OPTIONS[shippingMethod]?.price ?? SHIPPING_OPTIONS.standard.price;

// const tax = subtotal * 0.08;
// const total = subtotal + tax + shipping;
// const { symbol, rate, currency } = useCurrencyStore();

/* <span className="absolute top-0 -right-1 bg-black text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {item.quantity}
              </span> */
/* {items.map((item: any) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-14 w-14 rounded-lg overflow-hidden">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>

              <p className="text-xs text-gray-500 space-x-0.5">
                {symbol}
                {item.base_price.toFixed(2)} x {item.quantity} = {symbol}
                {(rate * (item.base_price * item.quantity)).toFixed(2)}
              </p>
            </div>
          </div>
        ))} */
