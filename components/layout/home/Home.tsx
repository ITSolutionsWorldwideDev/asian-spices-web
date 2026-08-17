// apps/web/components/layout/home/Home.tsx

import React, { Suspense } from "react";
import Image from "next/image";
import { getServerSession } from "next-auth";
import Header from "./Header";
import AnnouncementBar from "./Announcement_Bar";
import RecipeLikeDiscountBanner from "@/components/layout/recipes/RecipeLikeDiscountBanner";
import { webAuthOptions } from "@/core/auth";
import {
  formatRecipeLikeDiscountLabel,
  getEligibleRecipeLikeDiscountsForUser,
} from "@/lib/dbactions/recipeLikeDiscounts";
import Collections from "./Collections";
import FlashSale from "./Flash_Sale";
import Premium_Spice_Collection from "./Premium_Spice_Collection";
import Smart_Appliances from "./Smart_Appliances";
import Story from "./Story";
import Spicy_Story from "./Spicy_Story";
import WhyChooseUs from "./WhyChooseUs";
import Reviews from "@/components/ui/Reviews";
import Footer from "@/components/ui/Footer";
import RegisterOnAppModal from "@/components/ui/RegisterOnAppModal";
import DeferredMount from "@/components/ui/DeferredMount";
import HeadingDescription from "@/components/ui/HeadingDescription";

function SectionSkeleton({ className = "h-64" }: { className?: string }) {
  return (
    <div
      className={`container mx-auto my-10 animate-pulse rounded-2xl bg-gray-100 ${className}`}
      aria-hidden
    />
  );
}

export default async function Homei() {
  const session = await getServerSession(webAuthOptions);
  const likeDiscounts = session?.user?.id
    ? await getEligibleRecipeLikeDiscountsForUser(session.user.id)
    : [];

  return (
    <div>
      {/* Hero + nav paint first — nothing DB-related above the fold */}
      <Header />
      <AnnouncementBar />

      {likeDiscounts.length > 0 && (
        <div className="space-y-3 bg-[#faf7f2] py-4">
          {likeDiscounts.map((likeDiscount) => (
            <RecipeLikeDiscountBanner
              key={likeDiscount.id}
              recipeId={likeDiscount.recipe_id}
              recipeTitle={likeDiscount.recipe_title || ""}
              likesCount={likeDiscount.favorite_count ?? likeDiscount.likes_count}
              discount={{
                id: likeDiscount.id,
                discount_type: likeDiscount.discount_type,
                discount_value: likeDiscount.discount_value,
                label: formatRecipeLikeDiscountLabel(likeDiscount),
              }}
            />
          ))}
        </div>
      )}

      {/* Flash sale shell is static; product cards fetch client-side inside */}
      <div className="relative overflow-hidden">
        <Image
          src="/assets/home/collections/collection-bg.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-90"
          priority={false}
        />
        <div className="relative bg-white/80 px-3 py-10 sm:px-4 sm:py-14 md:py-20">
          <div className="container mx-auto max-w-full">
            <HeadingDescription
              heading="Explore Our Collection"
              description="Discover authentic recipes from across Asia, each category carefully curated for quality and flavor."
            />
            <FlashSale />
          </div>
        </div>
      </div>

      {/* Category cards — own Suspense so they don't block sections below */}
      <Suspense fallback={<SectionSkeleton className="h-96" />}>
        <Collections />
      </Suspense>

      {/* Mid-page: defer heavy product-card island until near viewport */}
      <DeferredMount
        rootMargin="250px"
        fallback={<SectionSkeleton className="h-80" />}
      >
        <Premium_Spice_Collection />
      </DeferredMount>

      <DeferredMount
        rootMargin="250px"
        fallback={<SectionSkeleton className="h-[480px]" />}
      >
        <Smart_Appliances />
      </DeferredMount>

      <DeferredMount rootMargin="200px" fallback={<SectionSkeleton />}>
        <Story />
      </DeferredMount>

      <Suspense fallback={<SectionSkeleton className="h-96" />}>
        <Spicy_Story />
      </Suspense>

      <WhyChooseUs />

      <div className="bg-gray-100">
        <DeferredMount
          rootMargin="300px"
          fallback={<SectionSkeleton className="h-48" />}
        >
          <Reviews />
        </DeferredMount>
      </div>

      <Footer />

      {/* Modal after first paint — idle so empty sentinel still mounts */}
      <DeferredMount strategy="idle" idleTimeoutMs={3000} fallback={null}>
        <RegisterOnAppModal />
      </DeferredMount>
    </div>
  );
}
