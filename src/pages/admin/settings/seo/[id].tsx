import SeoPageForm from "@/components/admin/SeoPageForm";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminSettingsSeoEditPage() {
  return (
    <AdminAuthWrapper>
      <SeoPageForm />
    </AdminAuthWrapper>
  );
}
