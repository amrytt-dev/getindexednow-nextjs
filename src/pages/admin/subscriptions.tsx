import ActiveSubscriptions from "@/components/admin/ActiveSubscriptions";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminSubscriptionsPage() {
  return (
    <AdminAuthWrapper>
      <ActiveSubscriptions />
    </AdminAuthWrapper>
  );
}
