import SignupForm from "@/components/layout/signup/SignupForm";
import FormSideImage from "@/components/ui/FormSideImage";

export default function SignUpPage() {
  return (
    <div className="bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 container mx-auto p-10 bg-gray-100">
        <SignupForm />
        <FormSideImage />
      </div>
    </div>
  );
}
