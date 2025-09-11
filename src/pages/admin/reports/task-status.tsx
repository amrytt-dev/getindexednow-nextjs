import AdminTaskStatusOverview from "@/components/admin/AdminTaskStatusOverview";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminReportsTaskStatusPage() {
  return (
    <AdminAuthWrapper>
      <AdminTaskStatusOverview />
    </AdminAuthWrapper>
  );
}
