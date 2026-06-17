// apps/web/components/ui/RegisterOnApp.tsx

import React from "react";
import Image from "next/image";

const RegisterOnApp: React.FC = () => {
  return (
    <div className="relative overflow-hidden w-full rounded-2xl bg-gradient-to-r from-orange-600 to-orange-400">
      {/* Background Decorative Accent */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute opacity-5 inset-0 left-[30%] -top-[15%] h-[650px] bg-[url('/assets/register_on_app/e4eed2a3a2c9a2ea3fec21ad0e3ce66d0ca86b12.png')] bg-contain bg-no-repeat" />
      </div>


      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 p-6 sm:p-10 lg:p-16 max-w-7xl mx-auto">
        

        <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
          <h1 className="font-bold text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
            Be the First to <span className="text-white">Experience</span>
            <br />
            Flavor at Your <span className="text-white">Fingertips.</span>
          </h1>

          <p className="mb-8 w-full sm:max-w-md md:max-w-lg font-medium text-white text-sm sm:text-base leading-relaxed">
            Sign up now and be the first to unlock our spice-powered app. Once
            live, you’ll get instant email access to download from the App Store
            and Google Play.
          </p>


          <div className="flex items-center justify-center space-x-4 lg:justify-start mb-8 w-full">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="transition transform hover:scale-105 active:scale-95"
            >
              <Image
                src="/assets/register_on_app/Group (1).png"
                alt="Get it on Google Play"
                width={135}
                height={40}
                className="h-10 w-auto"
              />
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition transform hover:scale-105 active:scale-95"
            >
              <Image
                src="/assets/register_on_app/Group (2).png"
                alt="Available on the App Store"
                width={135}
                height={40}
                className="h-10 w-auto"
              />
            </a>
          </div>


          <button className="cursor-pointer relative px-8 py-3.5 font-bold bg-white text-black rounded-lg overflow-hidden group w-full sm:w-auto shadow-md">
            <span className="relative z-10 flex items-center justify-center transition-colors duration-300 group-hover:text-white">
              Register Interest
            </span>
            <span className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center" />
          </button>
        </div>


        <div className="lg:col-span-5 flex justify-center items-center mt-6 lg:mt-0 relative w-full h-[320px] sm:h-[450px] lg:h-[550px]">
          <Image
            src="/assets/register_on_app/mobile_application.png"
            alt="Mr. Nana Mobile App Screenshot"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-contain drop-shadow-2xl"
          />
        </div>

      </div>
    </div>
  );
};

export default RegisterOnApp;

/* import React from "react";
import Image from "next/image";

const RegisterOnApp: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-0 ">
        <div className="absolute opacity-5 inset-0 left-[30%] -top-[15%] h-[650px] transform bg-[url('/assets/register_on_app/e4eed2a3a2c9a2ea3fec21ad0e3ce66d0ca86b12.png')] bg-contain bg-no-repeat "></div>
      </div>

      <div className="grid grid-cols-2"></div>
      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between gap-10 p-8 lg:p-14">
        <div className="mb-10 text-center lg:mb-0  lg:text-left">
          <h1 className="font-bold text-black text-3xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Be the First to <span className="text-white">Experience </span>
            <br />
            Flavor at Your <span className="text-white">Fingertips.</span>
          </h1>

          <p className="mb-8  w-[75%] font-medium text-white md:text-base ">
            Sign up now and be the first to unlock our spice-powered app. Once
            live, you’ll get instant email access to download from the App Store
            and Google Play.
          </p>

          <div className="flex items-center justify-center space-x-4 lg:justify-start mb-8">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Image
                src="/assets/register_on_app/Group (1).png"
                alt="Get it on Google Play"
                width={135}
                height={40}
                className="h-10 w-auto"
              />
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Image
                src="/assets/register_on_app/Group (2).png"
                alt="Available on the App Store"
                width={135}
                height={40}
                className="h-10 w-auto"
              />
            </a>
          </div>

          <button className="cursor-pointer relative px-6 py-3 font-bold text-white  bg-white rounded-lg overflow-hidden group">
            <span className="relative z-10 flex items-center justify-center text-black hover:text-white">
              Register Interest
            </span>
            <span className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"></span>
          </button>
        </div>

        <div className=" justify-center  2xl:justify-end hidden 2xl:flex ">
          <div className="absolute   2xl:top-[-30%] 2xl:right-[0%] md:visible lg:-top-[20%] lg:right-[-30%] ">
            <Image
              src={`/assets/register_on_app/88fdffcdc0c5b90c8535fa35bc3156993880fd35.png`}
              alt="Mr. Nana Mobile App Screenshot"
              height={900}
              width={900}
              priority
              className="object-contain drop-shadow-2xl "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterOnApp; */
