// apps/web/app/account/profile/page.tsx

import PasswordForm from "@/components/layout/account/profile/PasswordForm";
import ProfileForm from "@/components/layout/account/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-10">
      <ProfileForm />
      <PasswordForm />
    </div>
  );
}
