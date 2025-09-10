import { AuthWrapper } from "@/components/AuthWrapper";
import UserDashboard from "@/components/pages/UserDashboard";

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <UserDashboard />
    </AuthWrapper>
  );
}
