import React from "react";

export default function KickstartSales() {
  const steps = [
    {
      title: "Check and double check!",
      description:
        "If you are based in Asia or operating as a partner, follow these steps. The screening can take up to 5 business days. You can find more information about our onboarding and screening process here.",
      imgSrc:
        "assets/kickstarsales/15c5f0b9e410f923d789bc2b122f1f0a81f4c873.jpg",
    },
    {
      title: "Onboarding Process",
      description:
        "• Review the onboarding process to gain a clear overview of our collaboration approach.\n• Prefer guided support? Schedule a call with a partner expert for personalized onboarding assistance.\n• Explore the onboarding process\n• Schedule a consultation",
      imgSrc:
        "assets/kickstarsales/2ac5dcd09472768b5aecd147c2b56afc204f3ef7.jpg",
    },
    {
      title: "Signup",
      description:
        "• Register as a partner\n• Submit company documentation for verification\n• Configure your preference via the Partner Hub.\n• Register as partner\n• Partner Hub login",
      imgSrc:
        "assets/kickstarsales/646c69429755f64917e79dc1692e8ab7741ff5c7.jpg",
    },
    {
      title: "Review the pricing, branding and service policies",
      description:
        "• Review pricing structures, branding requirements, and service standards\n• View pricing, branding & service policies",
      imgSrc:
        "assets/kickstarsales/b2719b0c262cb54eacfe4c4b2d512b63dce4f3b9.jpg",
    },
    {
      title: "Add your assortment",
      description:
        "• Upload your product catalogue\n• Add pricing details\n• View assortment guidelines",
      imgSrc:
        "assets/kickstarsales/0f1e9603379ff991d783fd557b8fabf887cf56b6.jpg",
    },
    {
      title: "Create optimal product information",
      description:
        "• Add refined product descriptions\n• Upload high-quality visuals\n• Include specifications and relevant product notes View product content guidelines",
      imgSrc:
        "assets/kickstarsales/5f2650f1f467c10c3e640be3983e29d3d7003cf5.jpg",
    },
    {
      title: "Schedule Your Kick-Off Day",
      description:
        "• Book a Kick-Off Day session with one of our experts\n• Receive tailored guidance on tools, setup, and best practices\n• Meeting confirmation includes access to the Kick-Off Day information page\n• Schedule your Kick-Off Day",
      imgSrc:
        "assets/kickstarsales/bc59b24aad4807e2adcb9b682b6785113a384916.jpg",
    },
    {
      title: "Review your partnership agreement",
      description:
        "• Review and sign the partnership agreement\n• Complete your registration and prepare to go live",
      imgSrc:
        "assets/kickstarsales/5f9670d25c827b916cec818ab53ec3829be7bbb9.jpg",
    },
  ];

  return (
    <div className=" bg-gray-50 py-12 ">
      <div className="container mx-auto p-8 md:p-16 ">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            Kickstart your Sales in 7 steps
          </h1>
          <p className="text-gray-600">
            Ready to sell? Join Asian Spices and get started in a few easy
            steps.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow hover:bg-[#FFEAD0] p-5"
            >
              {/* Image */}
              <img
                src={step.imgSrc}
                alt={step.title}
                className="w-full h-48 object-cover rounded-2xl"
              />

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 whitespace-pre-line leading-relaxed">
                  {step.description}
                </p>
                <a
                  href="/partner-registration"
                  className="text-orange-600 font-semibold hover:text-orange-700"
                >
                  Sign up in a few steps →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
