import { AuthWrapper } from "@/components/AuthWrapper";
import { PlansBilling } from "@/pages/PlansBilling";

export default function PlansBillingPage() {
  return (
    <AuthWrapper>
      <PlansBilling />
    </AuthWrapper>
  );
}
