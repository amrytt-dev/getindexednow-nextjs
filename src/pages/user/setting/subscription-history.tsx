import { AuthWrapper } from "@/components/AuthWrapper";
import { UserSetting } from "@/components/UserSetting";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function UserSettingSubscriptionHistoryPage() {
  return (
    <AuthWrapper>
      <DashboardHeader />
      <UserSetting />
    </AuthWrapper>
  );
}
