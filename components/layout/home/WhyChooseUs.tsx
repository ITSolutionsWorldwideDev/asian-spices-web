import Image from "next/image";

const features = [
  {
    title: "100% Organic",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-green-500",
    icon: "Vector (1).png",
  },
  {
    title: "Premium Quality",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-orange-400",
    icon: "fluent_premium-12-filled.png",
  },
  {
    title: "Fast Delivery",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-blue-500",
    icon: "material-symbols_delivery-truck-speed-rounded.png",
  },
  {
    title: "Quality Guarantee",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-purple-500",
    icon: "mingcute_medal-fill.png",
  },
  {
    title: "Fair Trade",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-pink-500",
    icon: "hugeicons_trade-up.png",
  },
  {
    title: "Fresh & Potent",
    desc: "Certified organic and sustainably sourced from trusted farms across Asia.",
    iconBg: "bg-orange-600",
    icon: "mdi_thunder.png",
  },
];

export default function WhyChooseUs() {
  return (
    <section className=" container mx-auto overflow-hidden ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Left Section */}
        <div className="grid sm:grid-cols-2 gap-6 lg:p-10">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex justify-center items-center gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition hover:scale-110"
            >
              <div
                className={`w-50 h-20 ${item.iconBg} rounded-xl flex items-center justify-center text-white text-xl`}
              >
                <Image
                  src={`/assets/home/why_choose_us/${item.icon}`}
                  alt={item.title}
                  width={40}
                  height={60}
                />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-lg">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div
          className="
            relative
             w-full
            
             min-h-[420px]
            flex
            justify-center
            lg:justify-end
            bg-amber-300
            rounded-2xl
            rotate-3
            lg:rotate-5
          "
        >
          <div
            className="
              relative
              w-full
              rounded-2xl
              bg-black
              -rotate-3
              lg:-rotate-5
              overflow-hidden
            "
          >
            {/* Text */}
            <div className="flex justify-center mt-8 lg:mt-10 px-4 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-orange-400">Why Choose</span>
                <br />
                <span className="text-white">Asian Spices</span>
              </h2>
            </div>

            {/* Image */}
            <div
              className="
                absolute
                -bottom-1/7
                right-1/4
                mt-8
                flex
                justify-center
                lg:absolute
                lg:-bottom-1/3
                lg:left-0
                lg:right-1/8
              "
            >
              <Image
                src="/assets/home/why_choose_us/e901a8e43e221c4b953024f51bc6d8ba79e7809c.png"
                alt="Why Choose Asian Spices"
                width={520}
                height={500}
                className="
                  object-contain
                  w-[260px]
                  sm:w-[340px]
                  lg:w-[520px]
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
