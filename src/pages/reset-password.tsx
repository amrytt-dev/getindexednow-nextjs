import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  LoaderCircle,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { getFirebaseAuth } from "@/utils/firebaseClient";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { oobCode } = router.query;

  const form = useForm<ResetPasswordFormValues>({
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  // Verify the reset code when component mounts
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode || typeof oobCode !== "string") {
        setError("Invalid or missing reset code.");
        setVerifying(false);
        return;
      }

      try {
        const auth = getFirebaseAuth();
        if (!auth) {
          throw new Error("Firebase is not configured.");
        }

        // Verify the password reset code
        await verifyPasswordResetCode(auth, oobCode);
        setValidToken(true);
      } catch (error: any) {
        console.error("Code verification error:", error);

        let errorMessage = "Invalid or expired reset code.";

        switch (error.code) {
          case "auth/expired-action-code":
            errorMessage =
              "This reset link has expired. Please request a new one.";
            break;
          case "auth/invalid-action-code":
            errorMessage =
              "This reset link is invalid. Please request a new one.";
            break;
          case "auth/user-disabled":
            errorMessage = "This account has been disabled.";
            break;
          default:
            errorMessage = error.message || "Invalid or expired reset code.";
        }

        setError(errorMessage);
      } finally {
        setVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    if (values.password !== values.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (values.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth || !oobCode || typeof oobCode !== "string") {
        throw new Error("Invalid configuration or reset code.");
      }

      // Confirm the password reset
      await confirmPasswordReset(auth, oobCode, values.password);

      setPasswordReset(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);

      let errorMessage = "Failed to reset password. Please try again.";

      switch (error.code) {
        case "auth/expired-action-code":
          errorMessage =
            "This reset link has expired. Please request a new one.";
          break;
        case "auth/invalid-action-code":
          errorMessage =
            "This reset link is invalid. Please request a new one.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your connection and try again.";
          break;
        default:
          errorMessage =
            error.message || "Failed to reset password. Please try again.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="w-full flex justify-center">
            <img
              src="/logo.svg"
              alt="GetIndexedNow Logo"
              className="h-12 mb-2"
            />
          </div>

          <Card className="border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex justify-center">
                <LoaderCircle className="h-12 w-12 text-primary animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Verifying Reset Link
              </CardTitle>
              <CardDescription className="text-center text-foreground/70">
                Please wait while we verify your reset link...
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="w-full flex justify-center">
            <img
              src="/logo.svg"
              alt="GetIndexedNow Logo"
              className="h-12 mb-2"
            />
          </div>

          <Card className="border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-destructive">
                Invalid Reset Link
              </CardTitle>
              <CardDescription className="text-center text-foreground/70">
                {error}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                onClick={() => router.push("/forgot-password")}
                className="w-full"
                variant="outline"
              >
                Request New Reset Link
              </Button>

              <Button
                onClick={() => router.push("/auth")}
                className="w-full"
                variant="ghost"
              >
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (passwordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="w-full flex justify-center">
            <img
              src="/logo.svg"
              alt="GetIndexedNow Logo"
              className="h-12 mb-2"
            />
          </div>

          <Card className="border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Password Reset Successful
              </CardTitle>
              <CardDescription className="text-center text-foreground/70">
                Your password has been updated successfully. You can now sign in
                with your new password.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                onClick={() => router.push("/auth")}
                className="w-full"
                variant="hero"
              >
                Sign In Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!validToken) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-gradient-to-tr from-secondary/10 to-primary/10 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <div className="w-full flex justify-center">
          <img src="/logo.svg" alt="GetIndexedNow Logo" className="h-12 mb-2" />
        </div>

        <Card className="border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center text-foreground/70">
              Enter your new password below.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  rules={{
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === form.getValues("password") ||
                      "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  variant="hero"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <div className="flex justify-center pb-6">
            <Link
              href="/auth"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
