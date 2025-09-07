import { AuthWrapper } from "@/components/AuthWrapper";
import { ReportsPage } from "@/components/reports/ReportsPage";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Reports() {
  return (
    <AuthWrapper>
      <DashboardHeader />
      <ReportsPage />
    </AuthWrapper>
  );
}
