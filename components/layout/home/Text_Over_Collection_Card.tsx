import { ArrowRight } from "lucide-react";
interface CardProps {
  item: {
    title: string;
    subtitle: string;
    products: number;
    image: string;
    gradient: string;
  };
}

const TextOverCollectionCard = ({ item }: CardProps) => {
  return (
    <>
      <div className={`absolute inset-0 bg-linear-to-t `} />

      <div className="absolute bottom-6 left-6 text-white ">
        <h2 className="text-3xl font-semibold ">{item.title}</h2>
        <p className="text-sm  mt-5 font-bold">{item.subtitle}</p>

        <div className=" flex items-center mt-5  w-full ">
          <span
            className={`px-3 py-1 rounded-md text-black  text-xs   bg-${item.gradient}`}
          >
            {item.products} products
          </span>
        </div>
      </div>
      <div className="flex absolute right-10 bottom-6 text-white items-center justify-center  gap-2 text-sm ml-auto font-bold hover:scale-123 overflow-hidden">
        Explore <ArrowRight size={16} className="  hover:translate-x-10" />
      </div>
    </>
  );
};

export default TextOverCollectionCard;
