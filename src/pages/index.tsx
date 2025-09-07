import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import { TaskDashboardSection } from "@/components/TaskDashboardSection";
import { useUser } from "@/contexts/UserContext";

declare global {
  interface Window {
    google?: any;
  }
}

export default function Home() {
  const { user, setToken } = useUser();
  const router = useRouter();

  const handleSuccessfulLogin = () => {
    const selectedPlanData = localStorage.getItem("selectedPlanAfterLogin");

    if (selectedPlanData) {
      try {
        const planData = JSON.parse(selectedPlanData);
        const now = Date.now();
        const timeDiff = now - planData.timestamp;

        if (timeDiff < 30 * 60 * 1000) {
          localStorage.removeItem("selectedPlanAfterLogin");
          setTimeout(() => {
            router.replace(`/plans-billing?selectedPlan=${planData.planId}`);
          }, 100);
          return;
        } else {
          localStorage.removeItem("selectedPlanAfterLogin");
        }
      } catch (error) {
        console.error("Error parsing selected plan data:", error);
        localStorage.removeItem("selectedPlanAfterLogin");
      }
    }

    setTimeout(() => {
      router.replace("/dashboard");
    }, 100);
  };

  const handleGoogleSignIn = () => {
    const backendBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const popup = window.open(
      `${backendBaseUrl}/api/auth/google`,
      "google-oauth",
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes,status=1`
    );
    if (!popup) return;

    const listener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (
        (event as any).data?.type === "google-auth-success" &&
        (event as any).data.token
      ) {
        await setToken((event as any).data.token);
        handleSuccessfulLogin();
      }
    };
    window.addEventListener("message", listener);

    const timer = setInterval(() => {
      if (popup.closed) {
        window.removeEventListener("message", listener);
        clearInterval(timer);
      }
    }, 500);
  };

  useEffect(() => {
    if (user) return;
    if (process.env.NEXT_PUBLIC_DISABLE_GOOGLE_ONE_TAP === "true") {
      try {
        window.google?.accounts?.id?.cancel?.();
      } catch {}
      return;
    }

    const scriptId = "google-one-tap-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = scriptId;
      document.body.appendChild(script);
      script.onload = () => {
        window.google?.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
          callback: async (response: any) => {
            const backendBaseUrl =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const res = await fetch(
              `${backendBaseUrl}/api/auth/google/onetap`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential }),
              }
            );
            const data = await res.json();
            if ((data as any).token) {
              await setToken((data as any).token);
              handleSuccessfulLogin();
            }
          },
        });
        window.google?.accounts.id.prompt();
      };
    } else {
      window.google?.accounts.id.prompt();
    }
  }, [user]);

  return (
    <div className="bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Hero />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Features />
      </motion.div>

      <TaskDashboardSection />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <HowItWorks />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Testimonials />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Pricing />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <FAQ />
      </motion.div>
    </div>
  );
}
