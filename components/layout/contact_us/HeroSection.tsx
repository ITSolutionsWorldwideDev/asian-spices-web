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

        {/* Company Details */}
        <div className="mt-14">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-stone-200">
              <h2 className="text-2xl font-semibold text-stone-800">
                Company Details
              </h2>
            </div>

            <table className="w-full">
              <tbody>
                <tr className="border-b border-stone-200">
                  <td className="w-1/2 px-6 py-4 font-medium text-stone-700 bg-stone-50">
                    Company Name
                  </td>
                  <td className="px-6 py-4 text-stone-600">
                    Asian Spices Online B.V.
                  </td>
                </tr>

                <tr className="border-b border-stone-200">
                  <td className="px-6 py-4 font-medium text-stone-700 bg-stone-50">
                    Business Address
                  </td>
                  <td className="px-6 py-4 text-stone-600">
                    Slakkenveen 341, 3205 GK Spijkenisse
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-medium text-stone-700 bg-stone-50">
                    Chamber of Commerce Number
                  </td>
                  <td className="px-6 py-4 text-stone-600">42041922</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
