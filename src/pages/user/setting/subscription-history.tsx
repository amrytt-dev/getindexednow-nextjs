import { AuthWrapper } from "@/components/AuthWrapper";
import { UserSetting } from "@/pages/UserSetting";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function UserSettingSubscriptionHistoryPage() {
  return (
    <AuthWrapper>
      <DashboardHeader />
      <UserSetting />
    </AuthWrapper>
  );
}
