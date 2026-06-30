// components/layout/home/HeaderContent.tsx

import React from "react";
import { IoDiamondSharp } from "react-icons/io5";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FaTruckFast } from "react-icons/fa6";
import { CiTrophy } from "react-icons/ci";
import { LuSalad } from "react-icons/lu";
import Link from "next/link";

interface FrameStats {
  Curcumin_Content?: string;
  Customer_Rating?: string;
  Origin?: string;
  varieties?: string;
  countries?: string;
  organic?: string;
  partnerfarms?: string;
  fairtrades?: string;
  since?: string;
}

interface SpiceFrame {
  id: number;
  title: string;
  subtitle: string;
  quality: string;
  description: string;
  stats: FrameStats;
}

interface SpiceFrameProps {
  current: SpiceFrame;
}

const HeaderContent = ({ current }: SpiceFrameProps) => {
  return (
    <div className="relative container mx-auto px-8 md:px-20">
      <div className="max-w-3xl text-white">
        <span className="bg-white/20 text-sm px-4 py-2 rounded-full inline-block border border-white/30">
          <span className="flex items-center justify-center">
            <IoDiamondSharp className="mr-2" />
            {current.subtitle}
          </span>
        </span>
        <p className="text-amber-300 ml-5 text-sm mb-8">{current.quality}</p>

        {/* Setting explicit heights or layout bounding limits stops layout fluctuations */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 min-h-[2em] flex items-center">
          {current.title}
        </h1>

        <p className="text-lg text-gray-200 mb-6 min-h-[4.5rem]">
          {current.description}
        </p>

        {/* Stats */}
        <div className="flex gap-12 mb-8 min-h-[4.5rem]">
          <div>
            <p className="text-3xl font-semibold">
              {current.stats.varieties || current.stats.Curcumin_Content || current.stats.partnerfarms}
            </p>
            <p className="text-sm text-amber-300">
              {current.stats.varieties && "Varieties"}
              {current.stats.Curcumin_Content && "Curcumin Content"}
              {current.stats.partnerfarms && "Partner Farms"}
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold">
              {current.stats.countries || current.stats.Customer_Rating || current.stats.fairtrades}
            </p>
            <p className="text-sm text-amber-300">
              {current.stats.countries && "Countries"}
              {current.stats.Customer_Rating && "Customer-rating"}
              {current.stats.fairtrades && "Fair Trades"}
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold">
              {current.stats.Origin || current.stats.since || current.stats.organic}
            </p>
            <p className="text-sm text-amber-300">
              {current.stats.Origin && "Origin"}
              {current.stats.since && "Since"}
              {current.stats.organic && "Organic"}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button className="flex justify-center items-center bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
            <MdOutlineShoppingBag className="mr-3" /> Shop Collection
          </button>

          <button className="flex justify-center items-center border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition space-x-3">
            <FaRegCirclePlay /> <span><Link href="/about">Watch Story</Link></span>
          </button>
        </div>

        {/* Features Row */}
        <div className="text-white flex mt-10 gap-5 flex-wrap">
          <p className="flex items-center gap-3 justify-center text-center">
            <span className="bg-green-500 rounded-full h-8 w-8 flex items-center justify-center">
              <LuSalad className="w-5 h-5 text-white" />
            </span>
            100% organic
          </p>
          <p className="flex items-center gap-3 justify-center text-center">
            <span className="bg-yellow-400 rounded-full h-8 w-8 flex items-center justify-center">
              <CiTrophy className="w-5 h-5 text-white" />
            </span>
            Premium Quality
          </p>
          <p className="flex items-center gap-3 justify-center text-center">
            <span className="bg-red-700 rounded-full h-8 w-8 flex items-center justify-center">
              <FaTruckFast className="w-5 h-5 text-white" />
            </span>
            Free Shipping
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderContent;

/* 
import Nav from "@/components/ui/Nav";
import React from "react";
import { IoDiamondSharp } from "react-icons/io5";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FaTruckFast } from "react-icons/fa6";
import { CiTrophy } from "react-icons/ci";
import { LuSalad } from "react-icons/lu";
// import { Pool } from "pg";
interface FrameStats {
  Curcumin_Content?: string;
  Customer_Rating?: string;
  Origin?: string;

  varieties?: string;
  countries?: string;
  organic?: string;

  partnerfarms?: string;
  fairtrades?: string;
  since?: string;
}

interface SpiceFrame {
  id: number;
  title: string;
  subtitle: string;
  quality: string;
  description: string;
  img?: string;
  video?: string;
  stats: FrameStats;
}
interface SpiceFrameProps {
  current: SpiceFrame;
}

const HeaderContent = ({ current }: SpiceFrameProps) => {
  return (
    <>
      <Nav />
      <div className="relative flex items-center container mx-auto  ">
        <div className="px-8 md:px-20 max-w-3xl text-white">
          <span className="bg-white/20 text-sm px-4 py-2 rounded-full inline-block  border border-white/30">
            <span className="flex items-center justify-center">
              <IoDiamondSharp className="mr-2" />
              {current.subtitle}
            </span>
          </span>
          <p className="text-amber-300 ml-5 text-sm mb-8">{current.quality}</p>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {current.title}
          </h1>

          <p className="text-lg text-gray-200 mb-6">{current.description}</p>

 
          <div className="flex gap-12 mb-8">
            <div>
              <p className="text-3xl ">
                {current.stats.varieties && current.stats.varieties}
                {current.stats.Curcumin_Content &&
                  current.stats.Curcumin_Content}
                {current.stats.partnerfarms && current.stats.partnerfarms}
              </p>
              <p className="text-sm text-amber-300">
                {current.stats.varieties && "Varieties"}
                {current.stats.Curcumin_Content && " Curcumin Content"}
                {current.stats.partnerfarms && "Partner Farms"}
              </p>
            </div>
            <div>
              <p className="text-3xl ">
                {current.stats.countries && current.stats.countries}
                {current.stats.Customer_Rating && current.stats.Customer_Rating}
                {current.stats.fairtrades && current.stats.fairtrades}
              </p>
              <p className="text-sm text-amber-300">
                {current.stats.countries && "Countries"}
                {current.stats.Customer_Rating && "Customer-rating"}
                {current.stats.fairtrades && "Fair Trades"}
              </p>
            </div>
            <div>
              <p className="text-3xl ">
                {current.stats.Origin && current.stats.Origin}
                {current.stats.since && current.stats.since}
                {current.stats.organic && current.stats.organic}
              </p>
              <p className="text-sm text-amber-300">
                {current.stats.Origin && "Origin"}
                {current.stats.since && "Since"}
                {current.stats.organic && "Organic"}
              </p>
            </div>
          </div>

 
          <div className="flex gap-4">
            <button className="flex justify-center text-center items-center bg-white text-black px-1 sm:px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
              <MdOutlineShoppingBag className="mr-3" /> Shop Collection
            </button>

            <button className="flex justify-center items-center border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition space-x-3">
              <FaRegCirclePlay /> <span>Watch Story</span>
            </button>
          </div>
          <div className="text-white  flex mt-10 gap-5">
            <p className="flex items-center gap-3 justify-center text-center">
              <span className="bg-green-500 rounded-4xl h-8 flex items-center">
                <LuSalad className="w-8    " />
              </span>
              100% organic
            </p>
            <p className="flex items-center gap-3 justify-center text-center">
              <span className="bg-yellow-400 rounded-4xl h-8 flex items-center">
                <CiTrophy className="w-8    " />
              </span>
              Premium Quality
            </p>
            <p className="flex items-center gap-3 justify-center text-center">
              <span className="bg-red-700 rounded-4xl h-8 flex items-center">
                <FaTruckFast className="w-8    " />
              </span>
              Free Shipping
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderContent;
 */