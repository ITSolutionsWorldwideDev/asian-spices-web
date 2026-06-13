// apps/web/components/layout/navigation/CartandWhishBtn.tsx

"use client";
import React from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

const CartandWhishBtn = () => {
  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const { cart } = useCartStore();

  const itemInCart = cart.length;
  return (
    <div className="lg:flex items-center space-x-3 hidden ">
      <div
        className="bg-white rounded-full cursor-pointer "
        onClick={() => setCartOpen(!isCartOpen)}
      >
        <Link href={"/wishlist"}>
          <button className="px-2 py-2    font-bold rounded-full shadow-lg hover:shadow-xl   focus:ring-4 focus:ring-white/50 cursor-pointer">
            <Heart />
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-full cursor-pointer relative">
        <Link href={"/cart"}>
          <button className="px-3 py-3 font-bold rounded-full shadow-lg hover:shadow-xl   focus:ring-4 focus:ring-white/50 cursor-pointer">
            <HiOutlineShoppingBag />
          </button>
        </Link>
        {itemInCart > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemInCart}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartandWhishBtn;
