import Image from "next/image";
import Link from "next/link";

export default function Story() {
  return (
    <section id="our-story" className="bg-[#FCF9F3] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto grid items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
        {/* Left: Figma image collage */}
        <div className="relative mx-auto w-full max-w-[460px] lg:mx-0 lg:max-w-[520px]">
          {/* Spices image */}
          <div className="relative z-10 w-[86%] overflow-hidden rounded-[1.4rem] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.22)]">
            <div className="relative aspect-[5/4] w-full">
              <Image
                src="/assets/about/our_story/spices-spoons.png"
                alt="Colorful Asian spices arranged in spoons"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Est. badge — right of spices image, mid-height */}
          

          {/* Farm image — overlaps bottom-right of spices */}
          <div className="relative z-20 ml-auto mt-[-18%] w-[58%] overflow-hidden rounded-[1.4rem] shadow-[0_20px_45px_-8px_rgba(0,0,0,0.28)]">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/assets/about/our_story/partner-farm.png"
                alt="Woman harvesting crops in a green agricultural field"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover object-[center_30%]"
              />
            </div>
          </div>

          {/* Chili tile at the image intersection */}
          <div
            className="absolute bottom-[26%] left-[36%] z-30 flex h-[50px] w-[50px] items-center justify-center rounded-[14px] bg-[#C06C28] shadow-[0_12px_24px_-4px_rgba(192,108,40,0.55)] sm:bottom-[28%] sm:left-[38%] sm:h-[54px] sm:w-[54px] sm:rounded-2xl"
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.2 3.2c.55-1.05 1.55-1.7 2.7-1.7.2 1.8-.45 3.5-1.75 4.55.55 1.4.85 2.9.85 4.45 0 4.2-2.75 7.8-6.7 9.25a1.6 1.6 0 0 1-1.1 0C4.3 18.3 1.55 14.7 1.55 10.5c0-1.55.3-3.05.85-4.45C1.1 5 0.45 3.3.65 1.5c1.15 0 2.15.65 2.7 1.7C4.3 2.1 5.7 1.5 7.2 1.5c1.5 0 2.9.6 3.85 1.7.5-1.05 1.5-1.7 3.15-1.7z"
                fill="#E21B2C"
              />
              <path
                d="M11.5 3.4c.15 1.1-.2 2.15-1 2.9"
                stroke="#4F8A34"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Right: copy column */}
        <div className="flex min-w-0 flex-col justify-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#C06C28]" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C06C28] sm:text-xs">
              Our Story
            </p>
            <span className="h-px w-6 bg-[#C06C28]" aria-hidden />
          </div>

          <h2 className="mt-4 max-w-lg font-serif text-[1.85rem] font-bold leading-[1.15] text-[#1A120C] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]">
            A Modern Marketplace Rooted in Ancient Tradition
          </h2>

          <div className="mt-5 max-w-xl space-y-4 text-[15px] leading-[1.7] text-[#5C5C5C] sm:mt-6 sm:text-[15.5px] sm:leading-[1.75]">
            <p>
             Our story begins with the people, traditions, and authentic flavours of Asia, and with the way they found a home across Europe. Today, Asian Spices is a modern online marketplace and Asian grocery shop that carries that heritage forward, bringing the rich and diverse flavours of Asia to your doorstep across the Netherlands. We make it easy for home cooks, food enthusiasts, and professional chefs to discover premium spices, authentic ingredients, kitchen essentials, and traditional recipes, all in one convenient destination.
            </p>
            <p>
             For generations, these culinary traditions have shaped how we understand spices, ingredients, and the art of bringing people together through food. Our mission is to preserve the authenticity of Asian cuisine while making high-quality products accessible to everyone. Every product in our collection is carefully selected for freshness, quality, and the genuine taste that makes every dish memorable.
            </p>
            <p>
              Beyond shopping, Asian Spices is a growing community where cooking meets culture. Through our recipe library, healthy living tips, and expert cooking inspiration, we help you create delicious meals with confidence. Whether you're preparing a cherished family recipe or experimenting with new flavours, Asian Spices is your trusted partner for authentic ingredients and an exceptional online shopping experience.
            </p>

            {/* Company Details */}
            <div className="mt-6 rounded-2xl border border-[#E8DFC8] bg-white/75 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C06C28]">
                Company Details
              </p>
              <p className="mt-1 font-semibold text-[#1A120C] text-sm sm:text-[15px]">
                Asian Spices Online B.V.
              </p>
              <ul className="mt-2.5 space-y-1.5 text-xs sm:text-[13.5px] leading-relaxed text-[#5C5C5C]">
                <li className="flex items-start gap-2">
                  <span className="text-[#C06C28] font-bold">•</span>
                  <span>Slakkenveen 341, 3205 GK Spijkenisse, Netherlands</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C06C28] font-bold">•</span>
                  <span>
                    Email:{" "}
                    <a
                      href="mailto:support@asianspices.online"
                      className="font-medium text-[#C06C28] hover:underline"
                    >
                      support@asianspices.online
                    </a>
                  </span>
                </li>
                <li className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-[#C06C28] font-bold">•</span>
                  <span>
                    KVK #:{" "}
                    <a
                      href="https://www.kvk.nl/bestellen/#/42041922000065449916"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#C06C28] underline underline-offset-2 hover:text-[#a85c22]"
                    >
                      42041922
                    </a>
                  </span>
                  <span className="text-[#D4CBC0]">|</span>
                  <span>BTW (VAT) Number: NL869440317B01</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="/spices"
              className="inline-flex items-center justify-center rounded-full bg-[#C06C28] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_22px_-6px_rgba(192,108,40,0.5)] transition hover:bg-[#a85c22]"
            >
              Explore Our Story
            </Link>
            <Link
              href="/recipes"
              className="inline-flex items-center justify-center rounded-full border border-[#D4D0C8] bg-transparent px-8 py-3.5 text-sm font-semibold text-[#1A120C] transition hover:bg-white/70"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
