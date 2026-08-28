"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Home,
  LayoutGrid,
  Heart,
  ShoppingCart,
  Headphones,
  BookOpen,
  CircleUserRound,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

/** Existing Healthy Living sections from the nav, with card copy + images for the mobile drawer */
const HEALTHY_LIVING_CARDS = [
  {
    heading: "Health Benefits of Herbs",
    description: "Natural wellness guide.",
    image: "/assets/healtyliving/supports-immunity.png",
    items: [
      { name: "Supports Immunity", href: "healthyliving/supports-immunity" },
      { name: "Aids Digestion", href: "healthyliving/aids-digestion" },
      { name: "Promotes Relaxation", href: "healthyliving/promotes-relaxation" },
      { name: "Enhances Energy Levels", href: "healthyliving/enhances-energy-levels" },
    ],
  },
  {
    heading: "Herbal Food Supplements",
    description: "Capsules, powders & teas.",
    image: "/assets/healtyliving/capsules.png",
    items: [
      { name: "Capsules", href: "healthyliving/capsules" },
      { name: "Powders", href: "healthyliving/powders" },
      { name: "Teas", href: "healthyliving/teas" },
    ],
  },
  {
    heading: "Herbal Skin Products",
    description: "Face oils, creams & cleansers.",
    image: "/assets/healtyliving/face-oils.png",
    items: [
      { name: "Face oils", href: "healthyliving/face-oils" },
      { name: "Creams", href: "healthyliving/creams" },
      { name: "Cleansers", href: "healthyliving/cleansers" },
    ],
  },
  {
    heading: "Herbal Hair Products",
    description: "Hair oils, shampoos & masks.",
    image: "/assets/healtyliving/hair-oils.png",
    items: [
      { name: "Hair oils", href: "healthyliving/hair-oils" },
      { name: "Shampoos", href: "healthyliving/shampoos" },
      { name: "Hair masks", href: "healthyliving/hair-masks" },
    ],
  },
] as const;

interface NavCategoryItem {
  name: string;
  href: string;
}

interface NavChildren {
  name?: string;
  image?: string;
  href?: string;
  heading?: string;
  category?: NavCategoryItem[];
}

interface NavLink {
  name: string;
  hreflink?: string;
  children?: NavChildren[];
}

interface ResponsiveNavigationProps {
  mobileOnly?: boolean;
}

