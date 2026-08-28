import React from "react";

import FormSideImage from "@/components/ui/FormSideImage";
import LoginForm from "@/components/layout/login/LoginForm";

export default function LogInPage() {
  return (
    <div className="min-h-dvh overflow-x-hidden overflow-y-auto bg-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-12">
        <div className="grid w-full grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 lg:gap-10 xl:gap-12">
          {/* Form — below image on mobile, left on desktop */}
          <div className="order-2 flex min-w-0 md:order-1">
            <LoginForm />
          </div>

          {/* Image — compact banner on mobile, full column on tablet+ */}
          <div className="order-1 min-w-0 md:order-2">
            <FormSideImage
              className="h-36 min-h-0 sm:h-44 md:h-full md:min-h-[460px] lg:min-h-[520px] xl:min-h-[580px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
