import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/contexts/UserContext";
import { useEffect, useMemo } from "react";
import { setupHttpInterceptor } from "@/utils/httpInterceptor";
import { initFirebaseClient } from "@/utils/firebaseClient";
import { UrlProgressProvider } from "@/contexts/UrlProgressContext";
import { PendingTasksProvider } from "@/contexts/PendingTasksContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const queryClient = useMemo(() => new QueryClient(), []);
  useEffect(() => {
    initFirebaseClient();
    setupHttpInterceptor();
  }, []);

  const pathname = router.pathname || "";
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/confirm-email-change") ||
    pathname.startsWith("/verify-2fa") ||
    pathname.startsWith("/payment-success") ||
    pathname.startsWith("/2fa/verify") ||
    pathname.startsWith("/payment-failed");

  // App-shell pages (internal dashboard area) render their own header (e.g., DashboardHeader)
  const isAppShellRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/plans-billing") ||
    pathname.startsWith("/user/setting");

  const showPublicHeader = !isAdminRoute && !isAuthRoute && !isAppShellRoute;
  const showFooter = !isAdminRoute && !isAuthRoute;

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <UrlProgressProvider>
          <PendingTasksProvider>
            {showPublicHeader && <Header />}
            <Component {...pageProps} />
            {showFooter && <Footer />}
          </PendingTasksProvider>
        </UrlProgressProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
