import BlogPostEditor from "@/components/admin/BlogPostEditor";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminBlogPostNewPage() {
  return (
    <AdminAuthWrapper>
      <BlogPostEditor />
    </AdminAuthWrapper>
  );
}
