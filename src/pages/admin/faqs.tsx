import Faqs from "@/components/admin/Faqs";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminFaqsPage() {
  return (
    <AdminAuthWrapper>
      <Faqs />
    </AdminAuthWrapper>
  );
}
