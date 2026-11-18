export interface CartItem {
  id: string;
  title: string;
  base_price: number;
  oldPrice?: number;
  quantity: number;
  image: string;

  slug?: string;
  category_id?: string;
  category_slug?: string;
  subcategory_slug?: string;

  exchange_rate?: number;
  tax_rate?: number;
  tax_amount?: number;

  discount_type?: string;
  discount_value?: number;
  promo_code?: string;
}

export type CartToastVariant = "added" | "increased";

export type ToastAnchor = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type CartToastPayload = {
  variant: CartToastVariant;
  title: string;
  subtitle?: string;
  anchor?: ToastAnchor;
};

export type CartActionOptions = {
  anchor?: ToastAnchor;
  showToast?: boolean;
};

export interface CartState {
  cart: CartItem[];

  addToCart: (
    item: Omit<CartItem, "quantity">,
    isLoggedIn: boolean,
    options?: CartActionOptions & { quantity?: number },
  ) => void;
  removeFromCart: (id: string, isLoggedIn: boolean) => void;

  increaseQty: (
    id: string,
    isLoggedIn: boolean,
    options?: CartActionOptions,
  ) => void;
  decreaseQty: (id: string, isLoggedIn: boolean) => void;
  setQty: (id: string, quantity: number, isLoggedIn: boolean) => void;

  setCart: (items: CartItem[]) => void;
  clearCart: (isLoggedIn?: boolean) => void;

  refreshGuestPrices: (countryCode: string) => Promise<void>;
}
