import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
interface RecipeCard {
  title: string;
  image: string;
  description: string;
}
interface RecipesProductCardProps {
  card: RecipeCard;
}

const RecipesProductCard = ({ card }: RecipesProductCardProps) => {
  const navigationLink = card.title.toLowerCase().replace(/\s+/g, "");

  return (
    <div className="h-auto cursor-pointer overflow-hidden">
      <div className="relative  h-64 rounded-2xl overflow-hidden m-5">
        <Image
          src={`/assets/recipes/${card.image}`}
          alt="food"
          fill
          className=" object-cover"
        />
      </div>
      <div className="px-7 pb-7 overflow-hidden">
        <h3 className="text-lg font-bold mb-2">{card.title}:</h3>

        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {card.description}
        </p>

        <button className="w-full flex items-center justify-end  gap-2 text-sm font-semibold text-black  transition cursor-pointer">
          <Link
            href={{
              pathname: `/recipes/${navigationLink}`,
              query: {
                title: card.title,
                description: card.description,
                image: card.image,
              },
            }}
            className="flex items-center justify-center "
          >
            Explore{" "}
            <ArrowRight size={16} className="hover:translate-x-20 mt-1 ml-1" />
          </Link>
        </button>
      </div>
    </div>
  );
};

export default RecipesProductCard;
