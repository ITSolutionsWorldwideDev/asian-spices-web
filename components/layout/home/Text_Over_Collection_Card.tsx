import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CardProps {
  item: {
    title: string;
    subtitle: string;
    products: number;
    image: string;
    gradient: string;
    slug: string;
  };
}

/** Full class names so Tailwind does not purge dynamic bg-* utilities */
const badgeClassMap: Record<string, string> = {
  "amber-300": "bg-amber-300 text-black",
  "red-500": "bg-pink-400 text-white",
  "green-600": "bg-lime-400 text-black",
  white: "bg-white text-black",
};

const TextOverCollectionCard = ({ item }: CardProps) => {
  const badgeClass =
    badgeClassMap[item.gradient] ?? "bg-amber-300 text-black";

  return (
    <>
      {/* Badge — top left */}
      <span
        className={`absolute left-5 top-5 z-10 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
      >
        {item.products} Products
      </span>

      {/* Copy — bottom left */}
      <div className="absolute bottom-5 left-5 right-24 z-10 text-white">
        <p className="text-sm font-normal text-white/90">{item.subtitle}</p>
        <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">
          {item.title}
        </h2>
      </div>

      {/* Explore — bottom right (same route as before) */}
      <Link
        href={`/recipes?category=${item.slug}`}
        className="absolute bottom-5 right-5 z-10 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition group-hover:gap-2.5"
      >
        Explore <ArrowRight size={16} />
      </Link>
    </>
  );
};

export default TextOverCollectionCard;
