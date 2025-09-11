import EmailTemplateForm from "@/components/admin/EmailTemplateForm";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminSettingsEmailTemplatesCreatePage() {
  return (
    <AdminAuthWrapper>
      <EmailTemplateForm />
    </AdminAuthWrapper>
  );
}
