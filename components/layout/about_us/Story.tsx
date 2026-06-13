import Link from "next/link";

export default function Story() {
  return (
    <section className="bg-white shadow-lg py-16 px-6 lg:px-20 container mx-auto ">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl  text-gray-900">Our Story</h2>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Founded in 2009, Asian Spices began as a small family business
                with a passion for authentic Asian cuisine. Our founder, Sarah
                Chen, grew up in a multicultural household where food was a way
                to celebrate heritage and bring people together.
              </p>

              <p>
                Frustrated by the lack of quality Asian spices in Western
                markets, Sarah embarked on a journey across Asia, building
                relationships with local farmers and spice traders. What started
                in her kitchen has grown into a trusted source for premium Asian
                spices serving over 50,000 customers worldwide.
              </p>

              <p>
                Today, we work directly with over 500 partner farms across
                India, China, Thailand, Vietnam, and beyond. Every spice we
                offer is carefully selected, ethically sourced, and tested to
                ensure it meets our rigorous quality standards.
              </p>
            </div>

            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg">
              <Link href="/spices">Explore Our Spices</Link>
            </button>
          </div>

          {/* Image */}
          <div className="relative z-10">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/assets/home/our_story/35ef1b2a720a3103c8166f4ec59c6dd911f5789f.jpg"
                alt="Colorful Asian spices including red chili powder, turmeric, and various whole spices"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative accent */}
            <div className="absolute  -bottom-6 -left-5 w-32 h-32 bg-orange-500 rounded-2xl -z-1  "></div>
          </div>
        </div>
      </div>
    </section>
  );
}
