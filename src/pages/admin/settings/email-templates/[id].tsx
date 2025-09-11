import EmailTemplateForm from "@/components/admin/EmailTemplateForm";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminSettingsEmailTemplatesEditPage() {
  return (
    <AdminAuthWrapper>
      <EmailTemplateForm />
    </AdminAuthWrapper>
  );
}
