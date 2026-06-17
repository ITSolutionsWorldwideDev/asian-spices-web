// lib/pricing.ts

import { CartItem } from "@/store/useCartStore";

// export const TAX_RATE = 0.21;
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
  taxRate: number,
  shippingCodeOrName?: string,
) {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // const tax = subtotal * TAX_RATE;
  const tax = subtotal * taxRate;
  const isStandardMethod =
    shippingCodeOrName?.toLowerCase() === "standard" ||
    shippingCodeOrName?.toLowerCase() === "standard delivery";

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD && isStandardMethod ? 0 : shippingCost;

  // const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shippingCost;
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

  const safeRate = rate <= 0 ? 1 : rate;
  return amount * safeRate;

  // return amount * rate;
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
