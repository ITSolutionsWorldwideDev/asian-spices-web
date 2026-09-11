import Image from "next/image";
import Link from "next/link";
import { Clock, Star } from "lucide-react";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import TermsContent from "@/components/layout/terms/TermsContent";
import privacyData from "./privacyData.json";

export function generateMetadata() {
  return {
    title: "Privacyverklaring | Asian Spices",
    description:
      "Lees de privacyverklaring van Asian Spices: welke persoonsgegevens wij verwerken, waarom, hoe lang en welke rechten je hebt.",
  };
}

export default function PrivacyPage() {
  const { meta, sections, support } = privacyData;

  return (
    <div className="bg-[#fdf6ef]">
      {/* HERO — same layout as Terms & Conditions */}
      <section className="relative">
        <div className="relative z-10">
          <Nav />
        </div>

        <div className="relative h-[300px] md:h-[340px] w-full overflow-hidden">
          <Image
            src="/assets/home/homeheaderimages/a8de5a3724f7239b78cdee795f978b5faba485b4 (1).webp"
            alt="Asian Spices"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0">
            <div className="container mx-auto h-full px-6 flex flex-col items-center justify-center text-center text-white">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                {meta.badge}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold font-serif">
                {meta.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm md:text-base text-white/85 leading-relaxed">
                {meta.subtitle}
              </p>
            </div>

            <div className="absolute top-1/4 right-6 hidden md:block text-right text-xs text-white/80 space-y-1">
              <p className="flex items-center justify-end gap-2">
                <Clock className="h-3.5 w-3.5" />
                Last updated: {meta.lastUpdated}
              </p>
              <p className="flex items-center justify-start gap-2">
                <Star className="h-3.5 w-3.5" />
                Effective from {meta.effectiveFrom}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-6 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-orange-600">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="font-semibold text-gray-700">{meta.title}</span>
          </div>
        </div>
      </section>

      {/* Content from privacyData.json (converted from DOCX) */}
      <TermsContent sections={sections as any} support={support} />

      <Footer />
    </div>
  );
}
