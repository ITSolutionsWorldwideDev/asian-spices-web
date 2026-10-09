import { redirect } from "next/navigation";

// Permanent redirect: /terms-and-conditions → /terms-conditions
export default function TermsAndConditionsRedirect() {
  redirect("/terms-conditions");
}
