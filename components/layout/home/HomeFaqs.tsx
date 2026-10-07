"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, Clock } from "lucide-react";
import { Great_Vibes } from "next/font/google";
import faqsData from "@/components/layout/contact_us/faqsData.json";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

const HOME_FAQS = faqsData.sections.general.faqs.slice(0, 5);

export default function HomeFaqs() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="overflow-x-hidden px-3 pb-16 pt-2 sm:px-4 sm:pb-20 md:pb-24 lg:overflow-visible">
      <div className="container mx-auto min-w-0 max-w-full overflow-x-hidden px-2 sm:px-4 lg:overflow-visible">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.7fr_0.7fr] lg:gap-12 xl:gap-14">
          {/* Left — orange app promo (text left, phone absolute right like mockup) */}
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[#F27A21] sm:rounded-[2rem] lg:overflow-visible lg:rounded-[2.5rem]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
              <Image
                src="/assets/home/faqs/shopping-cart.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[80%_35%] opacity-45 mix-blend-screen"
                aria-hidden
              />
            </div>

            <div className="relative z-10 flex flex-col sm:min-h-[400px] lg:min-h-[480px] lg:flex-row lg:items-stretch">
              <div className="relative z-10 w-full px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:w-[48%] lg:pb-12 xl:w-[46%] xl:px-12">
                <h2 className="text-[1.7rem] font-bold leading-[1.15] tracking-tight text-[#1a1208] sm:text-[2rem] md:text-[2.2rem] lg:text-[2.6rem] xl:text-[2.9rem]">
                  Be the First to
                  <br />
                  <span className="text-white">Experience</span>
                  <br />
                  Flavor at Your
                  <br />
                  <span className="text-white">Fingertips.</span>
                </h2>
                <p className="mt-4 max-w-[19rem] text-sm leading-relaxed text-white sm:mt-5 sm:text-[15px] lg:max-w-[22rem] lg:text-base xl:max-w-[24rem] xl:text-[1.05rem]">
                  Sign up now and be the first to unlock our spice-powered app.
                  <br />
                  Once live, you&apos;ll get instant email access to download from
                  <br />
                  the App Store and Google Play.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2 sm:mt-8 sm:flex-nowrap sm:gap-4 lg:gap-3 xl:gap-4">
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:shrink-0 transition hover:scale-105 active:scale-95"
                  >
                    <Image
                      src="/assets/register_on_app/Group (1).png"
                      alt="Get it on Google Play"
                      width={200}
                      height={60}
                      className="h-8 w-auto drop-shadow-lg sm:h-[52px] md:h-[60px] lg:h-11 xl:h-12"
                    />
                  </a>
                  <a
                    href="https://www.apple.com/app-store/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:shrink-0 transition hover:scale-105 active:scale-95"
                  >
                    <Image
                      src="/assets/register_on_app/Group (2).png"
                      alt="Available on the App Store"
                      width={200}
                      height={60}
                      className="h-8 w-auto drop-shadow-lg sm:h-[52px] md:h-[60px] lg:h-11 xl:h-12"
                    />
                  </a>
                </div>
              </div>

              {/* Phone — hidden below lg (not enough room to look right); shown from lg up only */}
              <div className="relative z-20 hidden shrink-0 lg:absolute lg:bottom-0 lg:right-0 lg:mx-0 lg:mb-0 lg:block lg:w-[50%] xl:right-2 xl:w-[52%]">
                <Image
                  src="/assets/home/faqs/phone-mockup.png"
                  alt="Asian Spices mobile app"
                  width={521}
                  height={556}
                  className="h-auto w-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right — FAQs */}
          <div className="min-w-0 text-center lg:pt-1">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#F27A21] bg-white px-3 py-1 text-[11px] font-semibold text-[#F27A21]">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              FAQ
            </div>
            <h2
              className={`${greatVibes.className} text-4xl leading-none text-gray-900 sm:text-5xl md:text-[3.25rem]`}
            >
              FAQs
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Common Questions From our Customers.
            </p>

            <div className="mt-6 space-y-3.5 text-left">
              {HOME_FAQS.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={faq.question}
                    className="overflow-hidden rounded-2xl bg-[#F5A855]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left sm:px-6 sm:py-4"
                    >
                      <span className="min-w-0 flex-1 text-sm font-bold leading-snug text-gray-900 sm:text-[15px]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-gray-900 transition ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="px-5 pb-4 text-sm leading-relaxed text-gray-800 sm:px-6">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-7 text-center">
              <Link
                href="/faqs"
                className="inline-flex items-center gap-1 text-sm font-bold text-gray-900 transition hover:text-[#F27A21]"
              >
                View All FAQs
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
