import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import AdminLayout from "./AdminLayout";

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

export const AdminAuthWrapper = ({ children }: AdminAuthWrapperProps) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    // Wait for user data to load
    if (userLoading) {
      return;
    }

    // Check if user is authenticated
    if (!user) {
      router.replace("/auth");
      return;
    }

    // Check if user has admin or editor (blog) access
    if (!user.isAdmin && !user.isEditor) {
      // Redirect non-admin users to login page
      router.replace("/auth");
      return;
    }

    // User is authenticated and is admin
    setLoading(false);
  }, [user, userLoading, router]);

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only render children if user is authenticated and is admin
  if (!user || (!user.isAdmin && !user.isEditor)) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
};
