import EmailTemplatesList from "@/components/admin/EmailTemplatesList";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminSettingsEmailTemplatesPage() {
  return (
    <AdminAuthWrapper>
      <EmailTemplatesList />
    </AdminAuthWrapper>
  );
}
