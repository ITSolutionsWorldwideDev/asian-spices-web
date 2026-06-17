// apps/web/components/layout/checkout/ShippingForm.tsx

"use client";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useLoaderStore } from "@/store/useLoaderStore";

import { useEffect, useState } from "react";

import {
  SHIPPING_OPTIONS,
  ShippingMethod,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/pricing";

export interface ShippingOption {
  id: string;
  name: string;
  code: string;
  price: number;
  minDays: number;
  maxDays: number;
}

interface Props {
  data: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  shippingMethod: string; //shippingMethod: "standard" | "express" | "overnight";
  setShippingMethod: (value: string) => void;
  subtotal: number;
  shipping: number;
  errors: Record<string, string>;

  addresses: any[];
  selectedAddress: any;
  setSelectedAddress: (val: any) => void;
  onShippingOptionsFetched?: (options: ShippingOption[]) => void;
}

type Country = {
  id: number;
  name: string;
  iso2: string;
};

export default function ShippingForm({
  data,
  setFormData,
  shippingMethod,
  setShippingMethod,
  subtotal,
  shipping,
  errors,
  addresses,
  selectedAddress,
  setSelectedAddress,
  onShippingOptionsFetched,
}: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const { show, hide } = useLoaderStore();

  const { symbol, rate } = useCurrencyStore();

  const qualifiesForFreeStandard = subtotal >= FREE_SHIPPING_THRESHOLD;

  const isValidShippingMethod = (method: any): method is ShippingMethod => {
    return method in SHIPPING_OPTIONS;
  };

  const amountForFreeShipping =
    subtotal < FREE_SHIPPING_THRESHOLD ? FREE_SHIPPING_THRESHOLD - subtotal : 0;

  const hasFreeShipping = shipping === 0;

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        show("Loading Countries...");
        const res = await fetch("/api/countries");
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Failed to load countries", err);
      } finally {
        hide();
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchShippingRates = async () => {
      if (!data.country) {
        setShippingOptions([]);
        return;
      }

      try {
        setLoadingOptions(true);
        const queryParams = new URLSearchParams({
          country: data.country,
          city: data.city || "",
          weight: "0",
        });

        const res = await fetch(
          `/api/checkout/shipping-options?${queryParams.toString()}`,
        );
        const result = await res.json();

        if (result.success) {
          const options: ShippingOption[] = result.options;
          setShippingOptions(options);

          if (onShippingOptionsFetched) {
            onShippingOptionsFetched(options);
          }

          const validCurrentSelection = options.some(
            (opt) => opt.id === shippingMethod,
          );
          if (!validCurrentSelection && options?.length > 0 && options[0]) {
            setShippingMethod(options[0].id);
          } else if (options.length === 0) {
            setShippingMethod("");
          }
        }
      } catch (err) {
        console.error("Failed to load shipping paths:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchShippingRates();
  }, [data.country, data.city]);

  return (
    <div className="  flex justify-center ">
      <div className="w-full  bg-white rounded-xl border border-[#E5E7EB] p-8">
        <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

        {addresses.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Saved Addresses</h3>

            <div className="grid gap-4">
              {addresses.map((addr) => {
                const addressParts = [
                  addr.address_line1,
                  addr.address_line2,
                  addr.postal_code,
                  addr.city,
                  addr.state,
                  addr.country || "NL",
                ].filter(Boolean);
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);

                      setFormData((prev: any) => ({
                        ...prev,
                        firstName: addr.first_name || "",
                        lastName: addr.last_name || "",
                        address: addr.address_line1 || "",
                        appartment: addr.address_line2 || "",
                        city: addr.city || "",
                        state: addr.state || "",
                        zip: addr.postal_code || "",
                        country: addr.country || "NL",
                      }));
                    }}
                    className={`group relative overflow-hidden rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      selectedAddress?.id === addr.id
                        ? "border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 shadow-md"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    }`}
                  >
                    {selectedAddress?.id === addr.id && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs">
                          ✓
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          selectedAddress?.id === addr.id
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        }`}
                      />

                      <p className="font-semibold text-gray-800 text-base">
                        {addr.label || "Address"}
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-gray-600">
                      {addressParts.join(", ")}
                    </p>

                    {/* <p className="font-medium">{addr.label}</p>
                  <p className="text-sm text-gray-600">
                    {addr.address_line1},{addr.city}, {addr.state}, {addr.country || "NL"}
                  </p> */}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setSelectedAddress(null)}
          className="text-sm text-blue-500 underline mb-4"
        >
          Use a new address
        </button>

        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">
                First Name<span className="text-red-700 ms-1">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">
                Last Name<span className="text-red-700 ms-1">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">
              Address<span className="text-red-700 ms-1">*</span>
            </label>
            <input
              type="text"
              name="address"
              className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={data.appartment}
              onChange={(e) => handleChange("appartment", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">
                City<span className="text-red-700 ms-1">*</span>
              </label>
              <input
                type="text"
                name="city"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">State</label>
              <input
                type="text"
                name="state"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">
                ZIP Code<span className="text-red-700 ms-1">*</span>
              </label>
              <input
                type="text"
                name="zip"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
              />
              {errors.zip && (
                <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">
                Country<span className="text-red-700 ms-1">*</span>
              </label>

              {countries.length === 0 ? (
                <p className="text-sm text-gray-400">Loading countries...</p>
              ) : (
                <select
                  name="country"
                  className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={data.country}
                  disabled
                  onChange={(e) => handleChange("country", e.target.value)}
                >
                  <option value="">Select country</option>

                  {countries.map((c) => (
                    <option key={c.id} value={c.iso2}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}

              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
          </div>
        </div>

        <hr className="my-6 text-[#E5E7EB]" />

        <h2 className="text-xl font-semibold mb-4">Delivery</h2>

        {loadingOptions ? (
          <p className="text-sm text-gray-500 animate-pulse">
            Calculating available shipping routes...
          </p>
        ) : shippingOptions.length === 0 ? (
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
            Please enter a valid country and city to see available delivery
            methods.
          </p>
        ) : (
          <div className="space-y-4">
            {shippingOptions.map((option) => {
              const isOptionStandard =
                option.code?.toLowerCase() === "standard" ||
                option.name?.toLowerCase().includes("standard");

              const isFreeStandardApplied =
                qualifiesForFreeStandard && isOptionStandard;

              // const convertedPrice = option.price * rate;
              const convertedPrice = isFreeStandardApplied
                ? 0
                : option.price * rate;

              return (
                <label
                  key={option.id}
                  className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition-all ${
                    shippingMethod === option.id
                      ? "border-orange-500 bg-orange-50/50"
                      : "border-[#E5E7EB] hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={shippingMethod === option.id}
                      onChange={() => setShippingMethod(option.id)}
                      className="accent-orange-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{option.name}</p>
                      <p className="text-sm text-gray-500">
                        {option.minDays === option.maxDays
                          ? `${option.minDays} business day${option.minDays > 1 ? "s" : ""}`
                          : `${option.minDays}-${option.maxDays} business days`}
                      </p>
                    </div>
                  </div>

                  {convertedPrice === 0 || option.price === 0 ? (
                    <span className="text-[#00A63E] font-semibold">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      {symbol}
                      {convertedPrice.toFixed(2)}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
