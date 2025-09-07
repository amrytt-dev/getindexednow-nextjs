import { AuthWrapper } from "@/components/AuthWrapper";
import { UserSetting } from "@/pages/UserSetting";

export default function UserSettingPage() {
  return (
    <AuthWrapper>
      <UserSetting />
    </AuthWrapper>
  );
}
