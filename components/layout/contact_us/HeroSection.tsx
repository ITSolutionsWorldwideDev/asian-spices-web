import ContactUsForm from "./ContactUsForm";
import Faqs from "./Faqs";

export default function HeroSection() {
  return (
    <div className=" bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Form */}

          <ContactUsForm />
          {/* FAQ Section */}
          <Faqs />
        </div>
      </div>
    </div>
  );
}
