// components/layout/account/profile/ProfileForm.tsx

"use client";

import { useEffect, useState } from "react";
import { useZodForm } from "@/hooks/useZodForm";
import { profileSchema } from "@/lib/validation/account";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/form/getErrorMessage";
import { useLoaderStore } from "@/store/useLoaderStore";

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(profileSchema);

  const [loading, setLoading] = useState(true);
  const { show, hide } = useLoaderStore();
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    show("Fetching Profile...");
    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => {
        reset({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
        });
        setLoading(false);
        hide();
      });
  }, [reset]);

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setApiError("Profile updated");
      }
    } catch (err: any) {
      setApiError("Error: " + err);
    } finally {
      hide();
    }
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-xl" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {apiError}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-5">
        <FormField label="Full Name" error={getErrorMessage(errors.name)}>
          <Input {...register("name")} placeholder="Your name" />
        </FormField>

        <FormField label="Email">
          <Input
            {...register("email")}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
        </FormField>

        <FormField label="Phone Number" error={getErrorMessage(errors.phone)}>
          <Input {...register("phone")} placeholder="Your Phone" />
        </FormField>
      </div>

      <div className="pt-4 border-t">
        <Button
          loading={isSubmitting}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
