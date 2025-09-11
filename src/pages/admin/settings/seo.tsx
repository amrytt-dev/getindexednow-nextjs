import SeoPagesList from "@/components/admin/SeoPagesList";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminSettingsSeoPage() {
  return (
    <AdminAuthWrapper>
      <SeoPagesList />
    </AdminAuthWrapper>
  );
}
