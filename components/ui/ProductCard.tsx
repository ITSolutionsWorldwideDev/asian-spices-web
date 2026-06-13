// apps/web/components/ui/ProductCard.tsx

"use client";

import Image from "next/image";
import { GoTag } from "react-icons/go";
import { useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa6";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Heart } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";
import { TiTickOutline } from "react-icons/ti";

import { usePathname } from "next/navigation";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useCategoryFilterStore } from "@/store/useCategoryFilterStore";

import { useSession } from "next-auth/react";

type Product = {
  id: string;
  quantity: number;
  name: string;
  category_slug: string;
  slug: string;
  image: string;
  price: number;
  oldPrice: number | null;
  tag: string;
  off: string;
  rating: number;
  reviews: number;
  left: number;
  description: string;
  weight?: string;
  discount_value?: string;
};

interface ProductCardProps {
  products: Product[];
}

export default function ProductCard({ products }: ProductCardProps) {

  const { selectedCategories } = useCategoryFilterStore();
  const { symbol, selectedCurrency, rate } = useCurrencyStore();

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const path = usePathname();
  const pathname = path.startsWith("/") ? path.slice(1) : path;
  const [cartBtn, setCartBtn] = useState<string | null>(null);

  // const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  // const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { cart, addToCart, increaseQty, decreaseQty, setQty } = useCartStore();

  const [showAll, setShowAll] = useState(false);

  // const visibleProducts = showAll ? productData : productData.slice(0, 8);
  const visibleProducts = showAll ? products : products.slice(0, 20);

  console.log('products ==== ',products.length);
  console.log('visibleProducts ==== ',visibleProducts.length);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 ">
        {visibleProducts.map((product, index) => {
          const cartItem = cart.find((item) => item.id === product.id);

          return (
            <div
              key={`${product.id}-${index}`}
              className="bg-white rounded-2xl shadow hover:shadow-2xl transition p-4 relative hover:scale-105"
            >
              {product.tag && (
                <span className="absolute top-1/11 left-1/11 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  {product.tag}
                </span>
              )}

              {/* {product.discount_value && (
                <span className="absolute top-1/6 left-1/11 bg-red-500 font-bold text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <GoTag className="mr-2" />
                  {product.discount_value} % OFF
                </span>
              )} */}

              {/* Like button */}
              <button
                onClick={() =>
                  toggleWishlist(
                    {
                      id: product.id,
                      name: product.name,
                      image: product.image,
                      price: product.price,
                      slug: product.slug,
                      category_slug: product.category_slug,
                    },
                    isLoggedIn,
                  )
                }
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow transition hover:scale-110 z-10"

                // className="absolute top-1/11 right-1/11 bg-white rounded-full p-2 shadow transition hover:scale-110"
              >
                <Heart
                  className={`w-5 h-5  transition ${mounted && isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-500 "}`}
                />
              </button>


              <Image
                src={
                  product.image ||
                  "/assets/home/premium_collection/8a94a27bd306859ae9b600c037a4132590040eeb.jpg"
                }
                alt={product.name}
                width={300}
                height={250}
                className="h-70 w-full object-cover rounded-xl"
              />

              {/* Rating */}
              {/* <div className="flex items-center text-yellow-500 text-sm mt-3">
              {"★".repeat(product.rating)}
              <span className="text-gray-400 ml-1">({product.reviews})</span>
            </div> */}


              <Link
                href={`/${product.category_slug || "spices"}/${product.slug}`.replace(
                  /\/+/g,
                  "/",
                )}
              >
                <h3 className="font-semibold mt-1">
                  {product.name?.split(" ").slice(0, 3).join(" ")}
                </h3>
                <span className="text-sm text-gray-400">
                  {product.description?.split(" ").slice(0, 3).join(" ")}...
                </span>
              </Link>
          
              <div className="flex items-center gap-2 mt-2">
                <span className="text-orange-400 font-bold text-xl">
                  {symbol}
                  {Number(product.price * rate).toFixed(2)}
                </span>
              </div>

        
              {cartItem ? (
                <div className="mt-4 flex items-center justify-between border rounded-lg overflow-hidden">
                  <button
                    onClick={() => decreaseQty(product.id, isLoggedIn)}
                    className="px-4 py-2 text-lg hover:bg-gray-100"
                  >
                    −
                  </button>

                  {/* <span className="px-4">{cartItem.quantity}</span> */}
                  <input
                    type="number"
                    min={1}
                    value={cartItem.quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (isNaN(value)) return;

                      setQty(product.id, value, isLoggedIn);
                    }}
                    className="w-8 text-center outline-none"
                  />

                  <button
                    onClick={() => increaseQty(product.id, isLoggedIn)}
                    className="px-4 py-2 text-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="cursor-pointer mt-4 w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-amber-600 hover:to-amber-400 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center"
                  onClick={() => {
                    addToCart(
                      {
                        id: product.id,
                        title: product.name,
                        price: product.price,
                        image: product.image || "/images/placeholder.png",
                        slug: product.slug,
                        category_slug: product.category_slug,
                      },
                      isLoggedIn,
                    );
                  }}
                >
                  <BsCartPlus className="w-5 h-5 mr-2" />
                  Add To Cart
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* See More/See Less Button */}

      {products.length > 16 && (
        <div className="flex justify-center mt-8 mb-10">
          <button
            onClick={() => setShowAll(!showAll)}
            /* py-5 bg-black */
            className="relative flex items-center justify-center px-10  bg-gradient-to-r from-orange-400 to-orange-500 hover:from-amber-600 hover:to-amber-400 text-white py-2  font-semibold rounded-lg transition-colors group"
          >
            {/* <span className="absolute inset-0 bg-linear-to-r  from-white/40 to-white/90 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"></span> */}
            {showAll ? (
              "See Less"
            ) : (
              <>
                See More
                <FaArrowRight className="ml-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
