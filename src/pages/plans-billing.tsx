import { AuthWrapper } from "@/components/AuthWrapper";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PlansBilling } from "@/components/PlansBilling";
import Footer from "@/components/Footer";

export default function PlansBillingPage() {
  return (
    <AuthWrapper>
      <DashboardHeader />
      <PlansBilling />
      <Footer />
    </AuthWrapper>
  );
}
