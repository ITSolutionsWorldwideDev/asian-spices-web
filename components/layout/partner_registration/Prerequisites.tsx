// apps/web/components/layout/partner_registration/Prerequisites.tsx

"use client";
import {
  FileCheck,
  StickyNote,
  Shield,
  CircleCheck,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";
import ReadAloudBtn from "./ReadAloudBtn";

export default function Prerequisites({
  setActiveStep,
  activeStep,
  setCompletedSteps,
}: any) {

  return (
    <div>
      {/* {activeComponent === "main" && ( */}
      <div id="content-to-read">
        <div className=" bg-gray-100 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-3xl">
            {/* Header Section */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Before you begin...
              </h1>

              <p className="mt-4 text-gray-600">
                You're just a few steps away from joining Asian Spices.
              </p>

              <p className="mt-2 text-gray-600">
                This registration takes approximately{" "}
                <span className="font-semibold">10 minutes</span>.
              </p>

              <div className="flex items-center justify-center mt-3">
                <ReadAloudBtn ID={"content-to-read"} />
                {/* <ReadAloudBtn ID={"business-verification"} /> */}
              </div>
            </div>

            {/* Card Section */}
            <div className="bg-[#FFEAD0] border border-orange-200 rounded-xl p-6 md:p-8">
              <h2 className="text-lg font-semibold mb-6">What you'll need:</h2>

              <div className="space-y-6">
                {/* Item 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#FFCAA4] rounded-full flex items-center justify-center">
                    <FileCheck className="text-[#FF6900]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Chamber of Commerce number
                    </h3>
                    <p className="text-sm text-gray-600">
                      We use this to automatically find your official company
                      name and address.
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#FFCAA4] rounded-full flex items-center justify-center">
                    <StickyNote className="text-[#FF6900]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Chamber of Commerce extract
                    </h3>
                    <p className="text-sm text-gray-600">
                      A digital copy of your KvK extract.
                    </p>
                    {/* Please ensure it is
                      not older than 6 months. */}
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#FFCAA4] rounded-full flex items-center justify-center">
                    <Shield className="text-[#FF6900]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Power of Attorney</h3>
                    <p className="text-sm text-gray-600">
                      Only required if you are not the legal owner or director
                      of the company.
                    </p>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#FFCAA4] rounded-full flex items-center justify-center">
                    <CircleCheck className="text-[#FF6900]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">iDIN verification</h3>
                    <p className="text-sm text-gray-600">
                      We use iDIN to safely and quickly verify your identity
                      through your bank.
                    </p>
                  </div>
                </div>

                {/* Item 5 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#FFCAA4] rounded-full flex items-center justify-center">
                    <FileCheck className="text-[#FF6900]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Contact details</h3>
                    <p className="text-sm text-gray-600">
                      So that we can contact you following your registration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="  flex flex-col items-center justify-center px-4">
          {/* Important Notice Card */}
          <div className="w-full max-w-3xl bg-orange-50 border border-orange-200 rounded-2xl mt-5 p-6 mb-10">
            <p className="text-orange-600 text-sm leading-relaxed">
              <span className="font-bold">Important:</span> Make sure you have
              all the required documents ready before starting. You can save
              your progress and return later if needed.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-4 text-sm text-gray-600 space-y-2">
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

          {/* Getting Started Button */}
          <button
            className="bg-[#FF6900] hover:bg-orange-600 active:bg-orange-700 transition-colors duration-150 text-white font-semibold text-lg px-10 py-4 rounded-2xl flex items-center gap-2 shadow-sm cursor-pointer mt-10"
            onClick={() => {
              // ✅ mark step 1 complete
              setCompletedSteps((prev: number[]) => [
                ...new Set([...prev, activeStep]),
              ]);

              setActiveStep(activeStep + 1);
            }}
          >
            Getting Started
            <span className="text-xl leading-none">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
