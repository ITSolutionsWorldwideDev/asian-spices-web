// components/HeroSection.tsx

import React from "react";
// 1. Import the video file directly (adjust relative path steps depending on where your file sits)
// import applianceVideo from "/assets/home/smart_appliances/Comp 1_6.mp4"; 

const Smart_Appliances: React.FC = () => {
  return (
    <div className="relative h-screen overflow-hidden container mx-auto border-[14px] border-amber-500 rounded-2xl bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0"
      >
        {/* 2. Pass the imported reference directly to the src string property */}
        <source src="/assets/home/smart_appliances/Comp 1_6.mp4" type="video/mp4" />
        Your browser does not support please update the browser to see the video.
      </video>

      <div className="relative z-10 flex h-full items-center justify-center text-white p-4 bg-black/20">
        <div className="max-w-xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Smart Appliances.
            <br />
            <span className="text-orange-400">Smarter </span>
            <span className="text-white"> Living.</span>
          </h1>
          <p className="mt-4 text-lg text-gray-100">
            Smart, stylish, durable appliances designed to simplify cooking,
            save time, inspire creativity, and bring families together every day.
          </p>
          <div className="flex justify-center mt-8">
            <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-black hover:text-white transition duration-300">
              Shop Appliances
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Smart_Appliances;
/* import React from "react";

const Smart_Appliances: React.FC = () => {
  return (
    <div className="relative h-screen overflow-hidden container mx-auto border-14 border-amber-500 rounded-2xl ">

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/home/smart_appliances/Comp 1_6.mp4"
      >
        Your browser does not support please update the browser to see the
        video.
      </video>


      <div className="relative z-10 flex h-full items-center justify-center text-white p-4">
        <div className="max-w-xl text-left md:text-left">

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Smart Appliances.
            <br />
            <span className="text-orange-400">Smarter </span>
            <span className="text-white"> Living.</span>
          </h1>


          <p className="mt-4 text-lg text-gray-100 items-center text-center">
            Smart, stylish, durable appliances designed to simplify cooking,
            save time, inspire creativity, and bring families together every
            day.
          </p>

   
          <div className="flex justify-center mt-8">
            <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-black hover:text-white transition duration-300">
              Shop Appliances
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Smart_Appliances;
 */