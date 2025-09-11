import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminDashboardPage() {
  return (
    <AdminAuthWrapper>
      <AdminDashboard />
    </AdminAuthWrapper>
  );
}
