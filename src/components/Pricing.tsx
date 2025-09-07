
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {Check, Loader2, Star} from "lucide-react";
import {Link} from "react-router-dom";
import {usePlans} from "@/hooks/useLandingData.ts";
import {Badge} from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { postWithAuth } from "@/utils/fetchWithAuth";
import { toast } from "@/hooks/use-toast";

// Define the plan interface based on the API response
interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  includesInPlan: string;
  isActive: boolean;
  isFreePlan: boolean;
  descriptions?: string;
  billingCycle?: string;
}

// Extended plan interface with transformed properties
interface TransformedPlan extends Plan {
  popular: boolean;
  buttonText: string;
  buttonVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero" | "google";
}

const Pricing = () => {
  const { data: plansData = [], isLoading: loadingPlans } = usePlans();
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  // Handle plan selection
  const handlePlanSelect = async (planName: string, planId: string) => {
    setLoading(planName);
    try {
      if (!user) {
        // Store selected plan information for redirect after login
        localStorage.setItem('selectedPlanAfterLogin', JSON.stringify({
          planId: planId,
          planName: planName,
          timestamp: Date.now()
        }));
        
        // Redirect to auth page if not logged in
        window.location.href = '/auth';
        return;
      }
      
      // For logged-in users, create direct checkout session
      const result = await postWithAuth('/user/subscription/checkout', {
        planId: planId
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      if (result.checkoutSession?.url) {
        // Redirect to Stripe checkout
        window.location.href = result.checkoutSession.url;
      } else {
        toast({
          title: "Error",
          description: "Failed to create checkout session",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  // Transform the API response into the desired format
  const transformPlan = (plan: Plan): TransformedPlan => {
    // Determine if this is a professional plan (which should be marked as popular)
    const isProfessional = plan.name.toLowerCase().includes("professional");

    // Set button text based on plan name
    let buttonText = `Choose ${plan.name}`;
    if (plan.name.toLowerCase().includes("free")) {
      buttonText = "Start For Free";
    }

    // Set button variant based on plan type
    let buttonVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero" | "google" = "hero";
    if (plan.name.toLowerCase().includes("free")) {
      buttonVariant = "outline";
    } else if (plan.name.toLowerCase().includes("starter") || plan.name.toLowerCase().includes("basic")) {
      buttonVariant = "hero";
    } else if (isProfessional) {
      buttonVariant = "hero";
    }

    return {
      ...plan,
      popular: isProfessional,
      buttonText,
      buttonVariant,
      descriptions: plan.descriptions || `${plan.name} Plan`,
      billingCycle: plan.billingCycle || "monthly"
    };
  };

  // Transform all plans
  const plans = plansData.map(transformPlan);

  // Split plans into two rows with 3 plans each
  const rows = [];
  for (let i = 0; i < plans.length; i += 3) {
    rows.push(plans.slice(i, i + 3));
  }

  // Common card rendering function to maintain consistency
  const renderPlanCard = (plan: TransformedPlan, index: number) => {
    const highlight = plan.popular;
    const isLoading = loading === plan.name;

    return (
        <Card
            key={index}
            className={`relative border bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 
          ${highlight ? "ring-2 ring-primary scale-105" : ""}
          w-full flex flex-col
        `}
        >
          {highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="flex items-center rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 text-xs font-medium text-white">
                  <Star className="mr-1 h-3 w-3" />
                  Most Popular
                </div>
              </div>
          )}

          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">{plan.name}</CardTitle>
            <CardDescription className="text-muted-foreground">{plan.descriptions}</CardDescription>
            <div className="mt-4">
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-foreground">${plan.price / 100}</span>
                <span className="ml-1 text-sm text-muted-foreground">/ {plan.billingCycle}</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {plan.credits.toLocaleString()} Credits • ${((plan.price / 100) / plan.credits).toFixed(3)}/credit
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 flex-grow flex flex-col">
            <ul className="space-y-3 mb-auto">
              {plan.includesInPlan.split(",").map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <Check className="mr-3 h-4 w-4 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
              ))}
            </ul>
            <Button
                variant={plan.buttonVariant}
                className="w-full mt-6"
                size="lg"
                onClick={() => handlePlanSelect(plan.name, plan.id)}
                disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                plan.buttonText
              )}
            </Button>
          </CardContent>
        </Card>
    );
  };

  return (
      <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
        {loadingPlans ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-muted-foreground">Loading plans...</span>
            </div>
        ) : (
            <>
              <div className="container mx-auto px-4 lg:px-8">
                <div className="mx-auto max-w-3xl text-center mb-16">
                  <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                    Choose your perfect{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              monthly plan
            </span>
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Monthly subscription plans that scale with your business
                  </p>
                </div>

                <div className="grid gap-12">
                  {/* Render each row with consistent 3-column layout */}
                  {rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {row.map((plan, index) => renderPlanCard(plan, index))}
                      </div>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <p className="text-muted-foreground">
                    All plans include a 30-day money-back guarantee. Need a custom plan?{" "}
                    <Link to="/contact-us" className="text-primary hover:underline font-medium">
                      Contact our sales team
                    </Link>
                  </p>
                </div>
              </div>
            </>
        )}
      </section>
  );
};

export default Pricing;