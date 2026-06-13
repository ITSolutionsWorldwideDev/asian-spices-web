// apps/web/components/layout/account/profile/PasswordForm.tsx

"use client";

// import { useZodForm } from "@/core/utils";
import { useZodForm } from "@/hooks/useZodForm";
import { passwordSchema } from "@/lib/validation/account";
import { useLoaderStore } from "@/store/useLoaderStore";

export default function PasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(passwordSchema);

  const { show, hide } = useLoaderStore();

  const onSubmit = async (data: any) => {
    try {
      show("Updating Password...");

      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error);
        return;
      }

      // alert("Password updated successfully");
      reset();
    } finally {
      hide();
    }
  };

  return (
    <div className="max-w-2xl mt-16">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Change Password
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Update your account password securely.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-x-4 space-y-4 form-group">
            {/* CURRENT PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password<span className="text-danger ms-1">*</span>
              </label>
              <input
                type="password"
                placeholder="Current password"
                {...register("currentPassword")}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition
                ${
                  errors.currentPassword
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                }`}
              />

              {errors.currentPassword && (
                <p className="mt-2 text-xs text-red-500">
                  {String(errors.currentPassword.message)}
                </p>
              )}
            </div>
            {/* NEW PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password<span className="text-danger ms-1">*</span>
              </label>

              <input
                type="password"
                placeholder="New password"
                {...register("newPassword")}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition
                ${
                  errors.newPassword
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                }`}
              />

              {errors.newPassword && (
                <p className="mt-2 text-xs text-red-500">
                  {String(errors.newPassword.message)}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password<span className="text-danger ms-1">*</span>
              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition
                ${
                  errors.confirmPassword
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-xs text-red-500">
                  {String(errors.confirmPassword.message)}
                </p>
              )}
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
