export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  base_price: number;
  oldPrice?: number;

  slug?: string;
  category_id?: string;
  category_slug?: string;
  subcategory_slug?: string;

  discount_type?: string;
  discount_value?: number;
  promo_code?: string;
}

export interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem, isLoggedIn: boolean) => Promise<void>;
  removeFromWishlist: (id: string, isLoggedIn: boolean) => Promise<void>;
  toggleWishlist: (item: WishlistItem, isLoggedIn: boolean) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  setWishlist: (items: WishlistItem[]) => void;
  clearWishlist: (isLoggedIn: boolean) => Promise<void>;
}
