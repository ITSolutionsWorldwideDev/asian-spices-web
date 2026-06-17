// apps/web/components/layout/partner_registration/TabSwitching.tsx

"use client";
import { useState, useEffect, useRef } from "react";
import { Check, Form } from "lucide-react";
import Prerequisites from "./Prerequisites";
import BusinessVerification from "./BusinessVerification";
import DocumentUpload from "./DocumentUpload";
import ContactDetails from "./ContactDetails";
import IdentityVerification from "./IdentityVerification";
import Confirmation from "./Confirmation";

const generateApplicationId = () => {
  const random = Math.floor(10000 + Math.random() * 90000);

  return `APP-${random}`;
};

export default function TabSwitching() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const formRef = useRef<HTMLFormElement | null>(null);

  const steps = [
    { id: 1, label: "Prerequisites" },
    { id: 2, label: "Business Verification" },
    { id: 3, label: "Document Upload" },
    { id: 4, label: "Contact Details" },
    { id: 5, label: "Identity Verification" },
    { id: 6, label: "Confirmation" },
  ];
  const safeActiveStep = Math.min(Math.max(activeStep, 1), steps.length);
  const currentStep = steps[safeActiveStep - 1];

  useEffect(() => {
    const timer = setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [activeStep]);

  useEffect(() => {
    const saved = localStorage.getItem("partner_registration");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (parsed.activeStep === 6) {
          localStorage.removeItem("partner_registration");
          return;
        }

        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.activeStep) setActiveStep(parsed.activeStep);
        if (parsed.completedSteps) setCompletedSteps(parsed.completedSteps);
      } catch (err) {
        console.error("Failed to restore state", err);
      }
    }
  }, []);

  useEffect(() => {
    if (activeStep < 6) {
      localStorage.setItem(
        "partner_registration",
        JSON.stringify({
          formData,
          activeStep,
          completedSteps,
        }),
      );
    }
  }, [formData, activeStep, completedSteps]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("idin") === "success") {
      setCompletedSteps((prev) => [...new Set([...prev, 5])]);
      setActiveStep(6);
    }
  }, []);

  useEffect(() => {
    setFormData((prev: any) => {
      if (prev.application_id) return prev;

      return {
        ...prev,
        application_id: generateApplicationId(),
        submitted_at: new Date().toISOString(),
      };
    });
  }, []);

  const stepComponents = (
    formData: any,
    setFormData: any,
    activeStep: number,
    setActiveStep: React.Dispatch<React.SetStateAction<number>>,
  ) => ({
    1: (
      <Prerequisites
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        setCompletedSteps={setCompletedSteps}
      />
    ),
    2: (
      <BusinessVerification
        formData={formData}
        setFormData={setFormData}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        setCompletedSteps={setCompletedSteps}
      />
    ),
    3: (
      <DocumentUpload
        formData={formData}
        setFormData={setFormData}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        setCompletedSteps={setCompletedSteps}
      />
    ),
    4: (
      <ContactDetails
        formData={formData}
        setFormData={setFormData}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        setCompletedSteps={setCompletedSteps}
      />
    ),
    5: (
      <IdentityVerification
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        formData={formData}
        setCompletedSteps={setCompletedSteps}
        completedSteps={completedSteps}
        setFormData={setFormData}
      />
    ),
    6: (
      <Confirmation
        formData={formData}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
      />
    ),
  });

  return (
    <div className="w-full p-4 sm:p-8">
      <div className="w-full overflow-x-auto max-w-6xl mx-auto pb-2">
        <div className="sm:hidden  sticky top-0 z-10 bg-white pb-3 border-b shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {activeStep} of {steps.length}
            </span>
            <span className="text-sm font-semibold text-orange-500">
              {currentStep?.label}
            </span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${(safeActiveStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="hidden sm:flex  items-center justify-between relative  max-w-6xl mx-auto px-2">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-300 -z-10" />

          {steps.map((step) => {
            const isActive = activeStep === step.id;

            const isCompleted = completedSteps.includes(step.id);
            const isClickable =
              step.id < activeStep || completedSteps.includes(step.id - 1);
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  isClickable
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
                onClick={() => {
                  if (!isClickable) return;
                  setActiveStep(step.id);
                }}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all duration-300
                    ${isActive ? "bg-orange-500 text-white" : isCompleted ? "bg-[#FF6900] text-white" : "bg-gray-300 text-gray-600"}
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <p
                  className={`mt-2 text-[10px] sm:text-sm text-center whitespace-nowrap
                    ${isActive ? "text-[#FF6900] font-semibold" : "text-gray-500"}
                  `}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <form
        ref={formRef}
        className="mt-6 sm:mt-12 max-w-4xl mx-auto bg-white p-4 sm:p-8 rounded-xl shadow-sm sm:shadow"
      >
        {
          stepComponents(formData, setFormData, activeStep, setActiveStep)[
            activeStep as keyof ReturnType<typeof stepComponents>
          ]
        }
      </form>
    </div>
  );
}
