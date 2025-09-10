import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const { toast } = useToast();
  const [status, setStatus] = useState<
    "verifying" | "success" | "error" | "expired"
  >("verifying");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || typeof token !== "string") {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        const backendBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(
          `${backendBaseUrl}/api/auth/verify-email?token=${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.code === 0) {
          setStatus("success");
          setMessage(
            "Your email has been successfully verified! You can now log in to your account."
          );

          toast({
            title: "Email verified successfully",
            description: "You can now log in to your account.",
          });
        } else {
          setStatus("error");
          setMessage(
            data.error ||
              "Verification failed. The link may be invalid or expired."
          );

          toast({
            title: "Verification failed",
            description:
              data.error || "The verification link is invalid or expired.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage("Failed to verify email. Please try again later.");

        toast({
          title: "Verification failed",
          description: "Failed to verify email. Please try again later.",
          variant: "destructive",
        });
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, toast]);

  const handleGoToLogin = () => {
    router.push("/auth");
  };

  const handleResendEmail = () => {
    // This would require implementing a resend verification email endpoint
    toast({
      title: "Resend verification email",
      description: "Please contact support to resend your verification email.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === "verifying" && (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "verifying" && "Verifying Email"}
            {status === "success" && "Email Verified"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-center">{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You can now access all features of your account.
              </p>
              <Button onClick={handleGoToLogin} className="w-full">
                Go to Login
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                If you continue to have issues, please contact our support team.
              </p>
              <div className="space-y-2">
                <Button onClick={handleGoToLogin} className="w-full">
                  Go to Login
                </Button>
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </Button>
              </div>
            </div>
          )}

          {status === "verifying" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
