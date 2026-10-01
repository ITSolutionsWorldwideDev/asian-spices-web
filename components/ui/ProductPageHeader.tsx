import Image from "next/image";
import Nav from "./Nav";
import LazyVideo from "./LazyVideo";

interface TextandImage {
  heading: string;
  text: string;
  videoLink?: string;
  imageSrc?: string;
}

/** Heading + nav in first HTML paint; image or video hero background. */
const ProductPageHeader = ({
  heading,
  text,
  videoLink,
  imageSrc,
}: TextandImage) => {
  const activeImage =
    imageSrc || (!videoLink ? "/assets/categories/cat-banner.webp" : undefined);

  if (activeImage) {
    return (
      <section className="relative w-full bg-[#0c0806] overflow-hidden">
        {/* Full-width responsive banner: dedicated height on mobile (h-[280px]), natural aspect ratio on desktop */}
        <div className="relative w-full h-[280px] sm:h-[300px] md:h-auto">
          {/* Mobile Background Image: Displays both left and right artwork sides with soft center blend */}
          <div className="block md:hidden absolute inset-0 overflow-hidden pointer-events-none">
            {/* Left side artwork: turmeric, peppercorns, red chili, green leaves */}
            <div className="absolute inset-y-0 left-0 w-[55%] overflow-hidden">
              <Image
                src={activeImage}
                alt=""
                fill
                priority
                sizes="55vw"
                className="object-cover object-left pointer-events-none"
              />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#0c0806]" />
            </div>

            {/* Right side artwork: ginger, red chili powder, star anise, bamboo leaves, golden emblem */}
            <div className="absolute inset-y-0 right-0 w-[55%] overflow-hidden">
              <Image
                src={activeImage}
                alt=""
                fill
                priority
                sizes="55vw"
                className="object-cover object-right pointer-events-none"
              />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-l from-transparent to-[#0c0806]" />
            </div>

            {/* Center soft vignette for perfect text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0806]/30 to-[#0c0806]/60" />
          </div>

          {/* Desktop Background Image (100% natural aspect ratio, zero side crop) */}
          <div className="hidden md:block w-full">
            <Image
              src={activeImage}
              alt={heading || "Category Banner"}
              width={2560}
              height={490}
              priority
              sizes="100vw"
              className="w-full h-auto block object-contain"
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          {/* Nav positioned at the top over the banner */}
          <div className="absolute top-0 left-0 right-0 z-20">
            <Nav />
          </div>

          {/* Headings: On mobile, cleanly positioned in the open area below the search bar (135px to 280px). On desktop, centered in the open middle area. */}
          <div className="absolute inset-x-0 bottom-0 top-[135px] sm:top-[140px] md:top-0 md:inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-4 pb-3 md:pb-0 pointer-events-none md:pt-14 lg:pt-18 md:-translate-y-2 lg:-translate-y-4">
            {heading && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                {heading}
              </h1>
            )}
            {text && (
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-normal text-white/95 max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                {text}
              </p>
            )}
            <p className="mt-1 sm:mt-1.5 md:mt-2.5 text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
              Need Ideas?
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-zinc-950 overflow-hidden">
      <LazyVideo
        mode="hero"
        src={`/assets${videoLink}`}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/45" aria-hidden />

      <Nav />

      <div className="relative z-10 container mx-auto flex min-h-[280px] flex-col items-center justify-center px-4 pb-8 pt-0 text-center text-white -translate-y-4 sm:-translate-y-6 md:-translate-y-8 md:min-h-[340px] lg:min-h-[380px]">
        <h1 className="mx-auto max-w-[50rem] text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-7xl">
          {heading}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center font-normal text-white/95 sm:mt-5">
          {text}
        </p>
        <p className="mt-6 text-xl font-bold sm:mt-8 md:text-2xl lg:mt-10 lg:text-5xl">
          Need Ideas?
        </p>
      </div>
    </section>
  );
};

export default ProductPageHeader;