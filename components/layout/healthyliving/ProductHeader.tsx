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
    <section className="relative h-screen min-h-[100svh] w-full max-w-none overflow-hidden">
      <Image
        className="pointer-events-none object-cover object-center"
        src={`/assets/healtyliving/${imageLink}`}
        fill
        sizes="100vw"
        alt={text}
        priority
      />

      {/* Dark overlay for text contrast */}
      <div className="pointer-events-none absolute inset-0 bg-black/45" aria-hidden />

      <Nav />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-white container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl leading-tight tracking-tight">
            {renderHeading(heading)}
          </h1>
          <p className="mt-5 text-sm sm:text-base font-normal text-white/85 leading-relaxed max-w-2xl mx-auto">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductHeader;