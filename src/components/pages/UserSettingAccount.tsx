import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Lock, Shield, Eye, EyeOff, Key, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { postWithAuth } from "@/utils/fetchWithAuth";
import { TwoFactorManagement } from "@/components/TwoFactorManagement";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const UserSettingAccount = () => {
  const router = useRouter();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [activeSection, setActiveSection] = useState("change-password");
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  // Check for 2FA verification redirect
  useEffect(() => {
    const verify2fa = router.query.verify2fa as string | undefined;
    const twofaVerified = router.query["2faVerified"] as string | undefined;

    if (verify2fa) {
      // User clicked email link with token
      handleEmailVerification(verify2fa);
    } else if (twofaVerified === "true") {
      // User came back from backend verification
      setShow2FASetup(true);
      setActiveSection("two-factor-auth");
      // Clear the URL parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("2faVerified");
      window.history.replaceState({}, "", newUrl.toString());

      toast({
        title: "Email verified successfully",
        description: "You can now proceed with 2FA setup.",
      });
    }
  }, [router.query]);

  const handleEmailVerification = async (token: string) => {
    setIsVerifying(true);
    try {
      console.log("Verifying token:", token);
      console.log(
        "API URL:",
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/api/2fa/verify-enablement/${token}`
      );

      // Call the backend to verify the token
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/api/2fa/verify-enablement/${token}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);

        // Token verified successfully, show QR setup
        setShow2FASetup(true);
        setActiveSection("two-factor-auth");

        // Clear the URL parameter
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("verify2fa");
        window.history.replaceState({}, "", newUrl.toString());

        toast({
          title: "Email verified successfully",
          description: "You can now proceed with 2FA setup.",
        });
      } else {
        const error = await response.json();
        console.log("Error response:", error);
        toast({
          title: "Verification failed",
          description: error.error || "Invalid or expired verification link.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification failed",
        description: "Unable to verify your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("#change-password, #two-fa");
      let currentSection = "change-password";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const offset = 200; // Increased offset for better detection

        // Check if section is in viewport
        if (rect.top <= offset && rect.bottom >= offset) {
          currentSection =
            section.id === "two-fa" ? "two-factor-auth" : section.id;
        }
      });

      // If we're at the bottom of the page, keep the last section active
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      if (isAtBottom) {
        // Find the last section and keep it active
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
          currentSection =
            lastSection.id === "two-fa" ? "two-factor-auth" : lastSection.id;
        }
      }

      setActiveSection(currentSection);
    };

    // Debounced scroll handler to improve performance
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    window.addEventListener("scroll", debouncedScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const onSubmit = async (values: ChangePasswordFormValues) => {
    if (values.newPassword !== values.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your new passwords match.",
        variant: "destructive",
      });
      return;
    }
    try {
      await postWithAuth("/auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast({
        title: "Password changed successfully",
        description: "Your password has been updated.",
      });
      reset();
    } catch (e) {
      toast({
        title: "Password change failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const newPassword = watch("newPassword");

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(
      sectionId === "two-factor-auth" ? "two-fa" : sectionId
    );
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handle2FAStatusChange = () => {
    // Refresh the page or update the 2FA status
    window.location.reload();
  };

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              Verifying your email...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden mb-6">
        <div className="flex bg-[#f1f3f4] rounded-lg p-1">
          <Button
            variant={activeSection === "change-password" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 ${
              activeSection === "change-password"
                ? "bg-white text-[#4285f4] shadow-sm"
                : "text-[#5f6368]"
            }`}
            onClick={() => scrollToSection("change-password")}
          >
            <Key className="h-4 w-4 mr-2" />
            Password
          </Button>
          <Button
            variant={activeSection === "two-factor-auth" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 ${
              activeSection === "two-factor-auth"
                ? "bg-white text-[#4285f4] shadow-sm"
                : "text-[#5f6368]"
            }`}
            onClick={() => scrollToSection("two-factor-auth")}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            2FA
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation - Hidden on mobile */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <div className="sticky top-24">
            <Card className="shadow-none border bg-muted">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Account Security
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your account security settings
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={
                    activeSection === "change-password" ? "default" : "ghost"
                  }
                  className={`w-full justify-start gap-3 h-12 text-left transition-all duration-300 ease-in-out relative ${
                    activeSection === "change-password"
                      ? "bg-[#4285f4] text-white shadow-md scale-105 border border-[#4285f4]"
                      : "hover:bg-[#f8f9fa] hover:scale-102 hover:border hover:border-[#dadce0]"
                  }`}
                  onClick={() => scrollToSection("change-password")}
                >
                  <Key
                    className={`h-4 w-4 transition-transform duration-300 ${
                      activeSection === "change-password"
                        ? "text-white scale-110"
                        : ""
                    }`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Change Password</span>
                    <span
                      className={`text-xs transition-colors duration-300 ${
                        activeSection === "change-password"
                          ? "text-white/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      Update your password
                    </span>
                  </div>
                </Button>
                <Button
                  variant={
                    activeSection === "two-factor-auth" ? "default" : "ghost"
                  }
                  className={`w-full justify-start gap-3 h-12 text-left transition-all duration-300 ease-in-out relative ${
                    activeSection === "two-factor-auth"
                      ? "bg-[#4285f4] text-white shadow-md scale-105 border border-[#4285f4]"
                      : "hover:bg-[#f8f9fa] hover:scale-102 hover:border hover:border-[#dadce0]"
                  }`}
                  onClick={() => scrollToSection("two-factor-auth")}
                >
                  <Smartphone
                    className={`h-4 w-4 transition-transform duration-300 ${
                      activeSection === "two-factor-auth"
                        ? "text-white scale-110"
                        : ""
                    }`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Two-Factor Auth</span>
                    <span
                      className={`text-xs transition-colors duration-300 ${
                        activeSection === "two-factor-auth"
                          ? "text-white/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      Add extra security
                    </span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8 min-h-[1200px]">
          {/* Password Change Section */}
          <Card
            id="change-password"
            className="shadow-none border bg-gradient-to-br from-background to-muted/20 scroll-mt-24"
          >
            <CardHeader className="pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Change Password
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-8">
              <div className="max-w-2xl">
                <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm">
                        Password Requirements
                      </h3>
                      <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                        <li>• At least 6 characters long</li>
                        <li>
                          • Use a combination of letters, numbers, and symbols
                        </li>
                        <li>• Avoid using easily guessable information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Enter your current password"
                        className="h-11 pr-10"
                        {...register("currentPassword", {
                          required: "Current password is required",
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-11 w-11 px-0 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("current")}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="Enter your new password"
                        className="h-11 pr-10"
                        {...register("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-11 w-11 px-0 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="Confirm your new password"
                        className="h-11 pr-10"
                        {...register("confirmPassword", {
                          required: "Please confirm your new password",
                          validate: (value) =>
                            value === newPassword || "Passwords do not match",
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-11 w-11 px-0 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto h-11 px-8 text-white bg-primary hover:bg-primary/80 hover:text-white"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Changing Password...
                        </div>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Change Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication Section */}
          <div id="two-fa" className="scroll-mt-28">
            <TwoFactorManagement
              onStatusChange={handle2FAStatusChange}
              showSetupDirectly={show2FASetup}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
