import Plans from "@/components/admin/Plans";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminPlansPage() {
  return (
    <AdminAuthWrapper>
      <Plans />
    </AdminAuthWrapper>
  );
}
