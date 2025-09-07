import { useState, useEffect } from "react";
import { getWithAuth } from "@/utils/fetchWithAuth";

interface CreditUsage {
  indexer_used: number;
  checker_used: number;
  total_used: number;
}

interface TotalCredits {
  total_credits: number;
  subscription_credits: number;
  extra_credits: number;
}

// Import the type from the centralized location
import { CustomUserSubscription } from "@/types/subscription";

export interface UserCreditsInfo {
  creditsAvailable?: number;
  heldCredits?: number;
  usedCredits?: number;
  creditsUsed?: number;
  planName?: string;
  planStart?: string;
  planEnd?: string;
  isFreePlan?: boolean;
  remaining_credits?: number;
  total_available?: number;
  total_used?: number;
  warning?: string;
  // Added to support display of credit breakdowns
  bonusCredits?: number;
  carriedForwardCredits?: number;
}

export const useDashboardData = () => {
  const [subscription, setSubscription] =
    useState<CustomUserSubscription | null>(null);
  const [creditUsage, setCreditUsage] = useState<CreditUsage>({
    indexer_used: 0,
    checker_used: 0,
    total_used: 0,
  });
  const [totalCredits, setTotalCredits] = useState<TotalCredits | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    console.log("Dashboard: Starting fetchSubscription");
    setSubscriptionLoading(true);
    setError(null);

    try {
      // Fetch subscription data
      const responseData = await getWithAuth<{
        hasActiveSubscription: boolean;
        subscription: CustomUserSubscription;
      }>("/user/subscription");
      console.log("Subscription response received:", responseData);

      if (responseData.hasActiveSubscription && responseData.subscription) {
        // Use the original API response structure
        setSubscription(responseData.subscription);
      } else {
        console.log("No active subscription found, using free plan");
        // Create a free plan subscription object
        const freeSubscription: CustomUserSubscription = {
          id: "free-plan",
          plan_id: "free",
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          subscription_plans: {
            name: "Free",
            monthly_credits: parseInt(process.env.NEXT_PUBLIC_CREDIT || "4"),
            price_monthly: 0,
            features: ["50 URLs per month", "Basic reporting"],
          },
        };
        setSubscription(freeSubscription);
      }
    } catch (error) {
      console.error("Dashboard: Error in fetchSubscription:", error);
      console.log("No active subscription found, using free plan");
      // Create a free plan subscription object
      const freeSubscription: CustomUserSubscription = {
        id: "free-plan",
        plan_id: "free",
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        subscription_plans: {
          name: "Free",
          monthly_credits: parseInt(process.env.NEXT_PUBLIC_CREDIT || "4"),
          price_monthly: 0,
          features: ["50 URLs per month", "Basic reporting"],
        },
      };
      setSubscription(freeSubscription);
    } finally {
      console.log(
        "Dashboard: fetchSubscription completed, setting loading to false"
      );
      setSubscriptionLoading(false);
    }
  };

  const fetchCreditUsage = async () => {
    console.log("Dashboard: Starting fetchCreditUsage");
    try {
      // Fetch credit usage data
      const usageData = await getWithAuth<any>("/user/credits");
      console.log("Credit usage data received:", usageData);
      setCreditUsage({
        indexer_used: usageData.usedCredits || 0,
        checker_used: 0, // Not separated in this endpoint
        total_used: usageData.usedCredits || 0,
      });
    } catch (error) {
      console.error("Dashboard: Error in fetchCreditUsage:", error);
    }
  };

  const fetchTotalCredits = async () => {
    console.log("Dashboard: Starting fetchTotalCredits");
    try {
      // Fetch total credits data
      const creditsData = await getWithAuth<any>("/user/credits");
      console.log("Total credits data received:", creditsData);
      setTotalCredits({
        total_credits: creditsData.totalCredits || 0,
        subscription_credits: creditsData.totalCredits || 0,
        extra_credits: creditsData.bonusCredits || 0,
      });
    } catch (error) {
      console.error("Dashboard: Error in fetchTotalCredits:", error);
    }
  };

  const handleDataRefresh = () => {
    console.log("Dashboard: Refreshing data");
    fetchCreditUsage();
    fetchTotalCredits();
  };

  useEffect(() => {
    fetchSubscription();
    fetchCreditUsage();
    fetchTotalCredits();
  }, []);

  return {
    subscription,
    creditUsage,
    totalCredits,
    subscriptionLoading,
    error,
    fetchSubscription,
    handleDataRefresh,
  };
};
