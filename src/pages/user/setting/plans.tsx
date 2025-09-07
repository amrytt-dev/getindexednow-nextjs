import { AuthWrapper } from "@/components/AuthWrapper";
import { UserSetting } from "@/pages/UserSetting";

export default function UserSettingPlansPage() {
  return (
    <AuthWrapper>
      <UserSetting />
    </AuthWrapper>
  );
}
