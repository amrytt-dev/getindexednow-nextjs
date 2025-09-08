import { AuthWrapper } from "@/components/AuthWrapper";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PlansBilling } from "@/components/PlansBilling";

export default function PlansBillingPage() {
  return (
    <AuthWrapper>
      <DashboardHeader />
      <PlansBilling />
    </AuthWrapper>
  );
}
