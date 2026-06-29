import Link from "next/link";
import Nav from "./Nav";
interface TextandImage {
  heading: string;
  text: string;
  videoLink: string;
}

const ProductPageHeader = ({ heading, text, videoLink }: TextandImage) => {
  return (
    <section className="relative w-full h-screen ">
      <video
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        className="w-full h-full absolute inset-0 object-cover"
      >
        <source src={`/assets${videoLink}`} type="video/mp4" />
      </video>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPageHeader;

