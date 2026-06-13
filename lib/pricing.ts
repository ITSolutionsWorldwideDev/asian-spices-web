// lib/pricing.ts

import { CartItem } from "@/store/useCartStore";

export const TAX_RATE = 0.21;
export const FREE_SHIPPING_THRESHOLD = 50;
export const BASE_CURRENCY = "EUR";

export const SHIPPING_OPTIONS = {
  standard: { label: "Standard Shipping", price: 5.99 },
  express: { label: "Express Shipping", price: 12.99 },
  overnight: { label: "Overnight Shipping", price: 24.99 },
} as const;

export type ShippingMethod = keyof typeof SHIPPING_OPTIONS;

export function calculateTotals(
  cart: CartItem[],
  shippingCost: number,
) {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const tax = subtotal * TAX_RATE;

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shippingCost;

  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}

export function convertPrice(
  amount: number,
  rate: number,
  currency: string,
  baseCurrency: string = BASE_CURRENCY,
) {
  if (!amount) return 0;

  if (!currency || currency === baseCurrency) {
    return amount;
  }
  return amount * rate;
}

export function safeNumber(value: any): number {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

export function convertTotals(
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  },
  rate: number,
  currency: string,
  baseCurrency: string = BASE_CURRENCY,
) {
  return {
    subtotal: convertPrice(totals.subtotal, rate, currency, baseCurrency),
    tax: convertPrice(totals.tax, rate, currency, baseCurrency),
    shipping: convertPrice(totals.shipping, rate, currency, baseCurrency),
    total: convertPrice(totals.total, rate, currency, baseCurrency),
  };
}


// export function calculateTotals(
//   cart: CartItem[],
//   shippingMethod: ShippingMethod,
// ) {
//   const subtotal = cart.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0,
//   );

//   const tax = subtotal * TAX_RATE;

//   const shipping =
//     subtotal >= FREE_SHIPPING_THRESHOLD
//       ? 0
//       : SHIPPING_OPTIONS[shippingMethod].price;

//   const total = subtotal + tax + shipping;

//   return { subtotal, tax, shipping, total };
// }
/* export const TAX_RATE = 0.08;

export function calculateCartTotals(cart: CartItem[]) {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subtotal * TAX_RATE;

  const total = subtotal + tax;

  return { subtotal, tax, total };
}

export const FREE_SHIPPING_THRESHOLD = 50;

export function calculateTotals(cart, shippingMethod) {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subtotal * TAX_RATE;

  const shippingPrice =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_OPTIONS[shippingMethod].price;

  const total = subtotal + tax + shippingPrice;

  return {
    subtotal,
    tax,
    shipping: shippingPrice,
    total,
  };
} */
