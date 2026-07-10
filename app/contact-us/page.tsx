import ContactDetails from "@/components/layout/contact_us/ContactDetails";
import HeroSection from "@/components/layout/contact_us/HeroSection";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import Image from "next/image";

const ContactUs = () => {
  return (
    <div className="bg-[#f5f0ea]">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto text-white/90 leading-relaxed">
              Have a question? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>

        <ContactDetails />
      </section>

      <HeroSection />
      <Footer />
    </div>
  );
};

export default ContactUs;
