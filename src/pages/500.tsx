import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";

export default function Custom500() {
  const router = useRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="w-full max-w-md">
        <div className="w-full flex justify-center mb-8">
          <img src="/logo.svg" alt="GetIndexedNow Logo" className="h-12" />
        </div>

        <Card className="border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-orange-500" />
            </div>
            <div className="text-6xl font-bold text-orange-500 mb-4">500</div>
            <CardTitle className="text-2xl font-bold">
              Internal Server Error
            </CardTitle>
            <CardDescription>
              Something went wrong on our end. We're working to fix it.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-foreground/70 mb-6">
                We apologize for the inconvenience. Please try again in a few
                moments.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={handleRefresh} className="w-full" size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>

              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                If the problem persists, please contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
