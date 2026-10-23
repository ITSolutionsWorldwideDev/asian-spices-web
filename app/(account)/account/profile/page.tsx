// app/account/profile/page.tsx

import PasswordForm from "@/components/features/account/profile/PasswordForm";
import ProfileForm from "@/components/features/account/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-10">
      <ProfileForm />
      <PasswordForm />
    </div>
  );
}
