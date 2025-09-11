import Users from "@/components/admin/Users";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminUsersPage() {
  return (
    <AdminAuthWrapper>
      <Users />
    </AdminAuthWrapper>
  );
}
