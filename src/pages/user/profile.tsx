import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { MonthlyUsageCard } from "@/components/dashboard/MonthlyUsageCard";
import { SubscriptionTimeline } from "@/components/dashboard/SubscriptionTimeline";
import { ExtraCreditsExpiration } from "@/components/dashboard/ExtraCreditsExpiration";
import { CustomUserSubscription } from "@/types/subscription";
import { getWithAuth, postWithAuth } from "@/utils/fetchWithAuth";
import { AuthWrapper } from "@/components/AuthWrapper";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserProfilePage() {
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [creditUsage, setCreditUsage] = useState({
    total_used: 0,
    total_available: 0,
    remaining_credits: 0,
  });
  const [subscription, setSubscription] =
    useState<CustomUserSubscription | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [userCreditsData, setUserCreditsData] = useState<any>(null);

  // Fetch real credit usage and subscription data
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoadingData(true);

      // Fetch user profile data
      const profileData = await getWithAuth<any>("/user/profile");
      setUserEmail(profileData.email || "");
      setFirstName(profileData.firstName || "");
      setLastName(profileData.lastName || "");
      setContactNumber(profileData.contactNumber || "");

      // Fetch credit usage data
      const creditsData = await getWithAuth<any>("/user/credits");
      setCreditUsage(creditsData);
      setUserCreditsData(creditsData);

      // Fetch subscription data
      const subscriptionData = await getWithAuth<any>("/user/subscription");
      setSubscription(subscriptionData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const form = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handlePasswordChange = async (values: ChangePasswordFormValues) => {
    if (values.newPassword !== values.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await postWithAuth("/auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      toast({
        title: "Success",
        description: "Password changed successfully.",
      });

      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and view your usage statistics.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input value={userEmail} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input value={firstName} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input value={lastName} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Contact Number</label>
                <Input value={contactNumber} disabled className="mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handlePasswordChange)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    rules={{ required: "Current password is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    rules={{ required: "New password is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    rules={{ required: "Please confirm your new password" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Changing Password..." : "Change Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Usage Statistics */}
        <div className="grid gap-6 md:grid-cols-2">
          <MonthlyUsageCard />
          <ExtraCreditsExpiration />
        </div>

        {/* Subscription Timeline */}
        {subscription && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription History</CardTitle>
              <CardDescription>
                Your subscription timeline and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionTimeline />
            </CardContent>
          </Card>
        )}
      </div>
    </AuthWrapper>
  );
}
