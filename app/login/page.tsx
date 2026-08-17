import React from "react";

import FormSideImage from "@/components/ui/FormSideImage";
import LoginForm from "@/components/layout/login/LoginForm";

export default function LogInPage() {
  return (
    <div className="min-h-dvh overflow-y-auto bg-gray-100">
      <div className="container mx-auto grid min-h-dvh grid-cols-1 items-stretch gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-2 md:p-8 lg:p-10">
        <LoginForm />
        <div className="relative hidden min-h-[min(100dvh-4rem,640px)] md:block">
          <FormSideImage />
        </div>
      </div>
    </div>
  );
}
