import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import Link from "next/link";

export default function ConfirmEmailChangePage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "cancelled" | "security"
  >("loading");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const token = router.query.token as string;
    const action = router.query.action as string;

    if (!token || !action) {
      setStatus("error");
      setMessage("Invalid confirmation link. Missing required parameters.");
      return;
    }

    if (!["confirm", "cancel"].includes(action)) {
      setStatus("error");
      setMessage("Invalid action specified.");
      return;
    }

    handleEmailChangeConfirmation(token, action as "confirm" | "cancel");
  }, [router.query]);

  const handleEmailChangeConfirmation = async (
    token: string,
    action: "confirm" | "cancel"
  ) => {
    try {
      const result = await fetchWithAuth(
        `/user/email/confirm-change?token=${token}&action=${action}`,
        {
          method: "GET",
          requireAuth: false, // Allow email link access without requiring auth
        }
      );

      if (action === "cancel") {
        setStatus("cancelled");
        setMessage("Email change request has been cancelled successfully.");
      } else {
        setStatus("success");
        setMessage("Email address changed successfully!");
        setDetails(result);
      }
    } catch (error: any) {
      console.error("Email change confirmation error:", error);

      if (error.status === 403) {
        setStatus("security");
        setMessage(
          "This email change request has expired or is no longer valid."
        );
      } else {
        setStatus("error");
        setMessage(
          error.message || "Failed to confirm email change. Please try again."
        );
      }
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "error":
        return <XCircle className="h-12 w-12 text-red-500" />;
      case "cancelled":
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
      case "security":
        return <AlertTriangle className="h-12 w-12 text-orange-500" />;
      default:
        return <Mail className="h-12 w-12 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "cancelled":
        return "text-yellow-600";
      case "security":
        return "text-orange-600";
      default:
        return "text-blue-600";
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "success":
        return "Email Changed Successfully";
      case "error":
        return "Email Change Failed";
      case "cancelled":
        return "Email Change Cancelled";
      case "security":
        return "Security Alert";
      default:
        return "Processing Email Change";
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
            <div className="flex justify-center">{getStatusIcon()}</div>
            <CardTitle
              className={`text-2xl font-bold text-center ${getStatusColor()}`}
            >
              {getStatusTitle()}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-foreground/70 mb-4">{message}</p>
            </div>

            {status === "success" && details && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>
                      <strong>Old Email:</strong> {details.oldEmail}
                    </p>
                    <p>
                      <strong>New Email:</strong> {details.newEmail}
                    </p>
                    <p>
                      <strong>Changed At:</strong>{" "}
                      {new Date(details.changedAt).toLocaleString()}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {status === "security" && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  For security reasons, email change requests expire after 24
                  hours. Please request a new email change from your account
                  settings.
                </AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  There was an error processing your email change request.
                  Please try again or contact support if the problem persists.
                </AlertDescription>
              </Alert>
            )}

            {status === "cancelled" && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your email change request has been cancelled. Your current
                  email address remains unchanged.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              {status === "success" && (
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full"
                  size="lg"
                >
                  Go to Dashboard
                </Button>
              )}

              {status === "error" && (
                <Button
                  onClick={() => router.push("/user/setting/account")}
                  className="w-full"
                  size="lg"
                >
                  Try Again
                </Button>
              )}

              {status === "security" && (
                <Button
                  onClick={() => router.push("/user/setting/account")}
                  className="w-full"
                  size="lg"
                >
                  Request New Change
                </Button>
              )}

              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
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
