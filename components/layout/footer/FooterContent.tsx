import React from "react";

import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import Link from "next/link";
import SubscribeNewsletter from "./SubscribeNewsletter";

/** Update these URLs to your real social profiles */
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
  // {
  //   label: "WhatsApp",
  //   href: "https://wa.me/31107660786",
  //   Icon: IoLogoWhatsapp,
  // },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@AsianSpices-p5c",
    Icon: FaYoutube,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@asianspices0",
    Icon: FaTiktok,
  },
] as const;

const FooterContent = () => {
  return (
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 ">
      {/* Logo + Social Icons */}
      <div>
        <Image
          src="/assets/logo/Group 88.png"
          alt="Asian Spices Logo"
          width={120}
          height={80}
          className="mb-6"
        />

        <div className="mt-20 flex items-center gap-4 text-xl">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-full bg-white/40 p-1 text-black transition duration-150 hover:scale-110"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="text-left">
        <h2 className="font-semibold text-lg mb-4">Menu</h2>

        <ul className="space-y-3">
          <li>
            <Link href="/terms" className="hover:underline">
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Privacy & Policy
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link href="partnerplatform" className="hover:underline">
              Partner Platform
            </Link>
          </li>
          {/* { name: "Partner Platform", hreflink: "partnerplatform" }, */}
          <li>
            <Link href="contact-us" className="hover:underline">
              Contact Us
            </Link>
          </li>
          {/* <li>
            <Link href="#" className="hover:underline">
              Careers
            </Link>
          </li> */}
        </ul>
      </div>

      {/* Newsletter */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Newsletter</h2>
        <p className="text-sm mb-5 text-white">
          Subscribe to our newsletter and receive exclusive recipes, spice tips,
          and special offers delivered to your inbox every week.
        </p>

        <SubscribeNewsletter />

        <div className="mt-8">
          <Link href={"/partnerplatform"}>
            {" "}
            <h3 className="font-bold underline">Go To The Partner Hub</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterContent;
