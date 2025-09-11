import BlogPosts from "@/components/admin/BlogPosts";
import { AdminAuthWrapper } from "@/components/AdminAuthWrapper";

export default function AdminBlogPostsPage() {
  return (
    <AdminAuthWrapper>
      <BlogPosts />
    </AdminAuthWrapper>
  );
}
