// apps/web/components/ui/ProductDesc.tsx

"use client";

import { useState } from "react";
import { Star, ShoppingCart, Check } from "lucide-react";
import Image from "next/image";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import ProductTabs from "../layout/productdescpage/ProductTabs";
import ProductImageGallery from "../layout/productdescpage/ProductImageGallery";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function ProductDesc({ product }: { product: Product }) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const { cart, addToCart, increaseQty, decreaseQty, setQty } = useCartStore();

  const cartItem = cart.find((item) => item.id === product.id);

  const features = [
    {
      icon: Truck,
      title: "Free Shipping on €50+",
    },
    {
      icon: RotateCcw,
      title: "30- Day Returns",
    },
    {
      icon: ShieldCheck,
      title: "Quality Guarantee",
    },
  ];

  const highlights = product?.highlights || [];

  const images =
    product.images && product?.images?.length > 0
      ? product.images.map((img: any) => img.url)
      : [
          "/assets/spices/spices-1.png",
          "/assets/spices/spices-2.png",
          "/assets/spices/spices-3.png",
          "/assets/spices/spices-4.png",
        ];

  const [activeImage, setActiveImage] = useState(
    images.length > 0 ? images[0] : "/assets/spices/spices-1.png",
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm sm:text-base">
        <p className="text-[#6A7282] whitespace-nowrap">Home</p>
        <span className="text-[#6A7282]">/</span>

        <p className="text-[#6A7282] whitespace-nowrap">Products</p>
        <span className="text-[#6A7282]">/</span>

        <p className="text-gray-900 font-medium wrap-break-word">
          {product.name}
        </p>
      </div>

      <div className="  grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <ProductImageGallery images={images} name={product.name} />
        </div>

        <div className="space-y-6">
          <span className="inline-block bg-orange-100 text-orange-600 text-sm px-4 py-1 rounded-full">
            {product.badge}
          </span>

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <p className="text-gray-500">Origin: {product.country_of_origin}</p>

          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-orange-500">
              ${product.price}
            </span>
            {/* <span className="line-through text-gray-400 text-xl">
              ${product.oldPrice}
            </span> */}
          </div>

          {/* <p className="text-green-600 font-medium">
            You save ${product.savings}
          </p> */}

          {/* Stock  inStock*/}
          {/* {product.quantity && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
              ✔ In Stock{" "}
              {product.shippingNote ? "-" + product.shippingNote : ""}
            </div>
          )} */}

          {/* Quantity */}

          <div className="flex items-center gap-6">
            {cartItem ? (
              <div className="flex border rounded-lg">
                <button
                  onClick={() => decreaseQty(product.id, isLoggedIn)}
                  className="px-4 py-2"
                >
                  –
                </button>
                <input
                  type="number"
                  min={1}
                  value={cartItem.quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (isNaN(value)) return;

                    setQty(product.id, value, isLoggedIn);
                  }}
                  className="w-16 text-center outline-none"
                />

                <button
                  onClick={() => increaseQty(product.id, isLoggedIn)}
                  className="px-4 py-2"
                >
                  +
                </button>
              </div>
            ) : (
              <></>
            )}

            {/* <span className="text-sm text-gray-500">{product.unit}</span> */}
          </div>

          {cartItem ? (
            <button
              onClick={() => increaseQty(product.id, isLoggedIn)}
              className="w-full bg-green-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <Check size={20} />
              In Cart ({cartItem.quantity})
            </button>
          ) : (
            <button
              onClick={() =>
                addToCart(
                  {
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    image: images[0] || "/images/placeholder.png",
                  },
                  isLoggedIn,
                )
              }
              className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <ShoppingCart size={20} />
              Add To Cart
            </button>
          )}

          <button
            onClick={() =>
              toggleWishlist(
                {
                  id: product.id,
                  name: product.name,
                  image: images[0],
                  price: product.price,
                  slug: product.slug,
                  category_slug: product.category_slug,
                },
                isLoggedIn,
              )
            }
            className={`w-full border py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold transition ${
              isInWishlist(product.id)
                ? "bg-red-500 border-red-500 text-white"
                : "border-gray-300 hover:border-red-500 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                isInWishlist(product.id) ? "fill-white" : ""
              }`}
            />

            {isInWishlist(product.id)
              ? "Remove From Wishlist"
              : "Add To Wishlist"}
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {highlights.map((item: any, idx: any) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <Check size={16} className="text-green-600" />
                {item}
              </div>
            ))}
          </div>
          <section className="w-full mt-10">
            <div className=" w-full grid grid-cols-1 sm:grid-cols-3 gap-12 text-center ">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-4">
                    {/* Icon Circle */}
                    <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                      <Icon
                        className="w-8 h-8 text-orange-500"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Text */}
                    <p className="text-gray-600 text-sm font-medium">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      <ProductTabs product={product} />
    </div>
  );
}

