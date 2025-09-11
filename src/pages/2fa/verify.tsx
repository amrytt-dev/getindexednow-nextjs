import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Shield, ArrowLeft } from "lucide-react";
import { twoFactorApi } from "@/utils/twoFactorApi";
import { useUser } from "@/contexts/UserContext";
import { OTPInput } from "@/components/ui/otp-input";
import Link from "next/link";

export default function TwoFactorVerificationPage() {
  const router = useRouter();
  const { setToken } = useUser();
  const [otpValue, setOtpValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userIdParam = router.query.userId as string;
    if (!userIdParam) {
      toast({
        title: "Invalid verification request",
        description: "Please log in again.",
        variant: "destructive",
      });
      router.push("/auth");
      return;
    }
    setUserId(userIdParam);
  }, [router]);

  const handleVerify = async (code?: string) => {
    const tokenToVerify = code || otpValue;

    if (!userId || !tokenToVerify || tokenToVerify.length !== 6) {
      toast({
        title: "Invalid token",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await twoFactorApi.verifyLoginToken(
        userId,
        tokenToVerify
      );
      setToken(response.token);
      toast({
        title: "Login successful",
        description: "You have been authenticated successfully.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("2FA verification error:", error);
      toast({
        title: "Verification failed",
        description:
          error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!userId) return;

    try {
      // Note: Resend functionality would need to be implemented in the backend
      // For now, we'll show a message that the user should check their authenticator app
      toast({
        title: "Check your authenticator app",
        description:
          "Please check your authenticator app for the current verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend code",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="w-full max-w-md">
        <div className="w-full flex justify-center mb-8">
          <img src="/logo.svg" alt="GetIndexedNow Logo" className="h-12" />
        </div>

        <Card className="border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Two-Factor Authentication
            </CardTitle>
            <p className="text-center text-foreground/70">
              Enter the 6-digit code from your authenticator app
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Open your authenticator app and enter the code for
                  GetIndexedNow
                </p>
              </div>

              <OTPInput
                value={otpValue}
                onChange={setOtpValue}
                onComplete={handleVerify}
                length={6}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleVerify()}
                className="w-full"
                size="lg"
                disabled={isSubmitting || otpValue.length !== 6}
              >
                {isSubmitting ? "Verifying..." : "Verify Code"}
              </Button>

              <Button
                onClick={handleResendCode}
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
              >
                Resend Code
              </Button>
            </div>

            <div className="text-center">
              <Link
                href="/auth"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
