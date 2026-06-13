import Link from "next/link";

export default function Redirect() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="relative   rounded-3xl bg-black px-6 py-20 text-center sm:px-10">
        {/* Heading */}
        <p className="mb-4  text-white/80">
          Ready to Elevate Your Cooking?
        </p>

        <h1 className="mx-auto mb-8 max-w-3xl text-lg font-medium leading-relaxed text-white sm:text-xl">
          Join thousands of home cooks and professional chefs who trust Asian
          Spices for authentic Asian spices
        </h1>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/spices"
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-500 transition hover:bg-orange-100"
          >
            Shop Now
          </Link>

          <Link
            href="/contactus"
            className="rounded-lg border border-white bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
