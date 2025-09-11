import PaymentHistory from "@/components/admin/PaymentHistory";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminPaymentsPage() {
  return (
    <AdminAuthWrapper>
      <PaymentHistory />
    </AdminAuthWrapper>
  );
}
