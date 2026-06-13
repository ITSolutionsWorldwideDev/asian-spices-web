// apps/web/components/layout/partner_registration/ContactDetails.tsx

"use client";

import { useState } from "react";
import ReadAloudBtn from "./ReadAloudBtn";
import { useFormValidator } from "@/hooks/FormValidator";
import { z } from "zod";

export default function ContactDetails({
  formData,
  setFormData,
  activeStep,
  setActiveStep,
  setCompletedSteps,
}: any) {
  const [agree, setAgree] = useState(false);
  const contactSchema = z.object({
    first_name: z
      .string()
      .min(2, "First name too short")
      .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),

    last_name: z
      .string()
      .min(2, "Last name too short")
      .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),

    business_phone_number: z
      .string()
      .min(7, "Phone too short")
      .max(15, "Phone too long")
      .regex(/^[0-9+]+$/, "Only numbers and + allowed"),

    business_email_address: z
      .string()
      .email("Invalid email")
      .min(5, "Email too short"),

    vat_number: z
      .string()
      .min(8, "VAT too short")
      .regex(/^[A-Z]{2}[A-Z0-9]+$/, "Invalid VAT format"),
  });
  // const contactSchema = z.object({
  //   first_name: z.string().min(1, "First name is required"),
  //   // middle_name: z.string().optional(),
  //   last_name: z.string().min(1, "Last name is required"),

  //   business_phone_number: z
  //     .string()
  //     .min(1, "Phone number is required")
  //     .regex(/^[+0-9\s]+$/, "Invalid phone number"),

  //   business_email_address: z
  //     .string()
  //     .min(1, "Email is required")
  //     .email("Invalid email address"),

  //   vat_number: z
  //     .string()
  //     .min(1, "VAT number is required")
  //     .regex(/^[A-Z]{2}[A-Z0-9]+$/, "Invalid VAT format"),
  // });

  // ✅ Error state
  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev: any) => ({
      ...prev,
      [field]: undefined,
    }));
  };
  const requiredFields = [
    "first_name",
    // "middle_name",
    "last_name",
    "business_phone_number",
    "business_email_address",
    "vat_number",
  ];
  const { validateForm } = useFormValidator(requiredFields, formData);

  return (
    <div className=" bg-gray-100 flex justify-center p-6" id="contact">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Contact, Billing & Legal Confirmation
          </h1>
          <p className="text-gray-500 mt-2">
            Provide your contact details, tax information, and legal
            confirmations.
          </p>
          <p className="text-blue-500 text-sm mt-2 cursor-pointer">
            <ReadAloudBtn ID="contact" />
          </p>
        </div>

        {/* Your Details */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 space-y-6">
          <h2 className="font-semibold text-gray-800">Your Details</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.first_name || ""}
                // onChange={(e) => handleChange("first_name", e.target.value)}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                  handleChange("first_name", value);
                }}
                placeholder="First Name"
                className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.first_name[0]}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Middle Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Middle Name"
                value={formData.middle_name || ""}
                onChange={(e) => handleChange("middle_name", e.target.value)}
                className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Last Name"
                value={formData.last_name || ""}
                onChange={(e) => handleChange("last_name", e.target.value)}
                className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.last_name[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Business Contact Details */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 space-y-6">
          <h2 className="font-semibold text-gray-800">
            Business Contact Details
          </h2>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Business Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.business_phone_number || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9+]/g, "");
                handleChange("business_phone_number", value);
              }}
              // onChange={(e) =>
              //   handleChange("business_phone_number", e.target.value)
              // }
              placeholder="+31 6 12345678"
              className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.business_phone_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.business_phone_number[0]}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Business Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.business_email_address || ""}
              onChange={(e) =>
                handleChange("business_email_address", e.target.value)
              }
              placeholder="info@company.com"
              className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <p className="text-xs text-gray-500 mt-2">
              My billing email is the same as my business email
            </p>
            {errors.business_email_address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.business_email_address[0]}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              VAT Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="NL123456789B01"
              value={formData.vat_number || ""}
              onChange={(e) => handleChange("vat_number", e.target.value)}
              className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <p className="text-xs text-gray-400 mt-2">
              Format: Country code + numbers (e.g., NL123456789B01)
            </p>
            {errors.vat_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.vat_number[0]}
              </p>
            )}
          </div>
        </div>

        {/* Business Delivery Settings */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">
            Business Delivery Settings
          </h2>

          <div>
            <p className="text-sm font-medium text-gray-700">
              Select delivery countries <span className="text-red-500">*</span>
            </p>

            <div className="mt-3 space-y-2 text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-orange-500" />
                Netherlands
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-orange-500" />
                Belgium
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-orange-500" />
                Luxembourg
              </label>
            </div>
          </div>
        </div> */}

        {/* Legal Confirmation */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Legal Confirmation</h2>

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mt-1 accent-orange-500"
            />
            <span>
              I agree to the{" "}
              <span className="text-orange-500 underline cursor-pointer">
                General Terms and Conditions
              </span>{" "}
              and the{" "}
              <span className="text-orange-500 underline cursor-pointer">
                Privacy Statement
              </span>
              . <span className="text-red-500">*</span>
            </span>
          </label>

          <p className="text-xs text-gray-500">
            By completing your registration, you confirm that you have the legal
            authority to act on behalf of this business or have obtained
            explicit consent to do so. Furthermore, you agree to our General
            Terms and Conditions and authorize the processing of your data as
            outlined in our Privacy Statement.
          </p>
        </div>

        <div className=" mt-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
          <div className="text-sm text-gray-600 space-y-2">
            <h2 className="font-semibold text-gray-800">Need Help?</h2>
            <p>
              If you have any questions about your registration or need
              assistance, our support team is here to help.
            </p>

            <div className="flex flex-wrap gap-4 text-orange-600">
              <span>✉ partners@asianspices.com</span>
              <span>📄 Registration FAQ</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setActiveStep(activeStep - 1)}
          >
            ← Back
          </button>

          <button
            disabled={!agree}
            type="button"
            className={`px-6 py-2 rounded-lg text-white transition ${
              agree
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={() => {
              const result = contactSchema.safeParse(formData);

              if (!result.success) {
                const fieldErrors = result.error.flatten().fieldErrors;
                setErrors(fieldErrors);
                return;
              }

              if (!agree) {
                alert("You must accept terms and conditions");
                return;
              }

              // ✅ mark step 4 complete
              setCompletedSteps((prev: number[]) => [
                ...new Set([...prev, activeStep]),
              ]);

              setActiveStep(activeStep + 1);
            }}

            // onClick={() => {
            //   const result = contactSchema.safeParse(formData);

            //   if (!result.success) {
            //     const fieldErrors = result.error.flatten().fieldErrors;
            //     setErrors(fieldErrors);
            //     return;
            //   }

            //   setActiveStep(activeStep + 1);
            // }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
