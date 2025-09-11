import VipTaskManagement from "@/components/admin/VipTaskManagement";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminVipTasksPage() {
  return (
    <AdminAuthWrapper>
      <VipTaskManagement />
    </AdminAuthWrapper>
  );
}
