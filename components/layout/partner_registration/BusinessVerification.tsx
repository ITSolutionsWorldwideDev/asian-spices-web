// apps/web/components/layout/partner_registration/BusinessVerification.tsx

"use client";

import { useState, useEffect } from "react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { ArrowLeft, ArrowRight, Building2, MapPin } from "lucide-react";
import { useLoaderStore } from "@/store/useLoaderStore";

import ReadAloudBtn from "./ReadAloudBtn";
import { z } from "zod";

export default function BusinessVerification({
  formData,
  setFormData,
  activeStep,
  setActiveStep,
  setCompletedSteps,
}: any) {
  const [results, setResult] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const countries = useGlobalStore((s) => s.countries);
  const selectedCountry = useGlobalStore((s) => s.selectedCountry);

  const { show, hide } = useLoaderStore();

  useEffect(() => {
    if (!formData.country && selectedCountry) {
      setFormData((prev: any) => ({
        ...prev,
        country: selectedCountry,
      }));
    }
  }, [selectedCountry]);

  const businessSchema = z.object({
    kvk_number: z
      .string()
      .min(6, "KVK must be at least 6 digits")
      .max(24, "KVK too long")
      .regex(/^[0-9]+$/, "KVK must contain only numbers"),

    company_name: z
      .string()
      .min(2, "Company name too short")
      .regex(/^[a-zA-Z0-9\s.,'-]+$/, "Invalid characters"),

    chamber_of_commerce_number: z
      .string()
      .min(6, "Chamber number too short")
      .regex(/^[0-9]+$/, "Must be numeric"),

    country: z.string().min(2, "Country is required"), // ISO like "NL"

    // country: z
    //   .string()
    //   .min(2, "Country required")
    //   .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),

    street: z
      .string()
      .min(2, "Street too short")
      .regex(/^[a-zA-Z0-9\s.,'-]+$/, "Invalid characters"),

    house_number: z
      .string()
      .min(1, "Required")
      .regex(/^[0-9a-zA-Z\-\/]+$/, "Invalid house number"),

    postal_code: z.string().min(4, "Postal code too short").max(10, "Too long"),

    city: z
      .string()
      .min(2, "City too short")
      .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),

    additional_address: z.string().optional(),
  });

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

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setHasSearched(true);

    try {
      show("Checking for KvK...");
      const res = await fetch(`/api/kvk?naam=${query}`);
      const data = await res.json();

      const rawResults = data.resultaten || [];

      // ✅ remove duplicates by kvkNummer
      const uniqueResults: any = Array.from(
        new Map(rawResults.map((item: any) => [item.kvkNummer, item])).values(),
      );

      setResult(uniqueResults);

      // setResult(data.resultaten || []);
    } catch (err) {
      console.error("Search failed", err);
      setResult([]);
    } finally {
      setLoading(false);
      hide();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // ✅ stops form submit
      handleSearch();
    }
  };

  return (
    <div id="business-verification">
      <div className="bg-gray-100 flex items-start justify-center pt-10 px-4 sm:px-6 lg:px-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full  p-6 sm:p-8">
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
            Company Registration
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mb-3">
            Search for your company using either the company name or Chamber of
            Commerce number.
          </p>

          {/* Read aloud */}
          <ReadAloudBtn ID={"business-verification"} />

          {/* Search Field */}
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {/* KVK Number */}Chamber of Commerce Number.
          </label>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <input
                // onKeyDown={(e) => {
                //   const allowedKeys = [
                //     "Backspace",
                //     "Delete",
                //     "ArrowLeft",
                //     "ArrowRight",
                //     "Tab",
                //   ];
                // }}
                // onKeyDown={handleKeyDown}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleChange("kvk_number", value);
                  setQuery(value);
                }}
                value={formData.kvk_number || ""}
                placeholder="12345678"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className=" w-full border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm "
                required
              />
              <p className="text-gray-500 text-xs sm:text-sm mb-3 pt-2">
                e.g: 90004973,90004760,90001745,55505201{" "}
              </p>
            </div>
            <div className="w-1/6">
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="bg-orange-500 text-white px-4 py-2 rounded-xl disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
          {/* ✅ Error */}
          {errors.kvk_number && (
            <p className="text-red-500 text-xs mt-1">
              field is required Please Enter a valid input
            </p>
          )}

          {loading && (
            <p className="text-sm text-gray-500 mb-4">Searching company...</p>
          )}

          {hasSearched && !loading && results.length === 0 && (
            <p className="text-sm text-red-500 mb-4">
              No companies found. Try a different KVK number.
            </p>
          )}

          {!loading && results.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold text-gray-800 mb-3">
                Search Results:
              </p>
              <div className="flex flex-col gap-3">
                {results.map((company: any, index: number) => (
                  <button key={`${company.kvkNummer}-${index}`}>
                    <div className="flex items-center gap-3">
                      <Building2 size={22} className="text-gray-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {company.naam}
                        </p>

                        <p className="text-gray-500 text-xs">
                          KVK: {company.kvkNummer}
                        </p>

                        <p className="text-gray-500 text-xs">
                          {company.adres?.binnenlandsAdres?.straatnaam},{" "}
                          {company.adres?.binnenlandsAdres?.plaats}
                        </p>
                      </div>
                    </div>

                    {/* <div className="bg-orange-500 text-white rounded-full p-1.5">
                      <ArrowRight size={16} />
                    </div> */}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* {results.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold text-gray-800 mb-3">
                Search Results:
              </p>
              <div className="flex flex-col gap-3">
                {results.map((company: any) => (
                  <div key={company.kvkNummer}>{company}</div>
                ))}
              </div>
            </div>
          )} */}

      <div className=" bg-gray-100 flex justify-center py-10 px-4">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800">
            Business & Billing Verification
          </h1>
          <p className="text-gray-500 mt-2">
            Please review your company information retrieved from the Chamber of
            Commerce.
          </p>
          {/* Billing Address Notice */}
          <div className="mt-6 bg-[#FFF2E3] border border-orange-200 text-orange-600 p-4 rounded-lg">
            <p className="font-medium">Billing Address Notice</p>
            <p className="text-sm mt-1 text-[#FF6900]">
              The official Chamber of Commerce-registered address shown below
              will be used as your primary billing address. If you need to
              modify any information, please go back and search for the correct
              company.
            </p>
          </div>
          {/* Company Details */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-700">Company Details</h2>
            </div>
            <div className="space-y-4">
              <InputField
                label="Company Name"
                value={formData.company_name || ""}
                // value={formData.companyName}
                onChange={(e) => {
                  handleChange("company_name", e.target.value);
                }}
                error={errors.company_name?.[0]}

                // value=""
              />
              <InputField
                label="Chamber of Commerce Number"
                value={formData.chamber_of_commerce_number || ""}
                // value={formData.ChamberOfCommerceNumber}
                onChange={(e) =>
                  handleChange("chamber_of_commerce_number", e.target.value)
                }
                error={errors.chamber_of_commerce_number?.[0]}

                // value="12345678"
              />
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Country
                </label>

                <select
                  value={formData.country || selectedCountry || ""}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="w-full bg-gray-100 rounded-md px-3 py-2 text-gray-700"
                >
                  <option value="">Select a country</option>

                  {countries.map((country) => (
                    <option key={country.id} value={country.iso2}>
                      {country.name}
                    </option>
                  ))}
                </select>

                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.country[0]}
                  </p>
                )}
              </div>
              {/* <InputField
                label="Country"
                value={formData.country || ""}
                onChange={(e) => handleChange("country", e.target.value)}
                error={errors.country?.[0]}
              /> */}
            </div>
          </div>
          {/* Registered Address */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-700">
                Registered Address
              </h2>
            </div>
            <div className="space-y-4">
              <InputField
                label="Street"
                value={formData.street || ""}
                // value={formData.street}
                onChange={(e) => handleChange("street", e.target.value)}
                error={errors.street?.[0]}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="House Number"
                  value={formData.house_number || ""}
                  // value={formData.houseNumber}
                  onChange={(e) => handleChange("house_number", e.target.value)}
                  error={errors.house_number?.[0]}
                />

                <InputField
                  label="Addition (Optional)"
                  value={formData.additional_address || ""}
                  // value={formData.Addition}
                  onChange={(e) =>
                    handleChange("additional_address", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Postal Code"
                  value={formData.postal_code || ""}
                  // value={formData.postalCode}
                  onChange={(e) => handleChange("postal_code", e.target.value)}
                  error={errors.postal_code?.[0]}
                />
                <InputField
                  label="City"
                  value={formData.city || ""}
                  // value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  error={errors.city?.[0]}
                />
              </div>
            </div>
          </div>

          <div className=" mt-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
            <div className=" rounded-lg  text-sm text-gray-600 space-y-2">
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
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 w-full sm:w-auto"
              type="button"
              onClick={() => setActiveStep(activeStep - 1)}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 w-full sm:w-auto"
              type="button"
              onClick={() => {
                const result = businessSchema.safeParse(formData);

                if (!result.success) {
                  const fieldErrors = result.error.flatten().fieldErrors;
                  setErrors(fieldErrors);
                  return;
                }

                // ✅ mark step 2 complete
                setCompletedSteps((prev: number[]) => [
                  ...new Set([...prev, activeStep]),
                ]);

                setActiveStep(activeStep + 1);
              }}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  onChange,
  value,
  error,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  error?: string;
}) {
  return (
    <div>
      {" "}
      <label className="block text-sm text-gray-600 mb-1">{label}</label>{" "}
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full bg-gray-100  rounded-md px-3 py-2 text-gray-700"
      />{" "}
      {/* ✅ Error message */}
      {error && (
        <p className="text-red-500 text-xs mt-1">
          please Enter a valid Input required field
        </p>
      )}
    </div>
  );
}
