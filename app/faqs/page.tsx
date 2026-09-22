import ContactDetails from "@/components/layout/contact_us/ContactDetails";
import Faqs from "@/components/layout/contact_us/Faqs";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import Image from "next/image";
import faqsData from "@/components/layout/contact_us/faqsData.json";
import { getFaqPageJsonLd, type FaqItem } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

function getAllContactFaqs(): FaqItem[] {
  const { sections } = faqsData;
  return [
    ...sections.general.faqs,
    ...sections.category.categories.flatMap((c) => c.faqs),
    ...sections.chatbot.topics.flatMap((t) => t.faqs),
  ];
}

const FaqsPage = () => {
  const faqJsonLd = getFaqPageJsonLd(getAllContactFaqs());

  return (
    <div className="bg-[#f5f0ea]">
      <JsonLd data={faqJsonLd} />
      <section className="relative">
        <div className="absolute inset-0 h-[420px] md:h-[460px]">
          <Image
            src="/assets/home/homeheaderimages/a8de5a3724f7239b78cdee795f978b5faba485b4 (1).webp"
            alt="Asian Spices"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative z-10">
          <Nav />

          <div className="container mx-auto px-6 pt-10 pb-36 md:pb-40 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto text-white/90 leading-relaxed">
              Got questions? We&apos;ve got answers. Browse through our most
              commonly asked questions below.
            </p>
          </div>
        </div>

        <ContactDetails />
      </section>

      <div className="bg-[#f5f0ea] py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <Faqs />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FaqsPage;