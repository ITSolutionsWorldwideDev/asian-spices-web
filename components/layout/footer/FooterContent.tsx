// components/layout/footer/FooterContent.tsx

import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { Mail, MapPin } from "lucide-react";
import SubscribeNewsletter from "./SubscribeNewsletter";

const TICKER_ITEMS = [
  "FRESHNESS GUARANTEED",
  "DELIVERED ACROSS NL",
  "RETAIL & WHOLESALE",
  "EST. 2026 - AMSTERDAM",
  "AUTHENTIC ASIAN FLAVORS",
  "FREE RECIPES INCLUDED",
  "100% ORGANIC",
] as const;

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/asianspices.online/",
    Icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/asianspicessocial/",
    Icon: FaInstagram,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@asianspices0",
    Icon: FaTiktok,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@AsianSpices-p5c",
    Icon: FaYoutube,
  },
] as const;

const QUICK_LINKS = [
  { label: "About Us", href: "/about-us" },
  { label: "Our Products", href: "/products" },
  { label: "Recipes", href: "/recipes" },
  { label: "Blog", href: "/recipes" },
  { label: "Contact", href: "/contact-us" },
] as const;

const CUSTOMER_SERVICE = [
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Shipping Info", href: "/terms-conditions" },
  { label: "Returns", href: "/terms-conditions" },
  { label: "FAQ", href: "/faqs" },
  { label: "Privacy Policy", href: "/privacy-policy" },
] as const;

function TickerBar() {
  const sequence = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="overflow-hidden border-b border-white/10 bg-[#1a1a1a] py-3">
      <div className="animate-marquee flex w-max items-center gap-6 whitespace-nowrap text-[11px] font-medium tracking-[0.14em] text-white/70 uppercase sm:text-xs">
        {sequence.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-6">
            <span>{item}</span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}

const FooterContent = () => {
  return (
    // NOTE: Yahan se 'overflow-hidden' hata diya hai aur bottom padding add ki hai taake kuch bhi cut na ho
    <div className="relative z-10 mt-20 w-full bg-[#141414] text-white pb-16 sm:pb-10">
      <TickerBar />

      {/* Newsletter */}
      <div className="container mx-auto px-6 py-12 text-center md:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-[2rem]">
          Subscribe to Our Newsletter
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/55 sm:text-[15px]">
          Get exclusive deals, recipes, and spice tips delivered to your inbox
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <SubscribeNewsletter variant="dark" />
        </div>
      </div>

      <div className="container mx-auto border-t border-white/10 px-4 sm:px-6 lg:px-8">
        {/* Main columns with mobile divider lines */}
        <div className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 sm:gap-10 sm:py-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="border-b border-white/10 pb-8 sm:border-b-0 sm:pb-0">
            <Link href="/" className="mb-5 inline-block">
              <Image
                src="/assets/logo/Group 87.png"
                alt="Asian Spices Logo"
                width={180}
                height={70}
                priority={false}
                className="h-14 w-auto object-contain sm:h-16"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Our Journey with Spices Began in 1970. Today, We Bring Decades of Experience and Authentic Asian Flavours to Your Kitchen.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm text-white transition hover:border-orange-500/50 hover:bg-orange-500 hover:text-white active:scale-95"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-b border-white/10 pb-8 sm:border-b-0 sm:pb-0">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wider text-white uppercase sm:text-base">
              <span className="h-3.5 w-1 rounded-full bg-orange-500" aria-hidden />
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-white/60 transition hover:translate-x-1 hover:text-orange-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="border-b border-white/10 pb-8 sm:border-b-0 sm:pb-0">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wider text-white uppercase sm:text-base">
              <span className="h-3.5 w-1 rounded-full bg-orange-500" aria-hidden />
              <span>Customer Service</span>
            </h3>
            <ul className="space-y-3">
              {CUSTOMER_SERVICE.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-white/60 transition hover:translate-x-1 hover:text-orange-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wider text-white uppercase sm:text-base">
              <span className="h-3.5 w-1 rounded-full bg-orange-500" aria-hidden />
              <span>Get In Touch</span>
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/20 sm:border-0 sm:bg-transparent sm:p-0">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-orange-500"
                  aria-hidden
                />
                <a
                  href="mailto:Support@asianspices.online"
                  className="break-all transition hover:text-orange-400"
                >
                  Support@asianspices.online
                </a>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/20 sm:border-0 sm:bg-transparent sm:p-0">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-orange-500"
                  aria-hidden
                />
                <span className="leading-relaxed">
                  Slakkenveen 341
                  <br />
                  3205 GK Spijkenisse
                  <br />
                  Netherlands
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Partners Hub row */}
        <div className="flex flex-col gap-3.5 border-t border-white/10 py-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/55 sm:text-sm">
            <span>
              KVK #: <strong className="font-medium text-white/75">42041922</strong>
            </span>
            <span className="text-white/25 hidden sm:inline">|</span>
            <span>
              BTW (VAT) Number:{" "}
              <strong className="font-medium text-white/75">NL869440317B01</strong>
            </span>
          </div>
          <Link
            href="/partnerplatform"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 underline underline-offset-4 transition hover:text-orange-300 sm:ml-auto sm:text-sm sm:text-white"
          >
            <span>Go To The Partners Hub</span>
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Bottom credit — Powered by + logo */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs text-white/45 sm:text-sm">
            © {new Date().getFullYear()} Asian Spices. All rights reserved.
          </p>

          <a
            href="https://www.itsolutionsworldwide.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 opacity-90 transition hover:opacity-100 sm:ml-auto"
            aria-label="Powered by IT Solutions Worldwide"
          >
            <span className="text-xs leading-snug text-white/70 sm:text-sm">
              Powered by{" "}
              <span className="text-white/90 underline underline-offset-4">
                IT Solutions Worldwide
              </span>
            </span>
            <Image
              src="/assets/footer/it-solutions-worldwide-logo-white.png"
              alt="IT Solutions Worldwide"
              width={140}
              height={50}
              className="h-7 w-auto object-contain sm:h-8"
              unoptimized
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterContent;