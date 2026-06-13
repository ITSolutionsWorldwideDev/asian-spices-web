// apps/web/app/account/page.tsx
import { redirect } from "next/navigation";

export default function AccountIndex() {
  redirect("/account/orders");
}