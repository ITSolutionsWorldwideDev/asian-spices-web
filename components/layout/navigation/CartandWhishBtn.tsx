"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const CartandWhishBtn = () => {
  const { cart } = useCartStore();
  const itemInCart = cart.length;

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="flex flex-col items-center px-2.5 py-1 text-gray-700 transition hover:text-orange-500"
      >
        <Heart className="h-5 w-5" strokeWidth={1.75} />
        <span className="mt-0.5 text-[10px] font-medium leading-none tracking-tight">
          Wishlist
        </span>
      </Link>

      <Link
        href="/cart"
        aria-label="Cart"
        className="relative flex flex-col items-center px-2.5 py-1 text-gray-700 transition hover:text-orange-500"
      >
        <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
        <span className="mt-0.5 text-[10px] font-medium leading-none tracking-tight">
          Cart
        </span>
        {itemInCart > 0 && (
          <span className="absolute right-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {itemInCart}
          </span>
        )}
      </Link>
    </div>
  );
};

export default CartandWhishBtn;
