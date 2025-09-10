import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Loader2,
  Clock,
  Zap,
  ArrowRight,
  CreditCard,
  Calendar,
} from "lucide-react";
import { getWithAuth } from "@/utils/fetchWithAuth";
import { getAuthToken } from "@/utils/authToken";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  includesInPlan: string;
  descriptions?: string;
  billingCycle: string;
}

interface Subscription {
  id: string;
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  carriedForwardCredits?: number;
}

export default function PaymentSuccess() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [alreadyProcessed, setAlreadyProcessed] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const sessionId = router.query.session_id as string;
  const [countdown, setCountdown] = useState(10);

  // Function to wait for Firebase token with timeout
  const waitForAuthToken = async (
    maxRetries = 10,
    delay = 1000
  ): Promise<string | null> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const token = await getAuthToken();
        if (token) {
          return token;
        }
        // Wait before next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        console.error(`Auth token attempt ${i + 1} failed:`, error);
      }
    }
    return null;
  };

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setVerifying(false);
        return;
      }

      // Check if this session has already been processed in this browser session
      const processedSessions = JSON.parse(
        sessionStorage.getItem("processedPaymentSessions") || "[]"
      );
      if (processedSessions.includes(sessionId)) {
        setAlreadyProcessed(true);
        setVerified(true);
        await fetchSubscriptionData();
        return;
      }

      try {
        // Wait for Firebase token to be available
        console.log("Waiting for Firebase token...");
        const token = await waitForAuthToken();

        if (!token) {
          console.error("Failed to get Firebase token after retries");
          setAuthError(
            "Authentication failed. Please try refreshing the page."
          );
          setVerifying(false);
          return;
        }

        console.log(
          "Firebase token obtained, proceeding with payment verification"
        );

        // Call backend to confirm subscription upgrade
        const planId = localStorage.getItem("lastUpgradePlanId");
        if (!planId) {
          console.error("No plan ID found in localStorage");
          setVerifying(false);
          return;
        }

        const response = await getWithAuth(
          `/user/subscription/confirm?sessionId=${sessionId}&planId=${planId}&action=upgrade`
        );

        if (response.success) {
          // Mark this session as processed
          const processedSessions = JSON.parse(
            sessionStorage.getItem("processedPaymentSessions") || "[]"
          );
          processedSessions.push(sessionId);
          sessionStorage.setItem(
            "processedPaymentSessions",
            JSON.stringify(processedSessions)
          );

          setVerified(true);
          await fetchSubscriptionData();
        } else {
          console.error("Payment verification failed:", response.error);
          setVerifying(false);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setAuthError("Payment verification failed. Please contact support.");
        setVerifying(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const fetchSubscriptionData = async () => {
    setLoadingSubscription(true);
    try {
      const response = await getWithAuth("/user/subscription");
      if (response.hasActiveSubscription && response.subscription) {
        setSubscription(response.subscription);
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  useEffect(() => {
    if (verified && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (verified && countdown === 0) {
      router.push("/dashboard");
    }
  }, [verified, countdown, router]);

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-md overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Verifying Payment...
                </h2>
                <p className="text-gray-600">
                  Please wait while we confirm your subscription and
                  authenticate
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-md overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {authError
                    ? "Authentication Error"
                    : "Payment Verification Failed"}
                </h2>
                <p className="text-gray-600">
                  {authError ||
                    "We couldn't verify your payment. Please contact support if this issue persists."}
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/plans-billing")}
                    className="w-full"
                  >
                    Back to Plans
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-md overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center text-white">
            <div className="relative mb-4">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-white/30 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {alreadyProcessed
                ? "Payment Already Processed!"
                : "Payment Successful!"}
            </h1>
            <p className="text-green-100 text-lg">
              {alreadyProcessed
                ? "Your subscription is already active"
                : "Your subscription has been activated"}
            </p>
          </div>

          <CardContent className="p-6">
            {/* Countdown Timer */}
            {countdown > 0 && (
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Redirecting to dashboard in {countdown} seconds...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Subscription Details */}
            {loadingSubscription ? (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Loading subscription details...
                </p>
              </div>
            ) : subscription ? (
              <div className="space-y-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">
                        Subscription Active
                      </h3>
                      <p className="text-sm text-green-700">
                        Your plan is now active and ready to use
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Plan</p>
                    <p className="font-semibold">{subscription.planId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-semibold text-green-600">Active</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-semibold">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">End Date</p>
                    <p className="font-semibold">
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoToDashboard}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Zap className="h-4 w-4 mr-2" />
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/plans-billing")}
                className="w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                You can now start using all the features of your new plan. Check
                your dashboard for available credits and start indexing!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
