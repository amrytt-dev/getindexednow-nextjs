import BlogCategories from "@/components/admin/BlogCategories";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminBlogCategoriesPage() {
  return (
    <AdminAuthWrapper>
      <BlogCategories />
    </AdminAuthWrapper>
  );
}
