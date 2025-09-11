import SpeedyIndexPage from "@/components/admin/SpeedyIndexPage";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminSpeedyIndexPage() {
  return (
    <AdminAuthWrapper>
      <SpeedyIndexPage />
    </AdminAuthWrapper>
  );
}
