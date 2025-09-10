import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useUser } from "@/contexts/UserContext";
import {
  Shield,
  LoaderCircle,
  ArrowLeft,
  LockKeyhole,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useEmailAvailability } from "@/hooks/useEmailAvailability";
import {
  checkEnvironmentVariables,
  testEnvironmentVariables,
} from "@/utils/envChecker";
import { getFirebaseAuth } from "@/utils/firebaseClient";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Add Google One Tap types for TypeScript
declare global {
  interface Window {
    google?: any;
  }
}

interface AuthFormValues {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  confirmPassword?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { setToken } = useUser();
  const {
    renderRecaptcha,
    getRecaptchaResponse,
    resetRecaptcha,
    cleanup,
    isLoaded,
    widgetRendered,
    retryRender,
  } = useRecaptcha();

  // Debug: Log reCAPTCHA configuration
  useEffect(() => {
    console.log("AuthPage Debug - reCAPTCHA config:", {
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? "SET" : "NOT SET",
      siteKeyLength: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.length || 0,
      isLoaded,
      widgetRendered,
      grecaptchaExists: !!window.grecaptcha,
      googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        ? "SET"
        : "NOT SET",
    });

    // Check environment variables on component mount
    checkEnvironmentVariables();
    testEnvironmentVariables();
  }, [isLoaded, widgetRendered]);

  // Check for admin access message from redirect
  const adminMessage =
    typeof router.query.message === "string" ? router.query.message : undefined;

  // Auto-handle Google login token
  useEffect(() => {
    const token =
      typeof router.query.token === "string" ? router.query.token : null;
    if (token) {
      // If opened as a popup, post message to opener
      if (window.opener && window.opener !== window) {
        window.opener.postMessage(
          { type: "google-auth-success", token },
          window.location.origin
        );
        window.close();
      } else {
        // Set token and wait for user context to update before navigating
        const handleTokenAndNavigate = async () => {
          await setToken(token);
          // Small delay to ensure user context has time to update
          setTimeout(() => {
            router.replace("/dashboard");
          }, 100);
        };
        handleTokenAndNavigate();
      }
    }
  }, [router.query.token, setToken, router]);

  // Fallback reCAPTCHA script loading if dynamic loading fails
  useEffect(() => {
    const loadRecaptchaScript = () => {
      if (
        !window.grecaptcha &&
        !document.querySelector('script[src*="recaptcha/api.js"]')
      ) {
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Fallback reCAPTCHA script loaded successfully");
          if (window.grecaptcha) {
            console.log("Fallback: grecaptcha object available");
          }
        };
        script.onerror = (error) => {
          console.error("Fallback reCAPTCHA script failed to load:", error);
        };
        document.head.appendChild(script);
        console.log("Fallback reCAPTCHA script loading initiated");
      }
    };

    // Try to load after a delay if not already loaded
    const timer = setTimeout(loadRecaptchaScript, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  // Render reCAPTCHA widget when script is loaded or tab changes
  useEffect(() => {
    if (isLoaded) {
      const renderWidget = async () => {
        try {
          // Clean up any existing widgets first
          cleanup();

          // Wait for the DOM to be fully updated after tab change
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Clear any existing widgets first
          const signinContainer = document.getElementById("recaptcha-signin");
          const signupContainer = document.getElementById("recaptcha-signup");

          if (signinContainer) signinContainer.innerHTML = "";
          if (signupContainer) signupContainer.innerHTML = "";

          // Render widget in the active tab's container
          const targetContainer =
            activeTab === "signin" ? "recaptcha-signin" : "recaptcha-signup";
          console.log(
            `Attempting to render reCAPTCHA in container: ${targetContainer}`
          );

          // The renderRecaptcha function now handles retries internally
          await renderRecaptcha(targetContainer);

          // Clear reCAPTCHA errors when tab changes
          setRecaptchaError(null);
        } catch (error) {
          console.error("Failed to render reCAPTCHA widget:", error);
          setRecaptchaError(
            "reCAPTCHA failed to load. Please refresh the page and try again."
          );
        }
      };
      renderWidget();
    }
  }, [isLoaded, renderRecaptcha, cleanup, activeTab]);

  // Cleanup reCAPTCHA when component unmounts
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Utility function to handle redirects after successful login
  const handleSuccessfulLogin = useCallback(() => {
    // Check if there's a selected plan stored from the landing page
    const selectedPlanData = localStorage.getItem("selectedPlanAfterLogin");

    if (selectedPlanData) {
      try {
        const planData = JSON.parse(selectedPlanData);
        const now = Date.now();
        const timeDiff = now - planData.timestamp;

        // Only use the stored plan if it's less than 30 minutes old
        if (timeDiff < 30 * 60 * 1000) {
          // Clear the stored plan data
          localStorage.removeItem("selectedPlanAfterLogin");

          // Small delay to ensure user context has time to update
          setTimeout(() => {
            router.replace(`/plans-billing?selectedPlan=${planData.planId}`);
          }, 100);
          return;
        } else {
          // Clear expired plan data
          localStorage.removeItem("selectedPlanAfterLogin");
        }
      } catch (error) {
        console.error("Error parsing selected plan data:", error);
        localStorage.removeItem("selectedPlanAfterLogin");
      }
    }

    // Default redirect to dashboard with small delay
    setTimeout(() => {
      router.replace("/dashboard");
    }, 100);
  }, [router]);

  if (typeof router.query.token === "string") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-foreground/70">Logging you in...</p>
        </div>
      </div>
    );
  }

