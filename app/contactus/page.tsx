import ContactDetails from "@/components/layout/contact_us/ContactDetails";
import HeroSection from "@/components/layout/contact_us/HeroSection";
import Footer from "@/components/ui/Footer";

import Nav from "@/components/ui/Nav";

import Image from "next/image";
import React from "react";

const ContactUs = () => {
  return (
    <div className="relative">
      <div>
        <Nav />
      </div>
      <div className="absolute inset-0 h-screen -z-10">
        <Image
          src={`/assets/home/homeheaderimages/a8de5a3724f7239b78cdee795f978b5faba485b4 (1).webp`}
          alt="Asain Spices"
          fill
          className="object-cover w-full h-full"
        />
      </div>

      <div>
        <ContactDetails />
      </div>
      <HeroSection />
      <Footer />
    </div>
  );
};

export default ContactUs;
