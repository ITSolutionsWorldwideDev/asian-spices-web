"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Heart, Home } from "lucide-react";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import Cart from "@/components/ui/Cart";
import { createPortal } from "react-dom";
import { FaL } from "react-icons/fa6";

import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";

interface NavChildren {
  name?: string;
  image?: string;
  href?: string;
  heading?: string;
  category?: { name: string; href: string }[];
}

interface NavLink {
  name: string;
  hreflink?: string | undefined;
  children?: NavChildren[];
}
const ResponsiveNavigation = () => {
  const [activeLink, setActiveLink] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleClick = (name: string) => {
    setActiveLink(name);
    setIsMenuOpen(!isMenuOpen);
  };

  const { data: session } = useSession();

  const { cart } = useCartStore();

  const itemInCart = cart.length;

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "auto";
  }, [mobileMenu]);

  const navLinks: NavLink[] = [
    {
      name: "Shop by Category",
      hreflink: "#",
      children: [
        {
          name: "Asian Spices & Seasonings",
          image: "spices.png",
          href: "spices",
        },
        {
          name: "Kitchen Appliances & Cooking Tools",
          image: "kitchen-appliances.png",
          href: "kitchen-appliances",
        },
        {
          name: "Asian Foods & Beverages",
          image: "foods-beverages.png",
          href: "foods-beverages",
        },
      ],
    },

    {
      name: "Healthy Living",
      hreflink: "#",
      children: [
        {
          heading: "Health Benefits of Herbs",
          category: [
            {
              name: "Supports Immunity",
              href: "healthyliving/supports-immunity",
            },
            {
              name: "Aids Digestion",
              href: "healthyliving/aids-digestion",
            },
            {
              name: "Promotes Relaxation",
              href: "healthyliving/promotes-relaxation",
            },
            {
              name: "Enhances Energy Levels",
              href: "healthyliving/enhances-energy-levels",
            },
          ],
        },
        {
          heading: "Herbal Food Supplements",
          category: [
            { name: "Capsules", href: "healthyliving/capsules" },
            { name: "Powders", href: "healthyliving/powders" },
            { name: "Teas", href: "healthyliving/teas" },
          ],
        },
        {
          heading: "Herbal Skin Products",
          category: [
            { name: "Face oils", href: "healthyliving/face-oils" },
            { name: "Creams", href: "healthyliving/creams" },
            { name: "Cleansers", href: "healthyliving/cleansers" },
          ],
        },
        {
          heading: "Herbal Hair Products",
          category: [
            { name: "Hair oils", href: "healthyliving/hair-oils" },
            { name: "Shampoos", href: "healthyliving/shampoos" },
            { name: "Hair masks", href: "healthyliving/hair-masks" },
          ],
        },
      ],
    },
    { name: "Authentic Asian Recipes", hreflink: "recipes" },
    // { name: "Partner Platform", hreflink: "partnerplatform" },
  ];

  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  return (
    <>
      {/* mobilemenubtn */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="text-white p-0 m-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        >
          {mobileMenu ? (
            <RxCross1 className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* desktop navigatio */}
      <div className="hidden lg:flex items-center space-x-4 ">
        {/* <ul className=" flex items-center rounded-full  py-2 space-x-6 bg-white/30 backdrop-blur shadow-inner p-10"> */}
        <ul className="flex items-center rounded-full py-2 px-6 space-x-2 bg-white/30 backdrop-blur shadow-inner">
          {navLinks.map((link) => (
            <li key={link.name} className="relative">
              {link.name.toLocaleLowerCase() == "home" ? (
                <Link
                  href={`/`}
                  onClick={() => handleClick(link.name)}
                  className={`relative px-2 py-2 text-sm font-semibold transition-colors duration-200
                     ${activeLink === link.name ? "text-amber-300" : "text-white/90 hover:text-amber-200"}`}
                >
                  {/* {link.name} */}
                  <Home size={16} />

                  {activeLink === link.name && (
                    <span className="absolute left-0 right-0 bottom-0 h-1 bg-amber-400 w-full mx-auto rounded-full"></span>
                  )}
                </Link>
              ) : !link.children ? (
                <Link
                  href={`/${link?.hreflink
                    ?.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .trim()
                    .replace(/\s+/g, "")}`}
                  onClick={() => handleClick(link.name)}
                  className={`relative px-2 py-2 text-sm font-semibold transition-colors duration-200 flex text-center
                     ${activeLink === link.name ? "text-amber-300" : "text-white/90 hover:text-amber-200"}`}
                >
                  {link.name}

                  {activeLink === link.name && (
                    <span className="absolute left-0 right-0 bottom-0 h-1 bg-amber-400 w-3/4 mx-auto rounded-full"></span>
                  )}
                </Link>
              ) : (
                <>
                  {/* DROPDOWN BUTTON */}
                  <button
                    onClick={() => handleClick(link.name)}
                    className={`relative px-2 py-2 text-sm font-semibold transition-colors duration-200 flex items-center
                        ${activeLink === link.name ? "text-amber-300" : "text-white/90 hover:text-amber-200"}
            `}
                  >
                    {link.name}
                    <ChevronDown className="ml-1 h-4 w-4" />

                    {activeLink === link.name && (
                      <span className="absolute left-0 right-0 bottom-0 h-1 bg-amber-400 w-3/4 mx-auto rounded-full"></span>
                    )}
                  </button>

                  {/* DROPDOWN MENU */}
                  {activeLink === link.name && isMenuOpen && (
                    <div className="absolute top-full mt-5 z-50">
                      {link.name === "Healthy Living" ? (
                        /* Changed from 'fixed' to 'absolute' and offset to align gracefully on screen */
                        <div className="absolute top-full -left-48 xl:-left-64 z-50">
                          <div className="w-[85vw] max-w-5xl bg-gray-100 rounded-xl shadow-md border border-gray-200 overflow-hidden">
                            {/* Top Section */}
                            <div className="grid grid-cols-4 gap-8 p-6">
                              {link.children.map((section, index) => (
                                <div key={index}>
                                  <h3
                                    className={`font-semibold text-gray-800 mb-3 ${
                                      index === 0
                                        ? "border-b-2 border-blue-400 inline-block"
                                        : ""
                                    }`}
                                  >
                                    {section.heading}
                                  </h3>

                                  <ul className="space-y-2 text-gray-600 text-sm">
                                    {section.category?.map((item, i) => (
                                      <li
                                        key={i}
                                        className="hover:text-black cursor-pointer transition-colors"
                                      >
                                        <Link href={`/${item.href}`}>
                                          {item.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>

                            <div className="bg-orange-100 px-6 py-4 rounded-b-xl">
                              <button className="text-orange-600 font-medium hover:underline">
                                View All {link.name} Products →
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <ul className="bg-white text-black shadow-lg rounded-lg w-64">
                          {link.children.map((child) => (
                            <li key={child.name}>
                              <Link
                                href={`/${child.href}`}
                                className="flex items-center px-4 py-2 hover:bg-amber-800 hover:text-white transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {child.image && (
                                  <img
                                    src={`/assets/navbar/${child.image}`}
                                    alt={child.name}
                                    className="w-12 h-7 object-cover rounded-md"
                                  />
                                )}
                                <span className="ml-5 font-bold">
                                  {child.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* mobile navigation */}
      {mobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileMenu(false)}
          />

          <div className="fixed inset-x-0 top-[100px] z-50 bg-amber-900/95 shadow-xl rounded-b-lg lg:hidden max-h-[80vh] overflow-y-auto ">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="border-b border-amber-800 last:border-b-0"
              >
                {/* NON-DROPDOWN LINKS */}
                {!link.children ? (
                  <Link
                    href={
                      link.name.toLowerCase() === "home"
                        ? "/"
                        : `/${link.name
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, "")
                            .trim()
                            .replace(/\s+/g, "")}`
                    }
                    onClick={() => {
                      handleClick(link.name);
                      setMobileMenu(!mobileMenu);
                    }}
                    className={`block px-4 py-3 text-lg transition-colors duration-200 ${
                      activeLink === link.name
                        ? "text-amber-300 bg-amber-800/50"
                        : "text-white/90 hover:bg-amber-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => handleClick(link.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-lg transition-colors duration-200 ${
                        activeLink === link.name
                          ? "text-amber-300 bg-amber-800/50"
                          : "text-white/90 hover:bg-amber-800"
                      }`}
                    >
                      {link.name}
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {activeLink === link.name && (
                      <div className="bg-amber-800/60">
                        {link.children.map((child, ind) => (
                          <div key={ind}>
                            {link.name === "Category" ? (
                              <Link
                                href={`/${child.href}`}
                                onClick={() => setMobileMenu(false)}
                                className="relative z-600 flex items-center gap-4 px-6 py-3 text-white/90 hover:bg-amber-700 transition-colors"
                              >
                                <img
                                  src={`/assets/navbar/${child.image}`}
                                  alt={child.name}
                                  className="w-12 h-7 object-cover rounded-md"
                                />

                                <span className="font-semibold">
                                  {child.name}
                                </span>
                              </Link>
                            ) : (
                              <div>
                                <h3 className="px-6 py-2 text-sm font-bold text-gray-300 uppercase">
                                  {child.name}
                                </h3>

                                {child.category && (
                                  <div>
                                    <button
                                      onClick={() =>
                                        setActiveSection(
                                          activeSection === child.heading
                                            ? null
                                            : (child.heading ?? null),
                                        )
                                      }
                                      className="w-full flex justify-between items-center px-6 py-3 text-sm font-bold text-gray-300 uppercase"
                                    >
                                      {child.heading}

                                      <ChevronDown
                                        className={`transition-transform duration-300 ${
                                          activeSection === child.heading
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                      />
                                    </button>

                                    {activeSection === child.heading &&
                                      child.category.map((item) => (
                                        <Link
                                          key={item.name}
                                          href={`/${item.href}`}
                                          onClick={() => setMobileMenu(false)}
                                          className="flex items-center ml-4 gap-4 px-6 py-3 text-white/90 hover:bg-amber-700 transition-colors"
                                        >
                                          <span className="">{item.name}</span>
                                        </Link>
                                      ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <div
              className="p-4 flex flex-col space-y-2"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <div className="">
                {session ? (
                  <div className="bg-white rounded-xl p-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      {session.user?.email}
                    </p>

                    <Link
                      href="/account"
                      className="block text-sm font-medium text-gray-800"
                    >
                      My Account
                    </Link>

                    <Link
                      href="/account/orders"
                      className="block text-sm font-medium text-gray-800"
                    >
                      Orders
                    </Link>

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-left text-sm text-red-500 font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-full px-6 py-3 text-center">
                    <Link href="/login" className="font-bold">
                      Login
                    </Link>
                    {/* {" / "}
                    <Link href="/signup" className="font-bold">
                      Signup
                    </Link> */}
                  </div>
                )}
              </div>

              <div className=" bg-white rounded-full   ">
                <div className=" px-6 py-3 rounded-full flex justify-center">
                  <button className="  font-bold   hover:shadow-xl transform cursor-pointer hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 ">
                    <Link href="/contactus">Contact Us</Link>
                  </button>
                </div>
              </div>
            </div>

            {/* cart and wish button */}
            <div className="flex items-center space-x-3 justify-center mb-4">
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
          </div>
        </>
      )}
    </>
  );
};

export default ResponsiveNavigation;
