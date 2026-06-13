// components/HeroSection.tsx
import React from "react";

const Smart_Appliances: React.FC = () => {
  return (
    <div className="relative h-screen overflow-hidden container mx-auto border-14 border-amber-500 rounded-2xl ">
      {/* 1. Background Video and Overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        // Replace with your actual video source
        src="/assets/home/smart_appliances/Comp 1_6.mp4"
      >
        Your browser does not support please update the browser to see the
        video.
      </video>

      {/* 2. Content Container */}
      <div className="relative z-10 flex h-full items-center justify-center text-white p-4">
        <div className="max-w-xl text-left md:text-left">
          {/* Main Headings */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Smart Appliances.
            <br />
            <span className="text-orange-400">Smarter </span>
            <span className="text-white"> Living.</span>
          </h1>

          {/* Description Text */}
          <p className="mt-4 text-lg text-gray-100 items-center text-center">
            Smart, stylish, durable appliances designed to simplify cooking,
            save time, inspire creativity, and bring families together every
            day.
          </p>

          {/* Call to Action Button */}
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
