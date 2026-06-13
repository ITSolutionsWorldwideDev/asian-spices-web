import Image from "next/image";
import { CircleCheck } from "lucide-react";

export default function Advantages() {
  const advantages = [
    {
      title: "No start-up investment",
      description:
        "Join the platform without upfront costs. Commission applies only on completed sales.",
    },
    {
      title: "Access to a curated customer base",
      description:
        "Reach customers seeking premium Asian spices and specialty products.",
    },
    {
      title: "Personal partner support",
      description:
        "From onboarding to launch, our experts guide you at every stage.",
    },
    {
      title: "Multilingual service",
      description:
        "Professional support designed to remove barriers and simplify collaboration.",
    },
    {
      title: "Clear standards",
      description:
        "Well-defined service and quality guidelines safeguard your brand reputation.",
    },
    {
      title: "Performance insights & growth tools",
      description:
        "Make informed decisions with data-driven insights and expert recommendations.",
    },
  ];

  return (
    <div className="bg-[#F5E6D3] container mx-auto p-8 md:p-16 mt-10 rounded-3xl">
      <div className=" rounded-2xl ">
        <div className="grid md:grid-cols-2 gap-12 ">
          {/* Left side - Image */}

          <Image
            src="/assets/sellerhub/2b8b516058d075d5075eb99fc1fdafbe6d4125b3.jpg"
            alt="advantages"
            width={500}
            height={600}
            className="w-full h-full object-cover rounded-3xl"
          />

          {/* Right side - Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#D85A27] mb-6">
              The advantages of selling via Asian Spices
            </h1>

            <p className="text-gray-700 mb-8 leading-relaxed">
              Together, we uncover new opportunities and empower ambitious
              dreamers. That's Asian Spices—your partner in collaboration. Join
              us and enjoy:
            </p>

            {/* Advantages Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex gap-4">
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#D85A27] flex items-center justify-center">
                      <CircleCheck className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
