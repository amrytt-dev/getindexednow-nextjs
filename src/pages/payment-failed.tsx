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
import { XCircle, ArrowLeft, CreditCard, RefreshCw } from "lucide-react";

export default function PaymentFailed() {
  const router = useRouter();

  const handleRetryPayment = () => {
    router.push("/plans-billing");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-md overflow-hidden">
          {/* Error Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center text-white">
            <div className="relative mb-4">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <XCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
            <p className="text-red-100 text-lg">
              We couldn't process your payment
            </p>
          </div>

          <CardContent className="p-6">
            {/* Error Details */}
            <div className="space-y-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">
                      Payment Not Processed
                    </h3>
                    <p className="text-sm text-red-700">
                      Your payment could not be completed. This could be due to
                      insufficient funds, card issues, or other payment
                      problems.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-2">Common reasons for payment failure:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Insufficient funds in your account</li>
                  <li>Card expired or blocked</li>
                  <li>Incorrect billing information</li>
                  <li>Bank security restrictions</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRetryPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={handleGoToDashboard}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>

            {/* Support Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 mb-2">
                Need help? Contact our support team for assistance with payment
                issues.
              </p>
              <Link
                href="/contact-us"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
