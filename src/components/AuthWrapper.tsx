import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.replace("/auth");
      return;
    }
    setReady(true);
  }, [user, userLoading, router]);

  if (userLoading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};
