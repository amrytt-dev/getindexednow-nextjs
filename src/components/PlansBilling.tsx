import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Check,
  Zap,
  CreditCard,
  Crown,
  Star,
  Building,
  Loader2,
  ExternalLink,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { CustomUserSubscription } from "@/types/subscription";
import { useRouter } from "next/router";
import { MonthlyUsageCard } from "@/components/dashboard/MonthlyUsageCard";
import { DowngradeInfoCard } from "@/components/dashboard/DowngradeInfoCard";
import { CancelInfoCard } from "@/components/dashboard/CancelInfoCard";
import { getWithAuth, postWithAuth, ApiError } from "@/utils/fetchWithAuth";

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  includesInPlan: string;
  isActive: boolean;
}

interface CurrentSubscription {
  id: string;
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  plan: {
    id: string;
    name: string;
    price: number;
    credits: number;
    includesInPlan: string;
  };
}

function redirectWithDarkOverlay(url: string) {
  // Set body background to dark (Tailwind slate-900)
  document.body.style.background = "#0f172a";
  document.body.style.transition = "background 0.2s";

  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "#0f172a";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.innerHTML = `
    <div style="color: white; font-size: 1.5rem; text-align: center;">
      <svg class='animate-spin' style='margin: 0 auto 1rem auto; height: 2.5rem; width: 2.5rem;' fill='none' viewBox='0 0 24 24' stroke='currentColor'><circle class='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4'></circle><path class='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path></svg>
      Redirecting to payment...
    </div>
  `;
  document.body.appendChild(overlay);

  // Delay to ensure overlay is visible before redirect
  setTimeout(() => {
    window.location.href = url;
  }, 200);
}

