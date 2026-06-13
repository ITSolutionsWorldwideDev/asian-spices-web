import { Users, Globe, Award, Sparkles } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: Users,
    value: "50K+",
    label: "Happy Customers",
  },
  {
    id: 2,
    icon: Globe,
    value: "25+",
    label: "Countries Sourced",
  },
  {
    id: 3,
    icon: Award,
    value: "15+",
    label: "Years Experience",
  },
  {
    id: 4,
    icon: Sparkles,
    value: "500+",
    label: "Premium Products",
  },
];

const Achievement = () => {
  return (
    <section className="w-full bg-white py-12 container mx-auto shadow-xl ">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ id, icon: Icon, value, label }) => (
            <div key={id} className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-500 text-white mb-4">
                <Icon size={22} />
              </div>

              {/* Number */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {value}
              </h3>

              {/* Label */}
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievement;
