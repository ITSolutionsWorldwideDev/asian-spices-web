import Image from "next/image";
import FlashSaleProductCard from "./Flash_Sale_Product_Card";
import { FlashSaleTimer } from "./Flash_Sale_Timer";

export default function FlashSale() {
  return (
    <section className="mt-20 relative w-full rounded-3xl bg-linear-to-r from-amber-500 to-amber-500 px-6 py-14  text-white container mx-auto">
      {/* Header */}

      <div className="absolute right-0 top-1/7  h-screen w-250 opacity-20">
        <Image
          src={`/assets/home/hot_sale/8357fc982c16b069a3bee90343077e780562649f.png`}
          alt={"Hot sale"}
          fill
          className=" object-cover "
        />
      </div>

      <div className="text-center mb-12">
        <div className="inline-flex text-center justify-center items-center px-5 py-1 bg-black  rounded-full font-bold fire-icon-animated">
          <img
            className="h-15 w-20"
            src={`/assets/home/hot_sale/af61c09c418181db6f7977fb75c765cfd193908e.gif`}
          />{" "}
          Flash Sale
        </div>
        <p className="mt-4 text-sm opacity-90">Limited Time Offer</p>
        <h2 className="text-lg font-medium mt-1">
          Grab these exclusive deals before time runs out!
        </h2>

        {/* Timer */}
        <FlashSaleTimer startDate="2025-11-24" endDate="2024-11-15" />
      </div>

      {/* Products */}
      <FlashSaleProductCard />
    </section>
  );
}
