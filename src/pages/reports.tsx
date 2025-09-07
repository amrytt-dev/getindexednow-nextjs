import { AuthWrapper } from "@/components/AuthWrapper";
import { ReportsPage } from "@/components/reports/ReportsPage";

export default function Reports() {
  return (
    <AuthWrapper>
      <ReportsPage />
    </AuthWrapper>
  );
}
