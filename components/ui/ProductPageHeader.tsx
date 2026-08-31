// components/ui/ProductPageHeader.tsx

import Nav from "./Nav";
import LazyVideo from "./LazyVideo";

interface TextandImage {
  heading: string;
  text: string;
  videoLink: string;
}

/** Heading + nav in first HTML paint; video loads after idle so UI isn't blocked. */
const ProductPageHeader = ({ heading, text, videoLink }: TextandImage) => {
  return (
    <section className="relative w-full bg-zinc-950">
      <LazyVideo
        mode="hero"
        src={`/assets${videoLink}`}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/45" aria-hidden />

      <Nav />

      <div className="relative z-10 container mx-auto flex min-h-[300px] flex-col items-center justify-center px-4 pb-10 pt-2 text-center text-white md:min-h-[360px] md:pb-12 md:pt-4 lg:min-h-[400px] lg:pb-14">
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
