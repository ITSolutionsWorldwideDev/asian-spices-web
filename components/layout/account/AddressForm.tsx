// components/layout/account/AddressForm.tsx

"use client";

import { useEffect, useState } from "react";
import { addressSchema } from "@/lib/validation/account";
// import { useZodForm } from "@/core/utils";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { getErrorMessage } from "@/lib/form/getErrorMessage";
import { useLoaderStore } from "@/store/useLoaderStore";
import { useZodForm } from "@/hooks/useZodForm";

type Country = {
  id: number;
  name: string;
  iso2: string;
};

interface Props {
  initialData?: any;
  onSuccess?: () => void;
  addressId?: string;
}

export default function AddressForm({
  initialData,
  onSuccess,
  addressId,
}: Props) {
  const isEdit = Boolean(addressId);

  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const [countries, setCountries] = useState<Country[]>([]);

  const { show, hide } = useLoaderStore();

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors, isSubmitting },
  // } = useZodForm(addressSchema, initialData);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useZodForm(addressSchema, {
    label: initialData?.label || "",
    country: initialData?.country || "",
    address_line1: initialData?.address_line1 || "",
    address_line2: initialData?.address_line2 || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    postal_code: initialData?.postal_code || "",
    is_shipping_address: initialData?.is_shipping_address ?? true,

    is_billing_address: initialData?.is_billing_address ?? true,
  });

  // =========================
  // LOAD COUNTRIES
  // =========================
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        show("Loading Countries...");

        const res = await fetch("/api/countries?shippable=true");
        const data = await res.json();

        setCountries(data || []);
      } catch (err) {
        console.error("Failed to load countries", err);
      } finally {
        hide();
      }
    };

    fetchCountries();
  }, []);

  // const getError = (error: any) =>
  //   typeof error?.message === "string" ? error.message : "";

  // =========================
  // SUBMIT
  // =========================

  const onSubmit = async (data: any) => {
    try {
      setApiError(null);
      setApiSuccess(null);

      show(isEdit ? "Updating Address..." : "Creating Address...");

      const res = await fetch(
        isEdit
          ? `/api/account/addresses/${addressId}`
          : `/api/account/addresses`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        setApiError(result?.error || "Something went wrong");
        return;
      }

      setApiSuccess(
        isEdit
          ? "Address updated successfully"
          : "Address created successfully",
      );

      setTimeout(() => {
        onSuccess?.();
      }, 700);
    } catch (err) {
      console.error(err);
      setApiError("Failed to save address");
    } finally {
      hide();
    }
  };

  const isShipping = watch("is_shipping_address");
  const isBilling = watch("is_billing_address");

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEdit ? "Edit Address" : "Add New Address"}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Fill in your address details below.
        </p>
      </div>

      {/* ALERTS */}
      {apiError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {apiSuccess && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {apiSuccess}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* LABEL + COUNTRY */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Address Label"
            error={getErrorMessage(errors.label)}
          >
            <Input
              {...register("label")}
              placeholder="Home / Office"
              className="h-11"
            />
          </FormField>

          <FormField label="Country" error={getErrorMessage(errors.country)}>
            {countries.length === 0 ? (
              <div className="h-11 flex items-center px-3 rounded-lg border bg-gray-50 text-sm text-gray-400">
                Loading countries...
              </div>
            ) : (
              <select
                {...register("country")}
                className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              >
                <option value="">Select country</option>

                {countries.map((country) => (
                  <option key={country.id} value={country.iso2}>
                    {country.name}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        </div>
        {/* ADDRESS LINE 1 */}
        <FormField
          label="Address Line 1"
          error={getErrorMessage(errors.address_line1)}
        >
          <Input
            {...register("address_line1")}
            placeholder="Street address"
            className="h-11"
          />
        </FormField>

        {/* ADDRESS LINE 2 */}
        <FormField
          label="Apartment / Suite (Optional)"
          error={getErrorMessage(errors.address_line2)}
        >
          <Input
            {...register("address_line2")}
            placeholder="Apartment, suite, unit, etc."
            className="h-11"
          />
        </FormField>

        {/* ADDRESS LINE 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 2
          </label>

          <input
            {...register("address_line2")}
            placeholder="Apartment, suite, etc. (optional)"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* CITY + STATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="City" error={getErrorMessage(errors.city)}>
            <Input {...register("city")} placeholder="City" className="h-11" />
          </FormField>

          <FormField
            label="State / Province"
            error={getErrorMessage(errors.state)}
          >
            <Input
              {...register("state")}
              placeholder="State / Province"
              className="h-11"
            />
          </FormField>
        </div>

        {/* POSTAL CODE */}
        <FormField
          label="Postal Code"
          error={getErrorMessage(errors.postal_code)}
        >
          <Input
            {...register("postal_code")}
            placeholder="Postal code"
            className="h-11"
          />
        </FormField>

        {/* ADDRESS TYPE */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Address Type
          </h3>

          <div className="space-y-3">
            {/* SHIPPING */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isShipping}
                onChange={(e) =>
                  setValue("is_shipping_address", e.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Shipping Address
                </p>

                <p className="text-xs text-gray-500">
                  Use this address for product deliveries
                </p>
              </div>
            </label>

            {/* BILLING */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isBilling}
                onChange={(e) =>
                  setValue("is_billing_address", e.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Billing Address
                </p>

                <p className="text-xs text-gray-500">
                  Use this address for invoices and payments
                </p>
              </div>
            </label>
          </div>

          {/* VALIDATION */}
          {!isShipping && !isBilling && (
            <p className="text-sm text-red-500 mt-3">
              Please select at least one address type.
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="pt-4 border-t flex justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Update Address"
                : "Create Address"}
          </button>
        </div>
      </form>
    </div>
  );
}
