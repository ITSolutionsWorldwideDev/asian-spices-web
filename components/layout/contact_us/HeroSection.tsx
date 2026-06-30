import ContactUsForm from "./ContactUsForm";
import Faqs from "./Faqs";

export default function HeroSection() {
  return (
    <div className="bg-[#f5f0ea] py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <ContactUsForm />
          <Faqs />
        </div>
      </div>
    </div>
  );
}
