import { AuthWrapper } from "@/components/AuthWrapper";
import { UserSetting } from "@/pages/UserSetting";

export default function UserSettingAccountPage() {
  return (
    <AuthWrapper>
      <UserSetting />
    </AuthWrapper>
  );
}
