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
  "4,800+ HAPPY CUSTOMERS",
  "100% ORGANIC",
] as const;

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61591119970456",
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
  { label: "About Us", href: "/about" },
  { label: "Our Products", href: "/products" },
  { label: "Recipes", href: "/recipes" },
  { label: "Blog", href: "/recipes" },
  { label: "Contact", href: "/contact-us" },
] as const;

const CUSTOMER_SERVICE = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Shipping Info", href: "/terms" },
  { label: "Returns", href: "/terms" },
  { label: "FAQ", href: "/contact-us" },
  { label: "Privacy Policy", href: "/privacy" },
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
    <div className="w-full">
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

      <div className="container mx-auto border-t border-white/10 px-6">
        {/* Main columns */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
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
            <p className="max-w-xs text-sm leading-relaxed text-white/55">
              Premium quality spices sourced directly from the finest farms
              across Asia. Bringing authentic flavors to your kitchen since
              1990.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm text-white transition hover:border-orange-500/50 hover:bg-orange-500 hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition hover:text-orange-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {CUSTOMER_SERVICE.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition hover:text-orange-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">
              Get In Touch
            </h3>
            <ul className="space-y-4 text-sm text-white/55">
              {/* Phone hidden for now
              <li className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-orange-500"
                  aria-hidden
                />
                <a
                  href="tel:+31107660786"
                  className="transition hover:text-orange-400"
                >
                  +31 10 766 0786
                </a>
              </li>
              */}
              <li className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-orange-500"
                  aria-hidden
                />
                <a
                  href="mailto:Support@asianspices.online"
                  className="transition hover:text-orange-400"
                >
                  Support@asianspices.online
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-orange-500"
                  aria-hidden
                />
                <span>
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

        {/* Partners Hub row — stacks on mobile */}
        <div className="flex flex-col gap-3 border-t border-white/15 py-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs leading-relaxed text-white/50 sm:text-sm">
            KVK #: 42041922{" "}
            <span className="mx-1 text-white/25">|</span> BTW (VAT) Number:
            NL869440317B01
          </p>
          <Link
            href="/partnerplatform"
            className="shrink-0 text-sm font-semibold text-white underline underline-offset-4 transition hover:text-orange-300 sm:ml-auto"
          >
            Go To The Partners Hub
          </Link>
        </div>

        {/* Bottom credit — Powered by + logo */}
        <div className="flex flex-col gap-4 border-t border-white/15 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs text-white/45 sm:text-sm">
            © {new Date().getFullYear()} Asian Spices. All rights reserved.
          </p>

          <a
            href="https://www.itsolutionsworldwide.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full flex-col items-start gap-3 opacity-95 transition hover:opacity-100 sm:ml-auto sm:w-auto sm:flex-row sm:items-center sm:gap-4"
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
              width={180}
              height={65}
              className="h-[32px] w-auto object-contain object-left sm:h-[36px] sm:object-right md:h-[40px]"
              unoptimized
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterContent;
