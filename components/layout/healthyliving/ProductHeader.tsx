import Image from "next/image";
import Nav from "@/components/ui/Nav";

interface TextandImage {
  heading: string;
  text: string;
  imageLink: string;
}

// Splits heading to highlight specific important words in the middle/end
const renderHeading = (heading: string) => {
  const words = heading.trim().split(" ");
  
  // Agar heading choti hai (<= 3 words) toh sab yellow kar do
  if (words.length <= 2) {
    return <span className="text-yellow-400">{heading}</span>;
  }

  // Beech ke ya last ke 2-3 important words highlight karne ke liye 
  // Jaise "Herbs for Energy & Vitality" mein "Energy & Vitality" 3 words hain
  const highlightCount = Math.min(3, Math.floor(words.length / 2) + 1);
  const splitIndex = words.length - highlightCount;

  const normalWords = words.slice(0, splitIndex);
  const highlightedWords = words.slice(splitIndex);

  return (
    <>
      {normalWords.length > 0 && (
        <span className="text-white">{normalWords.join(" ")} </span>
      )}
      <span className="text-yellow-400">{highlightedWords.join(" ")}</span>
    </>
  );
};

const ProductHeader = ({ heading, text, imageLink }: TextandImage) => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          className="pointer-events-none object-cover object-center"
          src={`/assets/healtyliving/${imageLink}`}
          fill
          sizes="100vw"
          alt={text}
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-black/45" aria-hidden />
      </div>

      <Nav />

      <div className="relative z-10 container mx-auto flex min-h-[280px] flex-col items-center justify-center px-4 pb-10 pt-2 text-white md:min-h-[340px] md:pb-12 md:pt-4 lg:min-h-[380px] lg:pb-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {renderHeading(heading)}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-normal leading-relaxed text-white/85 sm:mt-5 sm:text-base">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductHeader;