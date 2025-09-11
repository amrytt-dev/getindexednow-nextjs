import BlogPostEditor from "@/components/admin/BlogPostEditor";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminBlogPostEditPage() {
  return (
    <AdminAuthWrapper>
      <BlogPostEditor />
    </AdminAuthWrapper>
  );
}
