import Image from "next/image";
import TextOverCollectionCard from "./Text_Over_Collection_Card";

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

export default function CollectionSmallCard({ item }: CardProps) {
  return (
    <div className="h-full">
      <div className="group relative h-full min-h-[220px] cursor-pointer overflow-hidden rounded-3xl lg:min-h-full">
        <Image
          src={`/assets/home/collections/${item.image}`}
          alt={item.title}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />
        <TextOverCollectionCard item={item} />
      </div>
    </div>
  );
}
