import { AuthWrapper } from "@/components/AuthWrapper";
import { UserSetting } from "@/pages/UserSetting";

export default function UserSettingProfilePage() {
  return (
    <AuthWrapper>
      <UserSetting />
    </AuthWrapper>
  );
}
