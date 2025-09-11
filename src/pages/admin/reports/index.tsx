import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

export default function AdminReportsIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to task status overview
    router.replace("/admin/reports/task-status");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg text-foreground/70">
          Redirecting to task status overview...
        </p>
      </div>
    </div>
  );
}
