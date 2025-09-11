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
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Check,
  Zap,
  ArrowLeft,
  Loader2,
  CreditCard,
  Crown,
  Star,
  Building,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  monthly_credits: number;
  features: readonly string[];
  is_popular: boolean;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      // Mock plans data - implement your own API
      const data: any[] = [];

      // Mock plans data loaded successfully
      if (data && data.length > 0) {
        const plansData: Plan[] = data.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          price_monthly: plan.price_monthly,
          monthly_credits: plan.monthly_credits,
          features: Array.isArray(plan.features)
            ? (plan.features as readonly string[])
            : ([] as readonly string[]),
          is_popular: plan.is_popular || false,
        }));
        setPlans(plansData);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId: string) => {
    setPurchasing(planId);
    try {
      // Implement your purchase logic here
      toast({
        title: "Purchase System",
        description: "Please implement your own purchase system.",
      });
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setPurchasing(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "starter":
        return <Zap className="h-6 w-6" />;
      case "professional":
        return <Crown className="h-6 w-6" />;
      case "enterprise":
        return <Building className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "starter":
        return "text-blue-600";
      case "professional":
        return "text-purple-600";
      case "enterprise":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                GetIndexedNow
              </span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your indexing needs. All plans include
            our core features with different credit limits.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.length === 0 ? (
            // Default plans when no data is available
            <>
              <Card className="relative">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <CardDescription>Perfect for small websites</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>1,000 credits/month</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>Basic indexing</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>Email support</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => handlePurchase("starter")}
                  >
                    {purchasing === "starter" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative border-purple-200">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">
                    Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                    <Crown className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Professional</CardTitle>
                  <CardDescription>
                    Ideal for growing businesses
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>5,000 credits/month</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>Priority indexing</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>Analytics dashboard</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handlePurchase("professional")}
                  >
                    {purchasing === "professional" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    Get Professional
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                    <Building className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For large-scale operations</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$299</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>20,000 credits/month</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>VIP indexing</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>24/7 support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>Dedicated account manager</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => handlePurchase("enterprise")}
                  >
                    {purchasing === "enterprise" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.is_popular ? "border-purple-200" : ""
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div
                    className={`mx-auto mb-4 p-3 rounded-full w-fit ${getPlanColor(
                      plan.name
                    )
                      .replace("text-", "bg-")
                      .replace("-600", "-100")}`}
                  >
                    {getPlanIcon(plan.name)}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.monthly_credits.toLocaleString()} credits/month
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${plan.price_monthly}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.is_popular ? "bg-purple-600 hover:bg-purple-700" : ""
                    }`}
                    onClick={() => handlePurchase(plan.id)}
                  >
                    {purchasing === plan.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    {plan.name === "Enterprise"
                      ? "Contact Sales"
                      : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">What are credits?</h3>
              <p className="text-gray-600">
                Credits are used to submit URLs for indexing. Each URL
                submission consumes one credit.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 7-day free trial for all new users to test our
                service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
