import ApiLogs from "@/components/admin/ApiLogs";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminReportsApiLogsPage() {
  return (
    <AdminAuthWrapper>
      <ApiLogs />
    </AdminAuthWrapper>
  );
}
