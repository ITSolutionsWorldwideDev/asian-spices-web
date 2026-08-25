"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";

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

const SHOP_CATEGORIES = [
  { heading: "Asian Spices & Seasonings", slug: "spices" },
  { heading: "Asian Foods & Beverages", slug: "foods-beverages" },
  { heading: "Kitchen Appliances & Cooking Tools", slug: "kitchen-appliances" },
] as const;

type SubcategoryRow = { id: string; name: string };

interface ResponsiveNavigationProps {
  mobileOnly?: boolean;
}

const ResponsiveNavigation = ({ mobileOnly = false }: ResponsiveNavigationProps) => {
  const [activeLink, setActiveLink] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [shopCategoryChildren, setShopCategoryChildren] = useState<NavChildren[]>(
    SHOP_CATEGORIES.map((cat) => ({
      heading: cat.heading,
      category: [{ name: "View all", href: cat.slug }],
    })),
  );
  const [shopCategoriesLoading, setShopCategoriesLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: session } = useSession();
  const { cart } = useCartStore();
  const itemInCart = cart.length;

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

    const loadShopSubcategories = async () => {
      setShopCategoriesLoading(true);
      try {
        const results = await Promise.all(
          SHOP_CATEGORIES.map(async (cat) => {
            const res = await fetch(`/api/category/${cat.slug}`);
            const json = await res.json();
            const subcategories: SubcategoryRow[] = Array.isArray(json?.subcategories)
              ? json.subcategories
              : [];
            const categoryLinks: NavCategoryItem[] = [
              { name: "View all", href: cat.slug },
              ...subcategories.map((sub) => ({
                name: sub.name,
                href: `${cat.slug}?subcategories=${sub.id}`,
              })),
            ];
            return { heading: cat.heading, category: categoryLinks } satisfies NavChildren;
          }),
        );
        if (!cancelled) setShopCategoryChildren(results);
      } catch (error) {
        console.error("Failed to load shop subcategories:", error);
      } finally {
        if (!cancelled) setShopCategoriesLoading(false);
      }
    };

    loadShopSubcategories();
    return () => { cancelled = true; };
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
          // Below the nav (999999), above all page content
          zIndex: 999998,
        }}
        role="presentation"
      >
        {/* Backdrop starts BELOW the navbar so nav stays clickable */}
        <div
          className="absolute inset-0"
          onClick={() => { setIsMenuOpen(false); setActiveLink(""); }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center px-4 sm:px-6">
          <div className="pointer-events-auto w-full max-w-5xl">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-md">
              <div
                className={`grid gap-8 p-6 ${
                  activeDropdownLink.children.length >= 4 ? "grid-cols-4" : "grid-cols-3"
                }`}
              >
                {activeDropdownLink.name === "Shop by Category" && shopCategoriesLoading ? (
                  <p className="col-span-full text-sm text-gray-500">Loading categories...</p>
                ) : (
                  activeDropdownLink.children.map((section, index) => (
                    <div key={index}>
                      <h3
                        className={`mb-3 font-semibold text-gray-800 ${
                          index === 0 ? "inline-block border-b-2 border-blue-400" : ""
                        }`}
                      >
                        {section.heading}
                      </h3>
                      <ul className="max-h-64 space-y-2 overflow-y-auto text-sm text-gray-600">
                        {section.category?.map((item, i) => (
                          <li key={`${item.href}-${i}`} className="cursor-pointer transition-colors hover:text-black">
                            <Link
                              href={`/${item.href}`}
                              onClick={() => { setIsMenuOpen(false); setActiveLink(""); }}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
              <div className="rounded-b-xl bg-orange-100 px-6 py-4">
                <Link
                  href={
                    activeDropdownLink.name === "Shop by Category"
                      ? "/products"
                      : "/healthyliving/supports-immunity"
                  }
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveLink("");
                  }}
                  className="font-medium text-orange-600 hover:underline"
                >
                  {activeDropdownLink.name === "Shop by Category"
                    ? "View All Products →"
                    : `View All ${activeDropdownLink.name} Products →`}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );

  // ── Mobile-only: renders the hamburger + slide-out panel ──
  if (mobileOnly) {
    return (
      <>
        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-lg p-2 text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label={mobileMenu ? "Close menu" : "Open menu"}
        >
          {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {mobileMenu && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setMobileMenu(false)}
            />
            <div className="fixed inset-x-0 top-[72px] z-50 max-h-[80vh] overflow-y-auto rounded-b-lg bg-amber-900/95 shadow-xl xl:hidden">
              {navLinks.map((link) => (
                <div key={link.name} className="border-b border-amber-800 last:border-b-0">
                  {!link.children ? (
                    <Link
                      href={
                        link.name.toLowerCase() === "home"
                          ? "/"
                          : `/${(link.hreflink || link.name)
                              .toLowerCase()
                              .replace(/[^a-z0-9\s-]/g, "")
                              .trim()
                              .replace(/\s+/g, "")}`
                      }
                      onClick={() => { handleClick(link.name); setMobileMenu(false); }}
                      className={`block px-4 py-3 text-lg transition-colors duration-200 ${
                        activeLink === link.name ? "bg-amber-800/50 text-amber-300" : "text-white/90 hover:bg-amber-800"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleClick(link.name)}
                        className={`flex w-full items-center justify-between px-4 py-3 text-lg transition-colors duration-200 ${
                          activeLink === link.name ? "bg-amber-800/50 text-amber-300" : "text-white/90 hover:bg-amber-800"
                        }`}
                      >
                        {link.name}
                        <ChevronDown className="h-4 w-4" />
                      </button>

                      {activeLink === link.name && (
                        <div className="bg-amber-800/60">
                          {link.children.map((child, ind) => {
                            if (link.name === "Shop by Category") {
                              const categoryHref =
                                child.category?.find((item) => item.name === "View all")?.href ||
                                SHOP_CATEGORIES.find((cat) => cat.heading === child.heading)?.slug ||
                                child.href;
                              return (
                                <Link
                                  key={ind}
                                  href={`/${categoryHref}`}
                                  onClick={() => setMobileMenu(false)}
                                  className="flex items-center justify-between px-6 py-3 text-sm font-bold uppercase text-white/90 transition-colors hover:bg-amber-700"
                                >
                                  {child.heading}
                                </Link>
                              );
                            }

                            if (child.category) {
                              return (
                                <div key={ind}>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveSection(activeSection === child.heading ? null : (child.heading ?? null))
                                    }
                                    className="flex w-full items-center justify-between px-6 py-3 text-sm font-bold uppercase text-gray-300"
                                  >
                                    {child.heading}
                                    <ChevronDown
                                      className={`transition-transform duration-300 ${
                                        activeSection === child.heading ? "rotate-180" : ""
                                      }`}
                                    />
                                  </button>
                                  {activeSection === child.heading &&
                                    child.category.map((item) => (
                                      <Link
                                        key={item.name}
                                        href={`/${item.href}`}
                                        onClick={() => setMobileMenu(false)}
                                        className="ml-4 flex items-center gap-4 px-6 py-3 text-white/90 transition-colors hover:bg-amber-700"
                                      >
                                        {item.name}
                                      </Link>
                                    ))}
                                </div>
                              );
                            }

                            return (
                              <Link
                                key={ind}
                                href={`/${child.href}`}
                                onClick={() => setMobileMenu(false)}
                                className="flex items-center gap-4 px-6 py-3 text-white/90 transition-colors hover:bg-amber-700"
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-2 p-4">
                {session ? (
                  <div className="space-y-2 rounded-xl bg-white p-4">
                    <p className="text-sm font-semibold text-gray-700">{session.user?.email}</p>
                    <Link href="/account" className="block text-sm font-medium text-gray-800">My Account</Link>
                    <Link href="/account/orders" className="block text-sm font-medium text-gray-800">Orders</Link>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-left text-sm font-semibold text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="block rounded-full bg-white px-6 py-3 text-center font-bold">Login</Link>
                )}
                <Link href="/contact-us" className="block rounded-full bg-white px-6 py-3 text-center font-bold">Contact Us</Link>

                {/* Cart + Wishlist shortcuts in mobile menu */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <Link href="/wishlist" className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold">
                    Wishlist
                  </Link>
                  <Link href="/cart" className="relative flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold">
                    Cart
                    {itemInCart > 0 && (
                      <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {itemInCart}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </>
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
