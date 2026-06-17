// app/recipes/[slug]/page.tsx

import Image from "next/image";

import Link from "next/link";

import { notFound } from "next/navigation";

import { Calendar, Clock, Tag, Youtube } from "react-feather";

import { getRecipeBySlug } from "@/lib/dbactions/recipes";
import Footer from "@/components/ui/Footer";
// import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Nav from "@/components/ui/Nav";

interface RecipePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: RecipePageProps) {
  const { slug } = await params;

  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return {
      title: "Recipe Not Found",
    };
  }

  return {
    title: recipe.seo_title || recipe.title,

    description: recipe.seo_description || recipe.short_description,

    keywords: recipe.seo_keywords,
  };
}

export default async function RecipeDetailPage({ params }: RecipePageProps) {
  const { slug } = await params;

  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <div>
      <section className="relative">
        <div className="relative h-[300px] md:h-[450px] overflow-hidden">
          <Image
            src={recipe.thumbnail_url || "/assets/alt-recipe-banner.jpg"}
            alt={recipe.title}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />

          <Nav />

          <div className="absolute inset-0 mt-10 flex items-center">
            <div className="container mx-auto px-4">
              {/* CATEGORY */}
              {recipe.category_name && (
                <Link
                  href={`/recipes?category=${recipe.category_slug}`}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm mb-5"
                >
                  <Tag size={14} />

                  {recipe.category_name}
                </Link>
              )}

              {/* TITLE */}
              <h1 className="text-4xl md:text-6xl font-bold text-white max-w-4xl leading-tight">
                {recipe.title}
              </h1>

              {/* META */}
              <div className="flex flex-wrap items-center gap-6 text-white/90 mt-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />

                  <span>
                    {new Date(recipe.created_at).toLocaleDateString()}
                  </span>
                </div>

                {recipe.youtube_url && (
                  <div className="flex items-center gap-2">
                    <Youtube size={16} />

                    <span>Video Recipe Available</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock size={16} />

                  <span>Fresh Homemade Recipe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* LEFT */}
          <div>
            {recipe.short_description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
                <p className="text-lg leading-8 text-gray-700">
                  {recipe.short_description}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-img:rounded-xl"
                dangerouslySetInnerHTML={{
                  __html: recipe.content || "",
                }}
              />
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {recipe.youtube_video_id && (
              <div className="bg-white rounded-2xl p-5 border shadow-sm">
                <h3 className="text-lg font-bold mb-4">Watch Recipe Video</h3>

                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${recipe.youtube_video_id}?controls=0&rel=0&modestbranding=1&iv_load_policy=3`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* TAGS */}
            {recipe.tags?.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border shadow-sm">
                <h3 className="text-lg font-bold mb-4">Recipe Tags</h3>

                <div className="flex flex-wrap gap-3">
                  {recipe.tags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={`/recipes?tag=${tag.slug}`}
                      className="px-4 py-2 rounded-full text-sm font-medium text-white"
                      style={{
                        background: tag.color || "#ef4444",
                      }}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* SHARE */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Love this recipe?</h3>

              <p className="text-sm text-white/90 mb-5">
                Share this delicious recipe with your friends and family.
              </p>

              <div className="flex gap-3">
                <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium">
                  Facebook
                </button>

                <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium">
                  WhatsApp
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* <RegisterOnApp /> */}
      <Footer />
    </div>
  );
}