  const signInForm = useForm<AuthFormValues>({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });
  const signUpForm = useForm<AuthFormValues>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      contactNumber: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  // Get email from signup form for real-time validation
  const signupEmail = signUpForm?.watch("email") || "";
  const emailAvailability = useEmailAvailability(signupEmail);

  const handleSignUp = async (values: AuthFormValues) => {
    // Clear any previous reCAPTCHA errors
    setRecaptchaError(null);

    if (values.password !== values.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    // Check reCAPTCHA response
    const recaptchaResponse = getRecaptchaResponse();
    console.log(
      "SignUp - reCAPTCHA response length:",
      recaptchaResponse.length
    );
    console.log("SignUp - Widget rendered:", widgetRendered);
    console.log("SignUp - Is loaded:", isLoaded);

    if (!recaptchaResponse) {
      if (!widgetRendered) {
        setRecaptchaError(
          "reCAPTCHA is still loading. Please wait a moment and try again."
        );
      } else {
        setRecaptchaError("Please complete the reCAPTCHA verification.");
      }
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        contactNumber: values.contactNumber,
        recaptchaToken: recaptchaResponse,
      };
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error?.["_errors"]?.[0] || data.error || "Registration failed"
        );
      }
      // After backend registration, sign in to Firebase to obtain ID token
      try {
        const auth = getFirebaseAuth();
        if (auth) {
          const cred = await signInWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );
          const idToken = await cred.user.getIdToken();
          await setToken(idToken);
        }
      } catch (e) {
        console.error("Firebase sign-in after register failed:", e);
      }
      toast({
        title: "Account created",
        description:
          "You have successfully registered. Please check your email to verify your account before logging in",
      });
      handleSuccessfulLogin();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      resetRecaptcha();
      setRecaptchaError(null);
    }
  };

  const handleSignIn = async (values: AuthFormValues) => {
    // Clear any previous reCAPTCHA errors
    setRecaptchaError(null);

    // Check reCAPTCHA response
    const recaptchaResponse = getRecaptchaResponse();
    console.log(
      "SignIn - reCAPTCHA response length:",
      recaptchaResponse.length
    );
    console.log("SignIn - Widget rendered:", widgetRendered);
    console.log("SignIn - Is loaded:", isLoaded);

    if (!recaptchaResponse) {
      if (!widgetRendered) {
        setRecaptchaError(
          "reCAPTCHA is still loading. Please wait a moment and try again."
        );
      } else {
        setRecaptchaError("Please complete the reCAPTCHA verification.");
      }
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...values,
        recaptchaToken: recaptchaResponse,
      };
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error?.["_errors"]?.[0] || data.error || "Login failed"
        );
      }

      // Check if 2FA is required
      if (data.requires2FA) {
        toast({
          title: "Two-factor authentication required",
          description: "Please enter the code from your authenticator app.",
        });
        router.push(`/2fa/verify?userId=${data.userId}`);
        return;
      }

      // Use Firebase email/password sign-in to obtain a Firebase ID token
      try {
        const auth = getFirebaseAuth();
        if (auth) {
          const cred = await signInWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );
          const idToken = await cred.user.getIdToken();
          await setToken(idToken);
        }
      } catch (e) {
        console.error("Firebase sign-in failed:", e);
      }
      toast({
        title: "Login successful",
        description: "You are now signed in.",
      });
      handleSuccessfulLogin();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      resetRecaptcha();
      setRecaptchaError(null);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        toast({
          title: "Google sign-in unavailable",
          description: "Firebase is not configured on the client.",
          variant: "destructive",
        });
        return;
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const cred = await signInWithPopup(auth, provider);
      const idToken = await cred.user.getIdToken();
      await setToken(idToken);
      toast({
        title: "Login successful",
        description: "You are now signed in.",
      });
      handleSuccessfulLogin();
    } catch (error: any) {
      console.error("Google sign-in failed:", error);
      toast({
        title: "Google sign-in failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle reCAPTCHA interaction and clear errors
  const handleRecaptchaInteraction = () => {
    if (recaptchaError) {
      setRecaptchaError(null);
    }
  };

  // Effect to clear reCAPTCHA error when user completes verification
  useEffect(() => {
    const checkRecaptchaCompletion = () => {
      const recaptchaResponse = getRecaptchaResponse();
      if (recaptchaResponse && recaptchaError) {
        setRecaptchaError(null);
      }
    };

    // Check every 500ms if reCAPTCHA is completed
    const interval = setInterval(checkRecaptchaCompletion, 500);
    return () => clearInterval(interval);
  }, [recaptchaError, getRecaptchaResponse]);

  // Google One Tap functionality - only on auth page
  useEffect(() => {
    // Temporary kill-switch: set VITE_DISABLE_GOOGLE_ONE_TAP=true to disable
    if (process.env.NEXT_PUBLIC_DISABLE_GOOGLE_ONE_TAP === "true") {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel?.();
        } catch {}
      }
      return;
    }

    // Check if Google Client ID is configured
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.warn("Google Client ID not configured - skipping Google One Tap");
      return;
    }

    // Small delay to ensure we're on the auth page
    const timer = setTimeout(() => {
      // Load Google One Tap script
      const scriptId = "google-one-tap-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.id = scriptId;
        document.body.appendChild(script);
        script.onload = () => {
          if (window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: async (response: any) => {
                // Send credential to backend for verification/registration
                const backendBaseUrl =
                  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                try {
                  const res = await fetch(
                    `${backendBaseUrl}/api/auth/google/onetap`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ credential: response.credential }),
                    }
                  );
                  const data = await res.json();
                  if (data.token) {
                    await setToken(data.token);
                    toast({
                      title: "Login successful",
                      description: "You are now signed in.",
                    });
                    handleSuccessfulLogin();
                  } else {
                    toast({
                      title: "Login failed",
                      description: data.error || "Please try again.",
                      variant: "destructive",
                    });
                  }
                } catch (error) {
                  toast({
                    title: "Login failed",
                    description: "Please try again later.",
                    variant: "destructive",
                  });
                }
              },
            });
            // Show the One Tap prompt
            window.google.accounts.id.prompt();
          }
        };
      } else {
        // If script is already loaded, reinitialize and show the prompt
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response: any) => {
              // Send credential to backend for verification/registration
              const backendBaseUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
              try {
                const res = await fetch(
                  `${backendBaseUrl}/api/auth/google/onetap`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ credential: response.credential }),
                  }
                );
                const data = await res.json();
                if (data.token) {
                  await setToken(data.token);
                  toast({
                    title: "Login successful",
                    description: "You are now signed in.",
                  });
                  handleSuccessfulLogin();
                } else {
                  toast({
                    title: "Login failed",
                    description: data.error || "Please try again.",
                    variant: "destructive",
                  });
                }
              } catch (error) {
                toast({
                  title: "Login failed",
                  description: "Please try again later.",
                  variant: "destructive",
                });
              }
            },
          });
          window.google.accounts.id.prompt();
        }
      }
    }, 500); // 500ms delay to ensure page is fully loaded

    return () => {
      clearTimeout(timer);
    };
  }, [setToken, router.push, handleSuccessfulLogin]);

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
          <Link href="/">
            <img
              src="/logo.svg"
              alt="GetIndexedNow Logo"
              className="h-12 mb-4 lg:mb-6"
            />
          </Link>
        </div>
        <Card className="border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              <span className="text-2xl font-bold tracking-tight text-foreground ">
                Welcome Back
              </span>
            </CardTitle>
            <CardDescription className="text-center text-foreground/70">
              Sign in to your account or create a new one
            </CardDescription>

            {adminMessage && (
              <Alert className="mt-4 border-red-200 bg-red-50 ">
                <Shield className="h-4 w-4 text-red-600 " />
                <AlertDescription className="text-red-800">
                  {adminMessage}
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <Button
                  type="button"
                  variant="google"
                  className="w-full flex items-center justify-center gap-2 mb-6"
                  onClick={handleGoogleAuth}
                >
                  <svg className="h-5 w-5" viewBox="0 0 48 48">
                    <g>
                      <path
                        fill="#4285F4"
                        d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.68 2.36 30.77 0 24 0 14.82 0 6.71 5.06 2.69 12.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"
                      />
                      <path
                        fill="#34A853"
                        d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.19 5.59C43.93 37.36 46.1 31.47 46.1 24.55z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.67 28.64c-1.01-2.99-1.01-6.29 0-9.28l-7.98-6.2C.64 17.1 0 20.47 0 24c0 3.53.64 6.9 1.77 10.13l7.98-6.2z"
                      />
                      <path
                        fill="#EA4335"
                        d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.19-5.59c-2.01 1.35-4.59 2.16-8.7 2.16-6.38 0-11.87-3.63-14.33-8.94l-7.98 6.2C6.71 42.94 14.82 48 24 48z"
                      />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </g>
                  </svg>
                  Continue with Google
                </Button>

                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="mx-3 text-xs text-foreground/50">
                    or continue with email
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <Form {...signInForm}>
                  <form
                    onSubmit={signInForm.handleSubmit(handleSignIn)}
                    className="space-y-4"
                  >
                    <FormField
                      control={signInForm.control}
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
                    <FormField
                      control={signInForm.control}
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
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <Link
                              href="/forgot-password"
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type={showSignInPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className="pl-10 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignInPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={
                                  showSignInPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showSignInPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col items-center mb-4">
                      <div
                        id="recaptcha-signin"
                        className="min-h-[78px] min-w-[304px] flex items-center justify-center"
                        onClick={handleRecaptchaInteraction}
                      ></div>
                      {recaptchaError && activeTab === "signin" && (
                        <p className="text-sm text-red-600 mt-2 text-center font-medium bg-red-50 px-3 py-2 rounded-md border border-red-200">
                          {recaptchaError}
                        </p>
                      )}
                      {!isLoaded && activeTab === "signin" && (
                        <p className="text-sm text-yellow-600 mt-2 text-center font-medium bg-yellow-50 px-3 py-2 rounded-md border border-yellow-200">
                          Loading reCAPTCHA...
                        </p>
                      )}
                      {isLoaded &&
                        !widgetRendered &&
                        activeTab === "signin" && (
                          <div className="text-center">
                            <p className="text-sm text-blue-600 mt-2 font-medium bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                              Initializing reCAPTCHA...
                            </p>
                            <button
                              type="button"
                              onClick={retryRender}
                              className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                            >
                              Retry if not loading
                            </button>
                          </div>
                        )}
                    </div>
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
                          Signing In...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup">
                <Button
                  type="button"
                  variant="google"
                  className="w-full flex items-center justify-center gap-2 mb-6"
                  onClick={handleGoogleAuth}
                >
                  <svg className="h-5 w-5" viewBox="0 0 48 48">
                    <g>
                      <path
                        fill="#4285F4"
                        d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.68 2.36 30.77 0 24 0 14.82 0 6.71 5.06 2.69 12.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"
                      />
                      <path
                        fill="#34A853"
                        d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.19 5.59C43.93 37.36 46.1 31.47 46.1 24.55z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.67 28.64c-1.01-2.99-1.01-6.29 0-9.28l-7.98-6.2C.64 17.1 0 20.47 0 24c0 3.53.64 6.9 1.77 10.13l7.98-6.2z"
                      />
                      <path
                        fill="#EA4335"
                        d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.19-5.59c-2.01 1.35-4.59 2.16-8.7 2.16-6.38 0-11.87-3.63-14.33-8.94l-7.98 6.2C6.71 42.94 14.82 48 24 48z"
                      />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </g>
                  </svg>
                  Continue with Google
                </Button>

                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="mx-3 text-xs text-foreground/50">
                    or register with email
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <Form {...signUpForm}>
                  <form
                    onSubmit={signUpForm.handleSubmit(handleSignUp)}
                    className="space-y-4"
                  >
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                        validate: (value) => {
                          if (emailAvailability.error) {
                            return emailAvailability.error;
                          }
                          if (emailAvailability.isAvailable === false) {
                            return "This email is already registered";
                          }
                          return true;
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
                                className={`pl-10 pr-10 ${
                                  emailAvailability.isAvailable === true
                                    ? "border-green-500 focus:border-green-500"
                                    : emailAvailability.isAvailable === false
                                    ? "border-red-500 focus:border-red-500"
                                    : ""
                                }`}
                                {...field}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {emailAvailability.isChecking && (
                                  <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
                                )}
                                {emailAvailability.isAvailable === true &&
                                  !emailAvailability.isChecking && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                {emailAvailability.isAvailable === false &&
                                  !emailAvailability.isChecking && (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                          {emailAvailability.isAvailable === true &&
                            !emailAvailability.isChecking && (
                              <p className="text-sm text-green-600 mt-1">
                                ✓ Email is available
                              </p>
                            )}
                          {emailAvailability.isAvailable === false &&
                            !emailAvailability.isChecking && (
                              <p className="text-sm text-red-600 mt-1">
                                ✗ This email is already registered
                              </p>
                            )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
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
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type={showSignUpPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                                className="pl-10 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignUpPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={
                                  showSignUpPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showSignUpPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="confirmPassword"
                      rules={{
                        required: "Please confirm your password",
                        validate: (value) => {
                          const password = signUpForm.getValues("password");
                          return value === password || "Passwords do not match";
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                className="pl-10 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword((v) => !v)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={
                                  showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col items-center mb-4">
                      <div
                        id="recaptcha-signup"
                        className="min-h-[78px] min-w-[304px] flex items-center justify-center"
                        onClick={handleRecaptchaInteraction}
                      ></div>
                      {recaptchaError && activeTab === "signup" && (
                        <p className="text-sm text-red-600 mt-2 text-center font-medium bg-red-50 px-3 py-2 rounded-md border border-red-200">
                          {recaptchaError}
                        </p>
                      )}
                      {!isLoaded && activeTab === "signup" && (
                        <p className="text-sm text-yellow-600 mt-2 text-center font-medium bg-yellow-50 px-3 py-2 rounded-md border border-yellow-200">
                          Loading reCAPTCHA...
                        </p>
                      )}
                      {isLoaded &&
                        !widgetRendered &&
                        activeTab === "signup" && (
                          <div className="text-center">
                            <p className="text-sm text-blue-600 mt-2 font-medium bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                              Initializing reCAPTCHA...
                            </p>
                            <button
                              type="button"
                              onClick={retryRender}
                              className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                            >
                              Retry if not loading
                            </button>
                          </div>
                        )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      variant="hero"
                      disabled={
                        loading ||
                        emailAvailability.isAvailable === false ||
                        emailAvailability.isChecking
                      }
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </span>
                      ) : emailAvailability.isChecking ? (
                        <span className="flex items-center">
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Checking Email...
                        </span>
                      ) : emailAvailability.isAvailable === false ? (
                        "Email Already Registered"
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-center pt-0 pb-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Home
            </Link>
          </CardFooter>
        </Card>

        <p className="text-center mt-6 text-xs text-foreground/60">
          By continuing, you agree to our
          <Link
            href="/terms-and-conditions"
            className="text-primary hover:underline mx-1"
          >
            Terms of Service
          </Link>
          and
          <Link
            href="/privacy-policy"
            className="text-primary hover:underline mx-1"
          >
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
