export default function StoryBanner() {
  return (
    <section className="relative flex min-h-[220px] items-center justify-center overflow-hidden py-16 sm:min-h-[280px] sm:py-20 lg:min-h-[320px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/about/our_story/story-banner-spices.png')",
        }}
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden />

      <div className="relative z-10 px-4 text-center">
        <p className="font-serif text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl">
          &ldquo;Every grain carries a story.
        </p>
        <p className="mt-1 font-serif text-2xl font-bold leading-snug text-[#E8B27A] sm:mt-2 sm:text-3xl lg:text-4xl">
          We bring that story to your kitchen.&rdquo;
        </p>
      </div>
    </section>
  );
}
