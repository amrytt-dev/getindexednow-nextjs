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
import { LoaderCircle, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getFirebaseAuth } from "@/utils/firebaseClient";
import { sendPasswordResetEmail } from "firebase/auth";

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error("Firebase is not configured. Please try again later.");
      }

      // Use Firebase's built-in password reset email
      await sendPasswordResetEmail(auth, values.email);

      setEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);

      let errorMessage = "Please try again later.";

      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your connection and try again.";
          break;
        default:
          errorMessage = error.message || "Please try again later.";
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

  if (emailSent) {
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
                Check Your Email
              </CardTitle>
              <CardDescription className="text-center text-foreground/70">
                We've sent password reset instructions to your email address.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  If you don't see the email, check your spam folder. The reset
                  link will expire in 1 hour.
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => router.push("/auth")}
                className="w-full"
                variant="outline"
              >
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
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
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center text-foreground/70">
              Enter your email address and we'll send you a link to reset your
              password.
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
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            autoComplete="email"
                            className="pl-10"
                            {...field}
                          />
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
                      Sending Reset Link...
                    </span>
                  ) : (
                    "Send Reset Link"
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
