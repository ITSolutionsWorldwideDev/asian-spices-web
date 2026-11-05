/** GA4 ecommerce events via GTM dataLayer (EUR — matches checkout/order totals). */

export type Ga4Item = {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity: number;
};

type EcommercePayload = {
  currency: string;
  value: number;
  items: Ga4Item[];
  transaction_id?: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

const DEFAULT_CURRENCY = "EUR";

function pushEcommerce(event: string, ecommerce: EcommercePayload) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  // Clear previous ecommerce object so items don't merge across events
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ecommerce });

  // Also send via gtag so GA4 picks it up even without a GTM event tag
  if (typeof window.gtag === "function") {
    const { items, ...rest } = ecommerce;
    window.gtag("event", event, { ...rest, items });
  }
}

export function toGa4Item(input: {
  id: string;
  name: string;
  category?: string | null;
  price: number;
  quantity?: number;
}): Ga4Item {
  return {
    item_id: String(input.id),
    item_name: input.name,
    ...(input.category ? { item_category: input.category } : {}),
    price: Number(Number(input.price).toFixed(2)),
    quantity: Math.max(1, Number(input.quantity) || 1),
  };
}

function itemsValue(items: Ga4Item[]) {
  return Number(
    items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2),
  );
}

export function trackViewItem(item: Ga4Item, currency = DEFAULT_CURRENCY) {
  pushEcommerce("view_item", {
    currency,
    value: itemsValue([item]),
    items: [item],
  });
}

export function trackAddToCart(item: Ga4Item, currency = DEFAULT_CURRENCY) {
  pushEcommerce("add_to_cart", {
    currency,
    value: itemsValue([item]),
    items: [item],
  });
}

export function trackBeginCheckout(
  items: Ga4Item[],
  currency = DEFAULT_CURRENCY,
  coupon?: string,
) {
  if (!items.length) return;
  pushEcommerce("begin_checkout", {
    currency,
    value: itemsValue(items),
    items,
    ...(coupon ? { coupon } : {}),
  });
}

export function trackPurchase(params: {
  transactionId: string;
  value: number;
  tax?: number;
  shipping?: number;
  items: Ga4Item[];
  currency?: string;
  coupon?: string;
}) {
  const {
    transactionId,
    value,
    tax,
    shipping,
    items,
    currency = DEFAULT_CURRENCY,
    coupon,
  } = params;

  if (!transactionId || !items.length) return;

  // Avoid duplicate purchase hits on success-page remount / polling
  try {
    const key = `gtm_purchase_${transactionId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage may be unavailable; still fire once per call site via ref
  }

  pushEcommerce("purchase", {
    currency,
    value: Number(Number(value).toFixed(2)),
    transaction_id: transactionId,
    ...(tax != null ? { tax: Number(Number(tax).toFixed(2)) } : {}),
    ...(shipping != null
      ? { shipping: Number(Number(shipping).toFixed(2)) }
      : {}),
    ...(coupon ? { coupon } : {}),
    items,
  });
}