const ResponsiveNavigation = ({ mobileOnly = false }: ResponsiveNavigationProps) => {
  const [activeLink, setActiveLink] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [shopCategoryChildren, setShopCategoryChildren] = useState<NavChildren[]>([]);
  const [shopCategoriesLoading, setShopCategoriesLoading] = useState(true);
  const [activeShopCategory, setActiveShopCategory] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { data: session } = useSession();
  const { cart } = useCartStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const itemInCart = cart.length;
  const clearCart = useCartStore((s) => s.clearCart);

  const handleClick = (name: string) => {
    if (activeLink === name && isMenuOpen) {
      setIsMenuOpen(false);
      setActiveLink("");
    } else {
      setActiveLink(name);
      setIsMenuOpen(true);
    }
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "auto";
  }, [mobileMenu]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !Array.isArray(json?.categories)) return;
        setShopCategoryChildren(
          json.categories.map(
            (cat: {
              name: string;
              slug: string;
              subcategories: { id: string; name: string; slug: string }[];
            }) => ({
              heading: cat.name,
              category: [
                { name: "View all", href: cat.slug },
                ...cat.subcategories.map((sub) => ({
                  name: sub.name,
                  href: `${cat.slug}/${sub.slug}`,
                })),
              ],
            }),
          ),
        );
        setActiveShopCategory(0);
      })
      .catch((error) => console.error("Failed to load categories:", error))
      .finally(() => {
        if (!cancelled) setShopCategoriesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

 const navLinks: NavLink[] = useMemo(
    () => [
      {
        name: "Shop by Category",
        hreflink: "#",
        children: shopCategoryChildren,
      },
      {
        name: "Healthy Living",
        hreflink: "#",
        children: [
          {
            heading: "Health Benefits",
            category: [
              { name: "Sleep & Stress Relief", href: "healthyliving/sleep-stress-relief" },
              { name: "Immune Support", href: "healthyliving/immune-support" },
              { name: "Digestion & Gut Health", href: "healthyliving/digestion-gut-health" },
              { name: "Joint, Skin & Hair Health", href: "healthyliving/joint-skin-hair-health" },
              { name: "Grandma's Kitchen Remedies", href: "healthyliving/grandmas-kitchen-remedies" },
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
    ],
    [shopCategoryChildren],
  );

  const activeDropdownLink = navLinks.find(
    (link) => link.children && activeLink === link.name && isMenuOpen,
  );

  const selectedShopCategory =
    shopCategoryChildren[activeShopCategory] || shopCategoryChildren[0];
  const shopSubcategories =
    selectedShopCategory?.category?.filter((item) => item.name !== "View all") || [];
  const shopViewAllHref =
    selectedShopCategory?.category?.find((item) => item.name === "View all")?.href ||
    "products";

  const closeMegaMenu = () => {
    setIsMenuOpen(false);
    setActiveLink("");
  };

  const megaMenu =
    mounted &&
    activeDropdownLink?.children &&
    createPortal(
      <div
        className="hidden xl:block"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: "5.5rem",
          bottom: 0,
          zIndex: 999998,
        }}
        role="presentation"
      >
        <div className="absolute inset-0" onClick={closeMegaMenu} />
        <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center px-4 sm:px-6">
          <div className="pointer-events-auto w-full max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xl shadow-stone-200/50">
              {/* Shop by Category: left categories / right subcategories */}
              {activeDropdownLink.name === "Shop by Category" ? (
                shopCategoriesLoading ? (
                  <p className="p-6 text-sm text-gray-500">Loading categories...</p>
                ) : (
                  <>
                    <div className="flex h-[20rem]">
                      {/* Left: categories */}
                      <aside className="flex w-[15.5rem] shrink-0 flex-col border-r border-stone-200/80 bg-[#faf8f5]">
                        <p className="px-5 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                          Categories
                        </p>
                        <div className="flex-1 space-y-0.5 overflow-y-auto px-2.5 pb-3">
                          {shopCategoryChildren.map((section, index) => {
                            const isActive = activeShopCategory === index;
                            return (
                              <button
                                key={index}
                                type="button"
                                onMouseEnter={() => setActiveShopCategory(index)}
                                onClick={() => setActiveShopCategory(index)}
                                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                                  isActive
                                    ? "bg-white text-stone-900 shadow-sm ring-1 ring-orange-200/70"
                                    : "text-stone-600 hover:bg-white/80 hover:text-stone-900"
                                }`}
                              >
                                <span
                                  className={`truncate text-[13px] ${
                                    isActive ? "font-semibold" : "font-medium"
                                  }`}
                                >
                                  {section.heading}
                                </span>
                                <ChevronRight
                                  className={`h-3.5 w-3.5 shrink-0 transition ${
                                    isActive
                                      ? "text-orange-500"
                                      : "text-stone-300 group-hover:text-stone-400"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </aside>

                      {/* Right: subcategories */}
                      <div className="flex flex-1 flex-col overflow-hidden bg-white">
                        <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-6 py-3.5">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                              Subcategories
                            </p>
                            <h3 className="mt-0.5 text-[15px] font-semibold text-stone-900">
                              {selectedShopCategory?.heading || "Category"}
                            </h3>
                          </div>
                          <Link
                            href={`/${shopViewAllHref}`}
                            onClick={closeMegaMenu}
                            className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-100"
                          >
                            View all
                          </Link>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-4">
                          {shopSubcategories.length === 0 ? (
                            <div className="flex h-full items-center justify-center">
                              <p className="text-sm text-stone-400">No subcategories yet</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                              {shopSubcategories.map((item, i) => (
                                <Link
                                  key={`${item.href}-${i}`}
                                  href={`/${item.href}`}
                                  onClick={closeMegaMenu}
                                  className="rounded-xl border border-transparent px-3 py-2.5 text-[13px] font-medium text-stone-600 transition hover:border-orange-100 hover:bg-orange-50/60 hover:text-orange-700"
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-stone-100 bg-[#fff7ed] px-6 py-3">
                      <Link
                        href="/products"
                        onClick={closeMegaMenu}
                        className="text-sm font-semibold text-orange-600 transition hover:text-orange-700"
                      >
                        View All Products →
                      </Link>
                    </div>
                  </>
                )
              ) : (
                /* Healthy Living (and others): keep existing columns */
                <>
                  <div
                    className={`grid gap-8 p-6 ${
                      activeDropdownLink.children.length >= 4 ? "grid-cols-4" : "grid-cols-3"
                    }`}
                  >
                    {activeDropdownLink.children.map((section, index) => (
                      <div key={index}>
                        <h3 className="mb-3 font-semibold text-gray-800">{section.heading}</h3>
                        <ul className="max-h-64 space-y-2 overflow-y-auto text-sm text-gray-600">
                          {section.category?.map((item, i) => (
                            <li key={`${item.href}-${i}`}>
                              <Link
                                href={`/${item.href}`}
                                className="hover:text-black"
                                onClick={closeMegaMenu}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {/* <div className="rounded-b-xl bg-orange-100 px-6 py-4">
                    <Link
                      href="/healthyliving/supports-immunity"
                      onClick={closeMegaMenu}
                      className="font-medium text-orange-600 hover:underline"
                    >
                      View All {activeDropdownLink.name} Products →
                    </Link>
                  </div> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );

  // ── Mobile-only: white drawer matching design (existing options only) ──
  if (mobileOnly) {
    const closeMobileMenu = () => {
      setMobileMenu(false);
      setActiveLink("");
      setActiveSection(null);
    };

    const openMenu = () => {
      setMobileMenu(true);
      // Match screenshot: Healthy Living open by default
      setActiveLink("Healthy Living");
    };

    const shopExpanded = activeLink === "Shop by Category";
    const healthyExpanded = activeLink === "Healthy Living";

    const linkRow =
      "flex w-full items-center gap-3.5 border-b border-gray-100 px-5 py-[1.125rem] text-left transition active:bg-gray-50";

    return (
      <>
        <button
          type="button"
          onClick={openMenu}
          className="relative z-50 rounded-lg p-2 text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {mobileMenu &&
          createPortal(
            <>
              <div
                className="fixed inset-0 z-[1000000] bg-black/35 xl:hidden"
                onClick={closeMobileMenu}
                aria-hidden
              />

              <nav
                className="fixed inset-x-0 top-0 z-[1000001] max-h-[94vh] overflow-y-auto rounded-b-2xl bg-white shadow-xl xl:hidden"
                aria-label="Mobile menu"
              >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-5 py-4">
                  <span className="text-[1.125rem] font-bold text-[#1c2b22]">
                    Asian Spices
                  </span>
                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-800"
                    aria-label="Close menu"
                  >
                    <X className="h-[18px] w-[18px]" strokeWidth={2} />
                  </button>
                </div>

                <div className="border-t border-gray-100">
                  {/* Home */}
                  <Link href="/" onClick={closeMobileMenu} className={linkRow}>
                    <Home className="h-[22px] w-[22px] shrink-0 text-gray-800" strokeWidth={1.6} />
                    <span className="flex-1 text-[15px] font-normal text-gray-900">Home</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                  </Link>

                  {/* Shop By Categories — existing shop categories */}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveLink(shopExpanded ? "Healthy Living" : "Shop by Category")
                    }
                    className={linkRow}
                  >
                    <LayoutGrid className="h-[22px] w-[22px] shrink-0 text-gray-800" strokeWidth={1.6} />
                    <span className="flex-1 text-[15px] font-normal text-gray-900">
                      Shop By Categories
                    </span>
                    {shopExpanded ? (
                      <ChevronDown className="h-4 w-4 shrink-0 rotate-180 text-gray-400" strokeWidth={2} />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                    )}
                  </button>
                  {shopExpanded && (
                    <div className="border-b border-gray-100 bg-white">
                      {shopCategoriesLoading ? (
                        <p className="px-5 py-3 text-sm text-gray-400">Loading...</p>
                      ) : (
                        shopCategoryChildren.map((child, ind) => {
                          const categoryHref =
                            child.category?.find((item) => item.name === "View all")?.href ||
                            "products";
                          return (
                            <Link
                              key={ind}
                              href={`/${categoryHref}`}
                              onClick={closeMobileMenu}
                              className="flex items-center gap-3 border-b border-gray-50 px-5 py-3.5 last:border-b-0"
                            >
                              <span className="flex-1 text-[14px] font-medium text-gray-800">
                                {child.heading}
                              </span>
                              <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
                            </Link>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* HEALTHY LIVING — existing sections as cards */}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveLink(healthyExpanded ? "" : "Healthy Living")
                    }
                    className="flex w-full items-center gap-3.5 border-b border-gray-100 px-5 py-[1.125rem] text-left transition active:bg-gray-50"
                  >
                    <span className="flex-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-400">
                      Healthy Living
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
                        healthyExpanded ? "rotate-180" : ""
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                  {healthyExpanded && (
                    <div className="border-b border-gray-100">
                      {HEALTHY_LIVING_CARDS.map((card) => {
                        const sectionOpen = activeSection === card.heading;
                        return (
                          <div key={card.heading} className="border-b border-gray-100 last:border-b-0">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveSection(sectionOpen ? null : card.heading)
                              }
                              className="flex w-full items-center gap-3.5 px-5 py-3.5 text-left active:bg-gray-50"
                            >
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                <Image
                                  src={card.image}
                                  alt={card.heading}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[15px] font-semibold leading-snug text-gray-900">
                                  {card.heading}
                                </p>
                                <p className="mt-0.5 text-[13px] leading-snug text-gray-400">
                                  {card.description}
                                </p>
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 shrink-0 text-gray-300 transition-transform ${
                                  sectionOpen ? "rotate-180" : ""
                                }`}
                                strokeWidth={2}
                              />
                            </button>

                            {sectionOpen && (
                              <div className="bg-gray-50 pb-1">
                                {card.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={`/${item.href}`}
                                    onClick={closeMobileMenu}
                                    className="flex items-center gap-3 px-5 py-3 pl-[5.25rem] active:bg-gray-100"
                                  >
                                    <span className="flex-1 text-[14px] text-gray-700">
                                      {item.name}
                                    </span>
                                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Authentic Asian Recipes */}
                  <Link href="/recipes" onClick={closeMobileMenu} className={linkRow}>
                    <BookOpen className="h-[22px] w-[22px] shrink-0 text-gray-800" strokeWidth={1.6} />
                    <span className="flex-1 text-[15px] font-normal text-gray-900">
                      Authentic Asian Recipes
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                  </Link>

                  {/* Wishlist */}
                  <Link href="/wishlist" onClick={closeMobileMenu} className={linkRow}>
                    <Heart className="h-[22px] w-[22px] shrink-0 text-gray-800" strokeWidth={1.6} />
                    <span className="flex-1 text-[15px] font-normal text-gray-900">Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="mr-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {wishlistCount > 99 ? "99+" : wishlistCount}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                  </Link>

                  {/* Cart */}
                  <Link href="/cart" onClick={closeMobileMenu} className={linkRow}>
                    <ShoppingCart className="h-[22px] w-[22px] shrink-0 text-gray-800" strokeWidth={1.6} />
                    <span className="flex-1 text-[15px] font-normal text-gray-900">Cart</span>
                    {itemInCart > 0 && (
                      <span className="mr-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {itemInCart > 99 ? "99+" : itemInCart}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                  </Link>

                  {/* Contact us */}
                  <Link href="/contact-us" onClick={closeMobileMenu} className={linkRow}>
                    <Headphones className="h-[22px] w-[22px] shrink-0 text-gray-800" strokeWidth={1.6} />
                    <span className="flex-1 text-[15px] font-normal text-gray-900">Contact us</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                  </Link>

                  {/* Login / Account */}
                  {session ? (
                    <>
                      <Link href="/account" onClick={closeMobileMenu} className={linkRow}>
                        <CircleUserRound className="h-[22px] w-[22px] shrink-0 text-gray-800" strokeWidth={1.6} />
                        <span className="flex-1 text-[15px] font-normal text-gray-900">My Account</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                      </Link>
                      <Link href="/account/orders" onClick={closeMobileMenu} className={linkRow}>
                        <CircleUserRound className="h-[22px] w-[22px] shrink-0 text-gray-800" strokeWidth={1.6} />
                        <span className="flex-1 text-[15px] font-normal text-gray-900">Orders</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          closeMobileMenu();
                          clearCart(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className={linkRow}
                      >
                        <CircleUserRound className="h-[22px] w-[22px] shrink-0 text-red-500" strokeWidth={1.6} />
                        <span className="flex-1 text-[15px] font-normal text-red-500">Logout</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                      </button>
                    </>
                  ) : (
                    <Link href="/login" onClick={closeMobileMenu} className={linkRow}>
                      <CircleUserRound className="h-[22px] w-[22px] shrink-0 text-gray-800" strokeWidth={1.6} />
                      <span className="flex-1 text-[15px] font-normal text-gray-900">Login</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                    </Link>
                  )}
                </div>
              </nav>
            </>,
            document.body,
          )}
      </>
    );
  }

  // ── Desktop: nav links rendered inside the pill bar ──
  return (
    <>
      {megaMenu}

      <ul className="flex shrink-0 items-center">
        {navLinks.map((link, idx) => (
          <React.Fragment key={link.name}>
            <li className="relative">
              {!link.children ? (
                <Link
                  href={`/${(link.hreflink || link.name)
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .trim()
                    .replace(/\s+/g, "")}`}
                  onClick={() => handleClick(link.name)}
                  className={`flex items-center whitespace-nowrap px-3 py-1.5 text-sm font-semibold transition-colors duration-200 ${
                    activeLink === link.name ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleClick(link.name)}
                  className={`flex items-center whitespace-nowrap px-3 py-1.5 text-sm font-semibold transition-colors duration-200 ${
                    activeLink === link.name ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
                  }`}
                >
                  {link.name}
                  <ChevronDown className="ml-1 h-3.5 w-3.5" />
                </button>
              )}
            </li>
            {idx < navLinks.length - 1 && (
              <span className="mx-0.5 h-4 w-px shrink-0 bg-gray-300" aria-hidden />
            )}
          </React.Fragment>
        ))}
      </ul>
    </>
  );
};

export default ResponsiveNavigation;
