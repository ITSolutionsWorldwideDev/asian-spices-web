import Nav from "./Nav";

interface TextandImage {
  heading: string;
  text: string;
  imageLink: string;
}

const HealthyLivingHeader = ({ heading, text, imageLink }: TextandImage) => {
  return (
    <section className="relative h-auto w-full">
      <img
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src={`/assets${imageLink}`}
        alt=""
      />
      <div className="pointer-events-none absolute inset-0 bg-black/40" aria-hidden />

      <Nav />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-white container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold lg:text-7xl lg:max-w-[50rem] mx-auto">
            {heading}
          </h1>
          <p className="mt-5 text-center font-normal text-white/95 lg:max-w-2xl mx-auto">
            {text}
          </p>
          <h2 className="mt-10 text-2xl font-bold lg:text-5xl">Need Ideas?</h2>
        </div>
      </div>
    </section>
  );
};

export default HealthyLivingHeader;
