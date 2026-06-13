import Image from "next/image";

import TextOverCollectionCard from "./Text_Over_Collection_Card";

interface CardProps {
  item: {
    title: string;
    subtitle: string;
    products: number;
    image: string;
    gradient: string;
  };
}

export default function CollectionSmallCard({ item }: CardProps) {
  return (
    <div>
      <div className="relative rounded-3xl overflow-hidden h-[35vh]  cursor-pointer group">
        <Image
          src={`/assets/home/collections/${item.image}`}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-800 ease-out group-hover:scale-125"
        />

        <TextOverCollectionCard item={item} />
      </div>
    </div>
  );
}