/* <div className="relative w-full h-auto bg-white rounded-2xl overflow-hidden">
            {activeImage && (
              <Image
                src={activeImage}
                alt={product.name}
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto sm:overflow-visible">
            {images.map((img: any, idx: any) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`
                  h-20 w-20 
                  sm:h-24 sm:w-24 
                  md:h-28 md:w-28 
                  lg:h-30 lg:w-80 
                  rounded-xl overflow-hidden border transition
                  ${activeImage === img ? "border-orange-500" : "border-transparent"}`}
              >
                <Image
                  src={img}
                  alt=""
                  width={320}
                  height={120}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div> */

/* 

export default function ProductDesc({ product }: { product: any }) {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping on €50+",
    },
    {
      icon: RotateCcw,
      title: "30- Day Returns",
    },
    {
      icon: ShieldCheck,
      title: "Quality Guarantee",
    },
  ];
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm sm:text-base">
        <p className="text-[#6A7282] whitespace-nowrap">Home</p>
        <span className="text-[#6A7282]">/</span>

        <p className="text-[#6A7282] whitespace-nowrap">Products</p>
        <span className="text-[#6A7282]">/</span>

        <p className="text-gray-900 font-medium wrap-break-word">
          {product.title}
        </p>
      </div>

      <div className="  grid grid-cols-1 lg:grid-cols-2 gap-12">

        <div>
          <div className="relative w-full h-auto bg-white rounded-2xl overflow-hidden">
            {activeImage && (
              <Image
                src={activeImage}
                alt={product.title}
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto sm:overflow-visible">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`
                  h-20 w-20 
                  sm:h-24 sm:w-24 
                  md:h-28 md:w-28 
                  lg:h-30 lg:w-80 
                  rounded-xl overflow-hidden border transition
                  ${activeImage === img ? "border-orange-500" : "border-transparent"}`}
              >
                <Image
                  src={img}
                  alt=""
                  width={320}
                  height={120}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>


        <div className="space-y-6">
          <span className="inline-block bg-orange-100 text-orange-600 text-sm px-4 py-1 rounded-full">
            {product.badge}
          </span>

          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

          <p className="text-gray-500">Origin: {product.origin}</p>

   
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

 
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-orange-500">
              ${product.price}
            </span>
            <span className="line-through text-gray-400 text-xl">
              ${product.oldPrice}
            </span>
          </div>

          <p className="text-green-600 font-medium">
            You save ${product.savings}
          </p>


          {product.inStock && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
              ✔ In Stock – {product.shippingNote}
            </div>
          )}


          <div className="flex items-center gap-6">
            <div className="flex border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2"
              >
                –
              </button>
              <span className="px-6 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">{product.unit}</span>
          </div>


          <button className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold">
            <ShoppingCart size={20} />
            Add To Cart
          </button>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {product.highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <Check size={16} className="text-green-600" />
                {item}
              </div>
            ))}
          </div>
          <section className="w-full mt-10">
            <div className=" w-full grid grid-cols-1 sm:grid-cols-3 gap-12 text-center ">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-4">
    
                    <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                      <Icon
                        className="w-8 h-8 text-orange-500"
                        strokeWidth={1.5}
                      />
                    </div>

                    <p className="text-gray-600 text-sm font-medium">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      <ProductTabs />
    </div>
  );
}
  const product = {
    id: 1,
    badge: "Premium",
    title: "Premium Saffron Threads",
    origin: "Kashmir, India",
    rating: 4.9,
    reviews: 234,
    price: 39.99,
    oldPrice: 69.99,
    savings: 30,
    inStock: true,
    shippingNote: "Ships Within 24 hours",
    unit: "5g per unit",
    images: [
      "/assets/about/team_members/0c9370500dd26baeb4d0de61235ccf441c9ef25d.jpg",
      "/assets/about/team_members/3f33034cab8648ae5774a5bc97a159b0168c9ab6.jpg",
      "/assets/about/team_members/3181632c57d272bf3317db926d6aba5997095adb.jpg",
      "/assets/about/team_members/cc3cd5afeccc137c2a773e9c86163afd48953606.jpg",
    ],
    highlights: [
      "Grade A Premium Quality",
      "Hand-picked threads",
      "Rich aroma and color",
      "100% Pure & Natural",
      "Lab tested for authenticity",
      "Certified Organic",
    ],
  };
*/