export const PlansBilling = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [currentSubscription, setCurrentSubscription] =
    useState<CurrentSubscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [action, setAction] = useState<"upgrade" | "downgrade" | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<any[]>([]);
  const [creditUsage, setCreditUsage] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingCreditUsage, setLoadingCreditUsage] = useState(true);
  const [userCreditsData, setUserCreditsData] = useState<any>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPlans();
    fetchCurrentSubscription();
    fetchSubscriptionHistory();
    fetchCreditUsage();
    fetchCredits();
  }, []);

  // Handle selected plan from URL parameter (after login from landing page)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlanId = urlParams.get("selectedPlan");

    if (selectedPlanId && plans.length > 0) {
      const plan = plans.find((p) => p.id === selectedPlanId);
      if (plan) {
        setSelectedPlan(plan);
        setAction("upgrade");
        // Clear the URL parameter
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("selectedPlan");
        window.history.replaceState({}, "", newUrl.toString());

        // Show a toast to inform the user
        toast({
          title: "Plan Selected",
          description: `You've selected the ${plan.name} plan. Click "Upgrade" to proceed with checkout.`,
        });
      }
    }
  }, [plans]);

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);
      const data = await getWithAuth<Plan[]>("/plans", { requireAuth: false });
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive",
      });
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      setLoadingSubscription(true);
      const data = await getWithAuth<{
        hasActiveSubscription: boolean;
        subscription: CurrentSubscription;
      }>("/user/subscription");
      if (data.hasActiveSubscription) {
        setCurrentSubscription(data.subscription);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const fetchSubscriptionHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await getWithAuth<{ history: any[] }>(
        "/user/subscription/history"
      );
      setSubscriptionHistory(data.history || []);
    } catch (error) {
      console.error("Error fetching subscription history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchCreditUsage = async () => {
    try {
      setLoadingCreditUsage(true);
      const data = await getWithAuth<{ usage: any[] }>("/user/credits/usage");
      setCreditUsage(data.usage || []);
    } catch (error) {
      console.error("Error fetching credit usage:", error);
      setCreditUsage([]); // Set empty array on error
    } finally {
      setLoadingCreditUsage(false);
    }
  };

  const fetchCredits = async () => {
    try {
      setLoadingCredits(true);
      const data = await getWithAuth<any>("/user/credits");
      setUserCreditsData(data);
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoadingCredits(false);
    }
  };

  const handlePlanChange = async (
    plan: Plan,
    action: "upgrade" | "downgrade"
  ) => {
    if (action === "downgrade") {
      setSelectedPlan(plan);
      setAction(action);
      setShowDowngradeDialog(true);
      return;
    }

    // Handle upgrade immediately
    await processPlanChange(plan, action);
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelLoading(true);
      await postWithAuth<any>("/user/subscription/cancel", {});
      toast({
        title: "Subscription cancellation scheduled",
        description:
          "You can continue using your remaining credits until the end of this billing period.",
      });
      setShowCancelDialog(false);
      await fetchCurrentSubscription();
      await fetchCredits();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const processPlanChange = async (
    plan: Plan,
    action: "upgrade" | "downgrade"
  ) => {
    try {
      setLoading(plan.id);
      const data = await postWithAuth<any>("/user/subscription/change", {
        planId: plan.id,
        action: action,
      });

      if (action === "upgrade") {
        console.log("upgrade Data >>>>>>:", data);
        if (data.error) {
          console.error("Upgrade error:", data.error);
          toast({
            title: "Upgrade Failed",
            description:
              data.error || "Failed to process upgrade. Please try again.",
            variant: "destructive",
          });
        } else if (data.checkoutSession && data.checkoutSession.url) {
          localStorage.setItem("lastUpgradePlanId", plan.id);
          console.log(
            "Redirecting to checkout session URL:",
            data.checkoutSession.url
          );
          redirectWithDarkOverlay(data.checkoutSession.url);
        } else {
          console.error("No checkout session URL received:", data);
          toast({
            title: "Upgrade Failed",
            description:
              "Unable to create checkout session. Please try again or contact support.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Plan Change Scheduled",
          description: data.message,
        });
        setShowDowngradeDialog(false);
        fetchCurrentSubscription();
      }
    } catch (error) {
      console.error("Error changing plan:", error);
      toast({
        title: "Error",
        description: "Failed to process plan change",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const confirmDowngrade = async () => {
    if (selectedPlan && action) {
      await processPlanChange(selectedPlan, action);
    }
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("starter"))
      return <Zap className="h-6 w-6 text-[#4285f4]" />;
    if (name.includes("professional"))
      return <CreditCard className="h-6 w-6 text-[#34a853]" />;
    if (name.includes("premium"))
      return <Star className="h-6 w-6 text-[#9334e6]" />;
    if (name.includes("enterprise"))
      return <Crown className="h-6 w-6 text-[#fbbc04]" />;
    if (name.includes("ultimate"))
      return <Building className="h-6 w-6 text-[#ea4335]" />;
    if (name.includes("corporate"))
      return <Building className="h-6 w-6 text-[#4285f4]" />;
    return <Zap className="h-6 w-6 text-[#4285f4]" />;
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.planId === planId;
  };

  const canUpgrade = (plan: Plan) => {
    if (!currentSubscription) return true;
    return plan.price > currentSubscription.plan.price;
  };

  const canDowngrade = (plan: Plan) => {
    if (!currentSubscription) return false;
    // Do not allow downgrade if cancellation is scheduled
    if (userCreditsData?.scheduledCancellation) return false;
    return plan.price < currentSubscription.plan.price;
  };

  const isFreePlan = () => {
    return currentSubscription?.plan.price === 0;
  };

  if (loadingPlans || loadingSubscription) {
    return (
      <div className="bg-[#f8f9fa]">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4285f4]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa]">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        {/* Hero Section - Google-style heading */}
        {/*<div className="mb-8">*/}
        {/*  <h1 className="text-[32px] font-normal text-[#202124] mb-2">*/}
        {/*    Plans & Billing*/}
        {/*  </h1>*/}
        {/*  <p className="text-[16px] text-[#5f6368] max-w-2xl">*/}
        {/*    Manage your subscription plan and monitor your usage with simple controls*/}
        {/*  </p>*/}
        {/*</div>*/}

        {/* Scheduled Messages */}
        {userCreditsData?.scheduledCancellation ? (
          <CancelInfoCard
            effectiveDate={userCreditsData.scheduledCancellation.effectiveDate}
          />
        ) : userCreditsData?.scheduledDowngrade ? (
          <DowngradeInfoCard
            toPlanName={userCreditsData.scheduledDowngrade.toPlanName}
            effectiveDate={userCreditsData.scheduledDowngrade.effectiveDate}
          />
        ) : null}

        {/* Subscription Details Section */}
        {currentSubscription && (
          <Card className="border-0 rounded-xl shadow-sm bg-white overflow-hidden mb-8">
            <CardHeader className="border-b border-[#dadce0]">
              <CardTitle className="text-xl text-[#202124]">
                Subscription Details
              </CardTitle>
              <CardDescription className="text-[#5f6368]">
                Information about your current subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6 flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-[#3c4043]">
                    Current Plan
                  </h4>
                  <p className="text-[#202124] flex items-center">
                    {getPlanIcon(currentSubscription.plan.name)}
                    <span className="ml-2">
                      {currentSubscription.plan.name}
                    </span>
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-[#3c4043]">
                    Billing Period
                  </h4>
                  <p className="text-[#202124]">
                    {new Date(
                      currentSubscription.startDate
                    ).toLocaleDateString()}{" "}
                    to{" "}
                    {new Date(currentSubscription.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-[#3c4043]">
                    Monthly Cost
                  </h4>
                  <p className="text-[#202124]">
                    ${(currentSubscription.plan.price / 100).toFixed(2)}/month
                  </p>
                </div>

                {/* <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 pt-4">
                  <Button 
                    className="bg-[#4285f4] hover:bg-[#3b78e7] text-white rounded-full"
                    onClick={() => window.open('https://billing.stripe.com/p/login/test_28o8xk2Nj9cm4AE288', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Customer Portal
                  </Button>
                </div> */}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monthly Plans Section */}
        <Card className="border-0 rounded-xl shadow-sm bg-white overflow-hidden mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-[#dadce0]">
            <div>
              <h2 className="text-xl font-medium text-[#202124]">
                Monthly Subscription Plans
              </h2>
              <p className="text-sm text-[#5f6368] mt-1">
                Choose the perfect plan with unified credits for all your needs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() =>
                  router.push("/user/setting/subscription-history")
                }
                className="bg-white text-[#4285f4] border border-[#dadce0] hover:bg-[#f8f9fa] rounded-full h-10 px-6 font-medium text-[14px] shadow-sm"
              >
                View History
              </Button>
              {!isFreePlan() && (
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  className="bg-[#ea4335] hover:bg-[#d93025] text-white rounded-full h-10 px-6 font-medium text-[14px] shadow-sm"
                  disabled={
                    cancelLoading || !!userCreditsData?.scheduledCancellation
                  }
                >
                  {cancelLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {userCreditsData?.scheduledCancellation
                    ? "Cancellation Scheduled"
                    : "Cancel Subscription"}
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrent = isCurrentPlan(plan.id);
                const canUpgradePlan = canUpgrade(plan);
                const canDowngradePlan = canDowngrade(plan);

                return (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden border border-[#dadce0] ${
                      isCurrent
                        ? "border-2 border-[#4285f4] bg-blue-50/30"
                        : "hover:shadow-md"
                    } transition-all duration-200 rounded-lg flex flex-col`}
                  >
                    {isCurrent && (
                      <div className="absolute top-0 right-0 bg-[#4285f4] text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                        Current Plan
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-full bg-[#f1f3f4] mr-3">
                          {getPlanIcon(plan.name)}
                        </div>
                        <CardTitle className="text-xl text-[#202124]">
                          {plan.name}
                        </CardTitle>
                      </div>
                      <div className="mt-2">
                        <div className="text-3xl font-normal text-[#202124]">
                          ${(plan.price / 100).toFixed(2)}
                          <span className="text-sm text-[#5f6368] font-normal ml-1">
                            /mo
                          </span>
                        </div>
                        <CardDescription className="text-[#5f6368] mt-1">
                          {plan.credits.toLocaleString()} Credits/month
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 flex-1 flex flex-col">
                      <div className="space-y-3 mb-6 flex-1">
                        {plan.includesInPlan
                          .split(",")
                          .map((feature, index) => (
                            <div key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-[#34a853] mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-[#3c4043]">
                                {feature.trim()}
                              </span>
                            </div>
                          ))}
                      </div>

                      <div className="mt-auto">
                        {isCurrent ? (
                          <Button
                            className="w-full bg-[#e8f0fe] text-[#4285f4] hover:bg-[#d2e3fc] rounded-full"
                            disabled
                          >
                            Current Plan
                          </Button>
                        ) : canUpgradePlan ? (
                          <Button
                            className="w-full bg-[#4285f4] hover:bg-[#3b78e7] text-white rounded-full"
                            onClick={() => handlePlanChange(plan, "upgrade")}
                            disabled={loading === plan.id}
                          >
                            {loading === plan.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <ArrowUp className="h-4 w-4 mr-2" />
                            )}
                            Upgrade
                          </Button>
                        ) : canDowngradePlan ? (
                          <Button
                            className="w-full bg-[#ea4335] hover:bg-[#d93025] text-white rounded-full"
                            onClick={() => handlePlanChange(plan, "downgrade")}
                            disabled={loading === plan.id}
                          >
                            {loading === plan.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <ArrowDown className="h-4 w-4 mr-2" />
                            )}
                            Downgrade
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed] rounded-full"
                            disabled
                          >
                            Unavailable
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Subscription Benefits Section */}
        <Card className="border-0 rounded-xl shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-[#dadce0]">
            <CardTitle className="text-xl text-[#202124]">
              Subscription Benefits
            </CardTitle>
            <CardDescription className="text-[#5f6368]">
              What you get with your monthly subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center mr-3">
                    <Zap className="h-4 w-4 text-[#4285f4]" />
                  </div>
                  <h3 className="font-medium text-[#202124]">
                    Unified Credits
                  </h3>
                </div>
                <p className="text-sm text-[#5f6368] pl-11">
                  Use credits for both indexing and checking tasks without
                  separate limits
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#e6f4ea] flex items-center justify-center mr-3">
                    <CreditCard className="h-4 w-4 text-[#34a853]" />
                  </div>
                  <h3 className="font-medium text-[#202124]">
                    VIP Queue Access
                  </h3>
                </div>
                <p className="text-sm text-[#5f6368] pl-11">
                  Priority processing with 5-minute crawler visits for all plans
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#fef7e0] flex items-center justify-center mr-3">
                    <Star className="h-4 w-4 text-[#fbbc04]" />
                  </div>
                  <h3 className="font-medium text-[#202124]">
                    Monthly Renewal
                  </h3>
                </div>
                <p className="text-sm text-[#5f6368] pl-11">
                  Credits refresh every month, cancel anytime through customer
                  portal
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#fce8e6] flex items-center justify-center mr-3">
                    <Crown className="h-4 w-4 text-[#ea4335]" />
                  </div>
                  <h3 className="font-medium text-[#202124]">
                    Easy Management
                  </h3>
                </div>
                <p className="text-sm text-[#5f6368] pl-11">
                  Update payment methods, change plans, or cancel through Stripe
                  portal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Downgrade Confirmation Dialog */}
      <Dialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <DialogContent className="rounded-xl">
          <DialogHeader className="border-b border-[#dadce0] pb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-[#fef7e0] mr-3">
                <AlertTriangle className="h-5 w-5 text-[#f9ab00]" />
              </div>
              <DialogTitle className="text-xl text-[#202124]">
                Confirm Plan Downgrade
              </DialogTitle>
            </div>
            <DialogDescription className="text-[#5f6368] mt-2">
              You're about to downgrade from{" "}
              <span className="font-medium">
                {currentSubscription?.plan.name}
              </span>{" "}
              to <span className="font-medium">{selectedPlan?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 px-6">
            <div className="p-4 bg-[#fef7e0] rounded-lg mb-4">
              <h4 className="font-medium text-[#3c4043] mb-2">
                What happens next?
              </h4>
              <ul className="text-sm text-[#5f6368] space-y-2">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#f9ab00] mr-2 mt-0.5" />
                  Your current plan will remain active until the end of your
                  billing period
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#f9ab00] mr-2 mt-0.5" />
                  You'll keep access to all current features until then
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#f9ab00] mr-2 mt-0.5" />
                  Your plan will automatically switch to {selectedPlan?.name} at
                  renewal
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#f9ab00] mr-2 mt-0.5" />
                  Your credit limit will change to{" "}
                  {selectedPlan?.credits.toLocaleString()} credits
                </li>
              </ul>
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => setShowDowngradeDialog(false)}
                className="flex-1 bg-white text-[#3c4043] border border-[#dadce0] hover:bg-[#f8f9fa] rounded-full"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDowngrade}
                className="flex-1 bg-[#ea4335] hover:bg-[#d93025] text-white rounded-full"
                disabled={loading === selectedPlan?.id}
              >
                {loading === selectedPlan?.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Confirm Downgrade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="rounded-xl">
          <DialogHeader className="border-b border-[#dadce0] pb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-[#fce8e6] mr-3">
                <AlertTriangle className="h-5 w-5 text-[#ea4335]" />
              </div>
              <DialogTitle className="text-xl text-[#202124]">
                Confirm Cancellation
              </DialogTitle>
            </div>
            <DialogDescription className="text-[#5f6368] mt-2">
              You’re about to cancel your subscription. You will keep access
              until the end of your current billing period
              {currentSubscription?.endDate
                ? ` (${new Date(
                    currentSubscription.endDate
                  ).toLocaleDateString()})`
                : ""}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 px-6">
            <div className="p-4 bg-[#fce8e6] rounded-lg mb-4">
              <h4 className="font-medium text-[#3c4043] mb-2">
                What happens next?
              </h4>
              <ul className="text-sm text-[#5f6368] space-y-2">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#ea4335] mr-2 mt-0.5" />
                  Your subscription will not renew after this period (no refund
                  will be issued)
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#ea4335] mr-2 mt-0.5" />
                  You can still upgrade to a higher plan at any time
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#ea4335] mr-2 mt-0.5" />
                  Downgrades are disabled while cancellation is scheduled
                </li>
              </ul>
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 bg-white text-[#3c4043] border border-[#dadce0] hover:bg-[#f8f9fa] rounded-full"
                disabled={cancelLoading}
              >
                Keep Subscription
              </Button>
              <Button
                onClick={handleCancelSubscription}
                className="flex-1 bg-[#ea4335] hover:bg-[#d93025] text-white rounded-full"
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
