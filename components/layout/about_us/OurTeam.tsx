import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

export default function OurTeam() {
  const team: TeamMember[] = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      description: "15 years experience in spice trading",
      image: "0c9370500dd26baeb4d0de61235ccf441c9ef25d.jpg",
    },
    {
      name: "Raj Patel",
      role: "Head of Sourcing",
      description: "Expert in Asian spice markets",
      image: "cc3cd5afeccc137c2a773e9c86163afd48953606.jpg",
    },
    {
      name: "Maria Garcia",
      role: "Quality Control",
      description: "Certified food safety specialist",
      image: "3181632c57d272bf3317db926d6aba5997095adb.jpg",
    },
    {
      name: "David Kim",
      role: "Customer Success",
      description: "Passionate about customer satisfaction",
      image: "3f33034cab8648ae5774a5bc97a159b0168c9ab6.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className=" font-semibold text-gray-600 tracking-wide uppercase mb-3">
            Meet Our Team
          </h2>
          <p className="text-3xl sm:text-4xl font-light text-gray-800">
            Passionate experts dedicated to bringing you the finest spices
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-72 bg-linear-to-br from-amber-200 to-orange-300 overflow-hidden">
                <Image
                  src={`/assets/about/team_members/${member.image}`}
                  alt={member.name}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-orange-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
