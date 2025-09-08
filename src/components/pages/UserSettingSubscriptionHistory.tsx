import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  History,
  Calendar,
  Activity,
  CreditCard,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { getWithAuth } from "@/utils/fetchWithAuth";

interface Subscription {
  id: string;
  plan: {
    name: string;
    credits: number;
    price: number;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface CreditUsage {
  id: string;
  amount: number;
  createdAt: string;
  taskId?: string;
  taskTitle: string;
  taskStatus: string;
  planName: string;
  planCredits: number;
  type?: string;
}

export const UserSettingSubscriptionHistory = () => {
  const router = useRouter();
  const [subscriptionHistory, setSubscriptionHistory] = useState<
    Subscription[]
  >([]);
  const [creditUsage, setCreditUsage] = useState<CreditUsage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingCreditUsage, setLoadingCreditUsage] = useState(true);
  const [activeSection, setActiveSection] = useState("subscription-timeline");

  useEffect(() => {
    fetchSubscriptionHistory();
    fetchCreditUsage();
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(
        "#subscription-timeline, #credit-usage-history"
      );
      let currentSection = "subscription-timeline";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const offset = 200; // Increased offset for better detection

        // Check if section is in viewport
        if (rect.top <= offset && rect.bottom >= offset) {
          currentSection = section.id;
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
          currentSection = lastSection.id;
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

  const fetchSubscriptionHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await getWithAuth<{ history: Subscription[] }>(
        "/user/subscription/history"
      );
      setSubscriptionHistory(data.history || []);
    } catch (error) {
      console.error("Error fetching subscription history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchCreditUsage = async () => {
    try {
      setLoadingCreditUsage(true);
      const data = await getWithAuth<{ usage: CreditUsage[] }>(
        "/user/credits/usage"
      );
      setCreditUsage(data.usage || []);
    } catch (error) {
      console.error("Error fetching credit usage:", error);
      setCreditUsage([]); // Set empty array on error
    } finally {
      setLoadingCreditUsage(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden mb-6">
        <div className="flex bg-[#f1f3f4] rounded-lg p-1">
          <Button
            variant={
              activeSection === "subscription-timeline" ? "default" : "ghost"
            }
            size="sm"
            className={`flex-1 ${
              activeSection === "subscription-timeline"
                ? "bg-white text-[#4285f4] shadow-sm"
                : "text-[#5f6368]"
            }`}
            onClick={() => scrollToSection("subscription-timeline")}
          >
            <History className="h-4 w-4 mr-2" />
            Timeline
          </Button>
          <Button
            variant={
              activeSection === "credit-usage-history" ? "default" : "ghost"
            }
            size="sm"
            className={`flex-1 ${
              activeSection === "credit-usage-history"
                ? "bg-white text-[#4285f4] shadow-sm"
                : "text-[#5f6368]"
            }`}
            onClick={() => scrollToSection("credit-usage-history")}
          >
            <Activity className="h-4 w-4 mr-2" />
            Usage
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
                  Subscription History
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  View your subscription and usage history
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={
                    activeSection === "subscription-timeline"
                      ? "default"
                      : "ghost"
                  }
                  className={`w-full justify-start gap-3 h-12 text-left transition-all duration-300 ease-in-out relative ${
                    activeSection === "subscription-timeline"
                      ? "bg-[#4285f4] text-white shadow-md scale-105 border border-[#4285f4]"
                      : "hover:bg-[#f8f9fa] hover:scale-102 hover:border hover:border-[#dadce0]"
                  }`}
                  onClick={() => scrollToSection("subscription-timeline")}
                >
                  <History
                    className={`h-4 w-4 transition-transform duration-300 ${
                      activeSection === "subscription-timeline"
                        ? "text-white scale-110"
                        : ""
                    }`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Subscription Timeline</span>
                    <span
                      className={`text-xs transition-colors duration-300 ${
                        activeSection === "subscription-timeline"
                          ? "text-white/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      Plan changes history
                    </span>
                  </div>
                </Button>

                <Button
                  variant={
                    activeSection === "credit-usage-history"
                      ? "default"
                      : "ghost"
                  }
                  className={`w-full justify-start gap-3 h-12 text-left transition-all duration-300 ease-in-out relative ${
                    activeSection === "credit-usage-history"
                      ? "bg-[#4285f4] text-white shadow-md scale-105 border border-[#4285f4]"
                      : "hover:bg-[#f8f9fa] hover:scale-102 hover:border hover:border-[#dadce0]"
                  }`}
                  onClick={() => scrollToSection("credit-usage-history")}
                >
                  <Activity
                    className={`h-4 w-4 transition-transform duration-300 ${
                      activeSection === "credit-usage-history"
                        ? "text-white scale-110"
                        : ""
                    }`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Credit Usage History</span>
                    <span
                      className={`text-xs transition-colors duration-300 ${
                        activeSection === "credit-usage-history"
                          ? "text-white/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      Complete usage record
                    </span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6 min-h-[1200px]">
          {/* Subscription History Section - Google Style */}
          <Card
            id="subscription-timeline"
            className="shadow-none border overflow-hidden scroll-mt-24"
          >
            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-xl lg:text-2xl font-semibold">
                      Subscription Timeline
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Your subscription plan history and changes
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/plans-billing")}
                  className="btn-google bg-google-blue hover:bg-google-blue/90 text-white px-6"
                >
                  View Plans
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-google-blue border-t-transparent" />
                    <span className="text-muted-foreground">
                      Loading subscription history...
                    </span>
                  </div>
                </div>
              ) : subscriptionHistory.length === 0 ? (
                <div className="text-center py-8 bg-[#f8f9fa] rounded-lg">
                  <div className="p-4 rounded-full bg-[#e8f0fe] w-fit mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-google-blue" />
                  </div>
                  <p className="text-muted-foreground">
                    No subscription history found
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mobile-friendly card layout for smaller screens */}
                  <div className="block md:hidden space-y-4">
                    {subscriptionHistory.map((sub) => (
                      <div
                        key={sub.id}
                        className="card-google bg-white p-4 border border-[#dadce0]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">
                              {sub.plan?.name || "Unknown"}
                            </h3>
                            <p className="text-sm text-[#5f6368]">
                              ${Number(sub.plan?.price / 100 || 0).toFixed(2)}
                              /month
                            </p>
                          </div>
                          <Badge
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              sub.isActive
                                ? "bg-[#e6f4ea] text-google-green"
                                : "bg-[#f1f3f4] text-[#5f6368]"
                            }`}
                          >
                            {sub.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-[#5f6368]">Start Date</p>
                            <p className="font-medium">
                              {formatDate(sub.startDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#5f6368]">End Date</p>
                            <p className="font-medium">
                              {formatDate(sub.endDate)}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[#5f6368]">Credits</p>
                            <p className="font-medium">
                              {sub.plan?.credits?.toLocaleString() || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Table layout for larger screens */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#dadce0]">
                          <th className="text-left py-4 px-4 font-medium text-[#5f6368]">
                            Plan
                          </th>
                          <th className="text-left py-4 px-4 font-medium text-[#5f6368]">
                            Period
                          </th>
                          <th className="text-left py-4 px-4 font-medium text-[#5f6368]">
                            Status
                          </th>
                          <th className="text-left py-4 px-4 font-medium text-[#5f6368]">
                            Credits
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptionHistory.map((sub) => (
                          <tr
                            key={sub.id}
                            className="border-b border-[#dadce0] hover:bg-[#f8f9fa] transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium">
                                  {sub.plan?.name || "Unknown"}
                                </p>
                                <p className="text-sm text-[#5f6368]">
                                  $
                                  {Number(sub.plan?.price / 100 || 0).toFixed(
                                    2
                                  )}
                                  /month
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-google-blue" />
                                <span>
                                  {formatDate(sub.startDate)} -{" "}
                                  {formatDate(sub.endDate)}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  sub.isActive
                                    ? "bg-[#e6f4ea] text-google-green"
                                    : "bg-[#f1f3f4] text-[#5f6368]"
                                }`}
                              >
                                {sub.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 font-mono text-sm">
                              {sub.plan?.credits?.toLocaleString() || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credit Usage History Section - Google Style */}
          <Card
            id="credit-usage-history"
            className="shadow-none border overflow-hidden scroll-mt-24"
          >
            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-xl lg:text-2xl font-semibold">
                      Credit Usage History
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Complete record of your credit consumption
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {loadingCreditUsage ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-google-blue border-t-transparent" />
                    <span className="text-muted-foreground">
                      Loading credit usage...
                    </span>
                  </div>
                </div>
              ) : creditUsage.length === 0 ? (
                <div className="text-center py-8 bg-[#f8f9fa] rounded-lg">
                  <div className="p-4 rounded-full bg-[#e8f0fe] w-fit mx-auto mb-4">
                    <Activity className="h-8 w-8 text-google-blue" />
                  </div>
                  <p className="text-muted-foreground">No credit usage found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mobile-friendly card layout */}
                  <div className="block md:hidden space-y-3">
                    {creditUsage.slice(0, 20).map((usage) => (
                      <div
                        key={usage.id}
                        className="card-google bg-white p-4 border border-[#dadce0]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="outline"
                            className="font-mono text-google-red border-google-red/30 bg-[#fce8e6]/30"
                          >
                            -{usage.amount}
                          </Badge>
                          <span className="text-xs text-[#5f6368]">
                            {formatDateTime(usage.createdAt)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-[#5f6368]">
                            Plan: {usage.planName}
                          </p>

                          {usage.taskId ? (
                            <Button
                              variant="link"
                              className="h-auto p-0 text-sm text-google-blue hover:text-google-blue/80 font-medium"
                              onClick={() =>
                                router.push(
                                  `/tasks?taskId=${
                                    usage.taskId
                                  }&type=${usage?.type?.split("/").pop()}`
                                )
                              }
                            >
                              {usage.taskTitle}
                            </Button>
                          ) : (
                            <span className="text-sm text-[#5f6368]">
                              No associated task
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Table layout for larger screens */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#dadce0]">
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Date & Time
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Credits Used
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Plan
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Task
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {creditUsage.slice(0, 20).map((usage) => (
                          <tr
                            key={usage.id}
                            className="border-b border-[#dadce0] hover:bg-[#f8f9fa] transition-colors"
                          >
                            <td className="py-3 px-4 text-sm">
                              {formatDateTime(usage.createdAt)}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className="font-mono text-google-red border-google-red/30 bg-[#fce8e6]/30"
                              >
                                -{usage.amount}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-[#5f6368]">
                              {usage.planName}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {usage.taskId ? (
                                <Button
                                  variant="link"
                                  className="h-auto p-0 text-google-blue hover:text-google-blue/80 font-medium"
                                  onClick={() =>
                                    router.push(
                                      `/tasks?taskId=${
                                        usage.taskId
                                      }&type=${usage?.type?.split("/").pop()}`
                                    )
                                  }
                                >
                                  {usage.taskTitle}
                                </Button>
                              ) : (
                                <span className="text-[#5f6368]">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {creditUsage.length > 20 && (
                    <div className="mt-4 p-4 rounded-lg bg-[#f8f9fa] text-center border border-[#dadce0]">
                      <p className="text-sm text-[#5f6368]">
                        Showing most recent 20 entries of {creditUsage.length}{" "}
                        total records
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
