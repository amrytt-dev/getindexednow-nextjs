import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/contexts/UserContext";
import { useMemo } from "react";
import { UrlProgressProvider } from "@/contexts/UrlProgressContext";
import { PendingTasksProvider } from "@/contexts/PendingTasksContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const queryClient = useMemo(() => new QueryClient(), []);

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

  const showHeaderFooter = !isAdminRoute && !isAuthRoute;

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <UrlProgressProvider>
          <PendingTasksProvider>
            {showHeaderFooter && <Header />}
            <Component {...pageProps} />
            {showHeaderFooter && <Footer />}
          </PendingTasksProvider>
        </UrlProgressProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
