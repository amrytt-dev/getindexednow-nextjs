import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

export default function AdminBlogIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to blog posts
    router.replace("/admin/blog/posts");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg text-foreground/70">
          Redirecting to blog posts...
        </p>
      </div>
    </div>
  );
}
