import { AuthWrapper } from "@/components/AuthWrapper";
import { UserSetting } from "@/pages/UserSetting";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function UserSettingProfilePage() {
  return (
    <AuthWrapper>
      <DashboardHeader />
      <UserSetting />
    </AuthWrapper>
  );
}
