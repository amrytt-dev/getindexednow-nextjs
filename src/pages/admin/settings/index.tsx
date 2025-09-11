import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

export default function AdminSettingsIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to email templates
    router.replace("/admin/settings/email-templates");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg text-foreground/70">
          Redirecting to email templates...
        </p>
      </div>
    </div>
  );
}
