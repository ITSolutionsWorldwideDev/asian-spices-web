import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/ui/Nav";
interface TextandImage {
  heading: string;
  text: string;
  imageLink: string;
}

const ProductHeader = ({ heading, text, imageLink }: TextandImage) => {
  return (
    <section className="relative w-full h-screen  ">
      <Image
        className="w-full h-full absolute inset-0 object-cover"
        src={`/assets/healtyliving/${imageLink}`}
        fill
        alt={text}
      />
      <Nav />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white container mx-auto">
        <div>
          <h1 className="lg:text-7xl font-bold lg:w-250 text-5xl">{heading}</h1>
          <div className="flex items-center justify-center ">
            <p className="text-white font-normal text-center lg:w-170 mt-5">
              {text}
            </p>
          </div>
          <div className="flex items-center justify-center mt-10 space-x-5">
            <h1 className="lg:text-5xl font-bold  text-2xl">Need Ideas?</h1>

            {/* <Link href={'/recipes'}> */}
            {/* <button className="relative overflow-hidden rounded-xl  bg-white  px-8 py-4 font-semibold text-black transition-colors duration-500 group"> */}
            {/* Expanding background */}
            {/* <span className="absolute inset-0 bg-black scale-0 group-hover:scale-100 transition-transform duration-500 ease-out origin-center"></span> */}

            {/* Text */}
            {/* <span className="relative z-10 group-hover:text-white transition-colors duration-500"> */}
            {/* Check Our Recipes */}
            {/* </span> */}
            {/* </button> */}
            {/* </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHeader;
