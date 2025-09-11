import BlogTags from "@/components/admin/BlogTags";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminBlogTagsPage() {
  return (
    <AdminAuthWrapper>
      <BlogTags />
    </AdminAuthWrapper>
  );
}
