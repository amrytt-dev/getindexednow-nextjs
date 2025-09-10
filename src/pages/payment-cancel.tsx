import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function PaymentCancel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show a toast notification when the page loads
    toast({
      title: "Payment Cancelled",
      description:
        "Your payment was cancelled. You can try again or choose a different plan.",
      variant: "destructive",
    });
  }, []);

  const handleRetryPayment = () => {
    // Get the last upgrade plan ID from localStorage
    const lastUpgradePlanId = localStorage.getItem("lastUpgradePlanId");
    if (lastUpgradePlanId) {
      // Redirect to plans-billing with the selected plan
      router.push(`/plans-billing?selectedPlan=${lastUpgradePlanId}`);
    } else {
      // Just go to plans-billing
      router.push("/plans-billing");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 rounded-xl shadow-sm bg-white">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-[#fce8e6] rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-[#ea4335]" />
          </div>
          <CardTitle className="text-2xl text-[#202124]">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-[#5f6368] mt-2">
            Your payment was cancelled and no charges were made to your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-[#f8f9fa] rounded-lg p-4">
            <h3 className="font-medium text-[#3c4043] mb-2">What happened?</h3>
            <ul className="text-sm text-[#5f6368] space-y-1">
              <li>• You cancelled the payment process</li>
              <li>• No subscription was created</li>
              <li>• No charges were made to your account</li>
              <li>• You can try again anytime</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetryPayment}
              className="w-full bg-[#4285f4] hover:bg-[#3b78e7] text-white rounded-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Try Again
            </Button>

            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full bg-white text-[#3c4043] border border-[#dadce0] hover:bg-[#f8f9fa] rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="text-center">
            <Button
              onClick={() => router.push("/plans-billing")}
              variant="ghost"
              className="text-[#4285f4] hover:text-[#3b78e7] hover:bg-[#e8f0fe]"
            >
              View All Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
