import { MapPin } from "lucide-react";
import { Truck, CreditCard } from "lucide-react";

type StepType = "contact" | "shipping" | "payment";
interface Props {
  currentStep: StepType;
  setStep: (step: StepType) => void;
}

export default function Step({ currentStep, setStep }: Props) {

  const steps = [
    { id: "contact", name: "Contact", icon: MapPin },
    { id: "shipping", name: "Shipping", icon: Truck },
    { id: "payment", name: "Payment", icon: CreditCard },
  ];

  // const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="md:flex items-center justify-center">
      {steps.map((step, index) => {
        const Icon = step.icon;

        const isActive = currentStep === step.id;
        const isCompleted =
          steps.findIndex((s) => s.id === currentStep) >
          steps.findIndex((s) => s.id === step.id);

        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => setStep(step.id as StepType)}
                className={`w-14 h-14 flex items-center justify-center rounded-full border-2 cursor-pointer transition
                  ${
                    isActive
                      ? "bg-[#FF6900] border-orange-500 text-white"
                      : isCompleted
                        ? "bg-[#FF6900] border-orange-500 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                  }`}
              >
                <Icon size={22} className="relative z-10" />
              </div>

              <p
                className={`mt-2 text-sm ${
                  isActive ? "font-medium text-black" : "text-gray-500"
                }`}
              >
                {step.name}
              </p>
            </div>

            {/* Line */}
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 w-30 mx-4 transition
                  ${isCompleted ? "bg-orange-500" : "bg-gray-300"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
