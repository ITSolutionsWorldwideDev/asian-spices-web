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
    <section className="relative w-full min-h-[70vh] sm:min-h-[85vh] bg-zinc-950 overflow-hidden">
      <LazyVideo
        mode="hero"
        src={`/assets${videoLink}`}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/45" aria-hidden />

      <div className="relative z-30">
        <Nav />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-5xl lg:text-7xl font-bold lg:max-w-[50rem] mx-auto leading-tight">
            {heading}
          </h1>
          <p className="text-white/95 font-normal text-center lg:max-w-2xl mx-auto mt-5">
            {text}
          </p>
          <p className="mt-10 text-2xl lg:text-5xl font-bold">Need Ideas?</p>
        </div>
      </div>
    </section>
  );
};

export default ProductPageHeader;
