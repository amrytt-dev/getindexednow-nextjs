import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import { toast } from "@/hooks/use-toast";
import {
  CreditCard,
  Calendar,
  TrendingUp,
  Activity,
  ExternalLink,
  Receipt,
  ChevronRight,
  Pencil,
  ChevronLeft,
  Download,
} from "lucide-react";
import { getWithAuth } from "@/utils/fetchWithAuth";

interface CurrentPlan {
  planName: string;
  creditsAvailable: number;
  totalCredits: number;
  usedCredits: number;
  planStart: string | Date;
  planEnd: string | Date;
  isFreePlan: boolean;
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
  type: string;
}

export const UserSettingPlans = () => {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);
  const [creditUsage, setCreditUsage] = useState<CreditUsage[]>([]);
  const [loadingCurrentPlan, setLoadingCurrentPlan] = useState(true);
  const [loadingCreditUsage, setLoadingCreditUsage] = useState(true);
  const [activeSection, setActiveSection] = useState("current-plan");

  // Pagination state for credit usage
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Invoice state and pagination
  const [invoiceCurrentPage, setInvoiceCurrentPage] = useState(1);
  const [invoicePageSize] = useState(5);
  const [invoiceTotalPages, setInvoiceTotalPages] = useState(1);
  const [invoiceTotalCount, setInvoiceTotalCount] = useState(0);
  const [isInvoicePageLoading, setIsInvoicePageLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Invoice hooks
  const {
    invoices,
    loading: invoiceLoading,
    error: invoiceError,
    downloadInvoice,
  } = useInvoices();

  useEffect(() => {
    fetchCurrentPlan();
    fetchCreditUsage();
  }, []);

  // Calculate invoice pagination when invoices change
  useEffect(() => {
    if (invoices) {
      setInvoiceTotalCount(invoices.length);
      setInvoiceTotalPages(Math.ceil(invoices.length / invoicePageSize));
    }
  }, [invoices, invoicePageSize]);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(
        "#current-plan, #usage-history, #billing-invoices"
      );
      let currentSection = "current-plan";

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

  const fetchCurrentPlan = async () => {
    try {
      setLoadingCurrentPlan(true);
      const data = await getWithAuth<CurrentPlan>("/user/credits");
      setCurrentPlan(data);
    } catch (error) {
      console.error("Error fetching current plan:", error);
    } finally {
      setLoadingCurrentPlan(false);
    }
  };

  const fetchCreditUsage = async (page: number = 1) => {
    try {
      setLoadingCreditUsage(true);
      const data = await getWithAuth<{ usage: CreditUsage[]; pagination: any }>(
        `/user/credits/usage?page=${page}&pageSize=${pageSize}`
      );
      setCreditUsage(data.usage || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
        setCurrentPage(data.pagination.currentPage);
      }
    } catch (error) {
      console.error("Error fetching credit usage:", error);
      setCreditUsage([]); // Set empty array on error
    } finally {
      setLoadingCreditUsage(false);
    }
  };

  const fetchCreditUsagePage = async (page: number = 1) => {
    try {
      setIsPageLoading(true);
      const data = await getWithAuth<{ usage: CreditUsage[]; pagination: any }>(
        `/user/credits/usage?page=${page}&pageSize=${pageSize}`
      );
      setCreditUsage(data.usage || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
        setCurrentPage(data.pagination.currentPage);
      }
    } catch (error) {
      console.error("Error fetching credit usage:", error);
      setCreditUsage([]); // Set empty array on error
    } finally {
      setIsPageLoading(false);
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

  const getCurrentPeriodUsage = () => {
    if (!currentPlan || !creditUsage.length) return [];

    const periodStart = new Date(currentPlan.planStart);
    const periodEnd = new Date(currentPlan.planEnd);

    return creditUsage.filter((usage) => {
      const usageDate = new Date(usage.createdAt);
      return usageDate >= periodStart && usageDate <= periodEnd;
    });
  };

  const getUsagePercentage = () => {
    if (
      !currentPlan ||
      typeof currentPlan.totalCredits !== "number" ||
      typeof currentPlan.usedCredits !== "number"
    )
      return 0;
    return Math.round(
      (currentPlan.usedCredits / currentPlan.totalCredits) * 100
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCreditUsagePage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Invoice helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100); // Convert cents to dollars
  };

  const getMonthName = (month: number) => {
    const date = new Date(2024, month - 1, 1);
    return date.toLocaleDateString("en-US", { month: "long" });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "generated":
        return "default";
      case "sent":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleInvoiceDownload = async (invoiceId: string) => {
    try {
      setDownloading(invoiceId);
      const success = await downloadInvoice(invoiceId);
      if (success) {
        toast({
          title: "Success",
          description: "Invoice downloaded successfully!",
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to download invoice",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  // Calculate pagination for invoices
  const getPaginatedInvoices = () => {
    const startIndex = (invoiceCurrentPage - 1) * invoicePageSize;
    const endIndex = startIndex + invoicePageSize;
    return invoices.slice(startIndex, endIndex);
  };

  const handleInvoicePageChange = (page: number) => {
    setInvoiceCurrentPage(page);
  };

  const handleInvoicePrevious = () => {
    if (invoiceCurrentPage > 1) {
      handleInvoicePageChange(invoiceCurrentPage - 1);
    }
  };

  const handleInvoiceNext = () => {
    if (invoiceCurrentPage < invoiceTotalPages) {
      handleInvoicePageChange(invoiceCurrentPage + 1);
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

  // Google's color classes based on the theme
  const googleColors = {
    blue: "bg-google-blue text-white",
    red: "bg-google-red text-white",
    yellow: "bg-google-yellow text-foreground",
    green: "bg-google-green text-white",
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden mb-6">
        <div className="flex bg-[#f1f3f4] rounded-lg p-1">
          <Button
            variant={activeSection === "current-plan" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 ${
              activeSection === "current-plan"
                ? "bg-white text-[#4285f4] shadow-sm"
                : "text-[#5f6368]"
            }`}
            onClick={() => scrollToSection("current-plan")}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Current Plan
          </Button>
          <Button
            variant={activeSection === "usage-history" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 ${
              activeSection === "usage-history"
                ? "bg-white text-[#4285f4] shadow-sm"
                : "text-[#5f6368]"
            }`}
            onClick={() => scrollToSection("usage-history")}
          >
            <Activity className="h-4 w-4 mr-2" />
            Usage
          </Button>
          <Button
            variant={activeSection === "billing-invoices" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 ${
              activeSection === "billing-invoices"
                ? "bg-white text-[#4285f4] shadow-sm"
                : "text-[#5f6368]"
            }`}
            onClick={() => scrollToSection("billing-invoices")}
          >
            <Receipt className="h-4 w-4 mr-2" />
            Billing
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
                  Plan Management
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your subscription and billing
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={
                    activeSection === "current-plan" ? "default" : "ghost"
                  }
                  className={`w-full justify-start gap-3 h-12 text-left transition-all duration-300 ease-in-out relative ${
                    activeSection === "current-plan"
                      ? "bg-[#4285f4] text-white shadow-md scale-105 border border-[#4285f4]"
                      : "hover:bg-[#f8f9fa] hover:scale-102 hover:border hover:border-[#dadce0]"
                  }`}
                  onClick={() => scrollToSection("current-plan")}
                >
                  <CreditCard
                    className={`h-4 w-4 transition-transform duration-300 ${
                      activeSection === "current-plan"
                        ? "text-white scale-110"
                        : ""
                    }`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Current Plan</span>
                    <span
                      className={`text-xs transition-colors duration-300 ${
                        activeSection === "current-plan"
                          ? "text-white/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      View your plan details
                    </span>
                  </div>
                </Button>

                <Button
                  variant={
                    activeSection === "usage-history" ? "default" : "ghost"
                  }
                  className={`w-full justify-start gap-3 h-12 text-left transition-all duration-300 ease-in-out relative ${
                    activeSection === "usage-history"
                      ? "bg-[#4285f4] text-white shadow-md scale-105 border border-[#4285f4]"
                      : "hover:bg-[#f8f9fa] hover:scale-102 hover:border hover:border-[#dadce0]"
                  }`}
                  onClick={() => scrollToSection("usage-history")}
                >
                  <Activity
                    className={`h-4 w-4 transition-transform duration-300 ${
                      activeSection === "usage-history"
                        ? "text-white scale-110"
                        : ""
                    }`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Usage History</span>
                    <span
                      className={`text-xs transition-colors duration-300 ${
                        activeSection === "usage-history"
                          ? "text-white/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      Track credit usage
                    </span>
                  </div>
                </Button>

                <Button
                  variant={
                    activeSection === "billing-invoices" ? "default" : "ghost"
                  }
                  className={`w-full justify-start gap-3 h-12 text-left transition-all duration-300 ease-in-out relative ${
                    activeSection === "billing-invoices"
                      ? "bg-[#4285f4] text-white shadow-md scale-105 border border-[#4285f4]"
                      : "hover:bg-[#f8f9fa] hover:scale-102 hover:border hover:border-[#dadce0]"
                  }`}
                  onClick={() => scrollToSection("billing-invoices")}
                >
                  <Receipt
                    className={`h-4 w-4 transition-transform duration-300 ${
                      activeSection === "billing-invoices"
                        ? "text-white scale-110"
                        : ""
                    }`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Billing & Invoices</span>
                    <span
                      className={`text-xs transition-colors duration-300 ${
                        activeSection === "billing-invoices"
                          ? "text-white/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      Manage payments
                    </span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6 min-h-[1200px]">
          {/* Current Plan Status - Minimal & Rich Design */}
          <Card
            id="current-plan"
            className="shadow-none border overflow-hidden scroll-mt-24"
          >
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-xl lg:text-2xl font-semibold">
                      Current Plan
                    </CardTitle>
                    {currentPlan && (
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(currentPlan.planStart.toString())} -{" "}
                          {formatDate(currentPlan.planEnd.toString())}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/plans-billing")}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                >
                  Manage Plan
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              {loadingCurrentPlan ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-google-blue border-t-transparent" />
                    <span className="text-sm text-muted-foreground">
                      Loading plan information...
                    </span>
                  </div>
                </div>
              ) : currentPlan ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50">
                  {/* Left side - Plan details */}
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {currentPlan.planName} Plan
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            currentPlan.isFreePlan ||
                            currentPlan.planName?.toLowerCase() === "free"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 "
                          }`}
                        >
                          {currentPlan.isFreePlan ||
                          currentPlan.planName?.toLowerCase() === "free"
                            ? "Free"
                            : "Premium"}
                        </Badge>
                        <span className="text-sm text-slate-600">
                          {getUsagePercentage()}% used
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Usage stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 rounded-md bg-blue-50">
                          <TrendingUp className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          TOTAL
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-900">
                        {typeof currentPlan.totalCredits === "number"
                          ? currentPlan.totalCredits.toLocaleString()
                          : "N/A"}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 rounded-md bg-green-50">
                          <Activity className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          AVAILABLE
                        </span>
                      </div>
                      <p className="text-lg font-bold text-green-600">
                        {typeof currentPlan.creditsAvailable === "number"
                          ? currentPlan.creditsAvailable.toLocaleString()
                          : "N/A"}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 rounded-md bg-red-50">
                          <TrendingUp className="h-3 w-3 text-red-600" />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          USED
                        </span>
                      </div>
                      <p className="text-lg font-bold text-red-600">
                        {typeof currentPlan.usedCredits === "number"
                          ? currentPlan.usedCredits.toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-3 rounded-full bg-slate-100 w-fit mx-auto mb-3">
                    <CreditCard className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">
                    Unable to load plan information
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Period Usage - Google Material Style */}
          <Card
            id="usage-history"
            className="shadow-none border overflow-hidden scroll-mt-24"
          >
            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-xl lg:text-2xl font-semibold">
                      Usage History
                    </CardTitle>
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
                      Loading usage data...
                    </span>
                  </div>
                </div>
              ) : getCurrentPeriodUsage().length === 0 ? (
                <div className="text-center py-8 bg-[#f8f9fa] rounded-lg">
                  <div className="p-4 rounded-full bg-[#e8f0fe] w-fit mx-auto mb-4">
                    <Activity className="h-8 w-8 text-google-blue" />
                  </div>
                  <p className="text-muted-foreground">
                    No credit usage in current period
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#dadce0]">
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Credits
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm hidden sm:table-cell">
                            Plan
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Task
                          </th>
                        </tr>
                      </thead>
                      <tbody className={isPageLoading ? "opacity-50" : ""}>
                        {getCurrentPeriodUsage().map((usage) => (
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
                            <td className="py-3 px-4 text-sm text-[#5f6368] hidden sm:table-cell">
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

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-[#5f6368] flex items-center gap-2">
                        <span>
                          Showing {(currentPage - 1) * pageSize + 1} to{" "}
                          {Math.min(currentPage * pageSize, totalCount)} of{" "}
                          {totalCount} usage records
                        </span>
                        {isPageLoading && (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-google-blue border-t-transparent" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevious}
                          disabled={currentPage === 1 || isPageLoading}
                          className="h-8 px-3"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>

                        {/* Page numbers */}
                        <div className="flex items-center space-x-1">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    currentPage === pageNum
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(pageNum)}
                                  disabled={isPageLoading}
                                  className="h-8 w-8 p-0"
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNext}
                          disabled={currentPage === totalPages || isPageLoading}
                          className="h-8 px-3"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Invoice Section - Google Material Style */}
          <Card
            id="billing-invoices"
            className="shadow-none border overflow-hidden scroll-mt-24"
          >
            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-xl lg:text-2xl font-semibold">
                      Billing & Invoices
                    </CardTitle>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {invoiceLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-google-blue border-t-transparent" />
                    <span className="text-muted-foreground">
                      Loading invoices...
                    </span>
                  </div>
                </div>
              ) : invoiceError ? (
                <div className="text-center py-8 bg-[#f8f9fa] rounded-lg">
                  <div className="p-4 rounded-full bg-[#fce8e6] w-fit mx-auto mb-4">
                    <Receipt className="h-8 w-8 text-google-red" />
                  </div>
                  <p className="text-muted-foreground">{invoiceError}</p>
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-8 bg-[#f8f9fa] rounded-lg">
                  <div className="p-4 rounded-full bg-[#e8f0fe] w-fit mx-auto mb-4">
                    <Receipt className="h-8 w-8 text-google-blue" />
                  </div>
                  <p className="text-muted-foreground">
                    No invoices generated yet. Invoices are automatically
                    generated for your plan subscriptions when they end.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#dadce0]">
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Period
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Amount
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Credits
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Generated
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-[#5f6368] text-sm">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        className={isInvoicePageLoading ? "opacity-50" : ""}
                      >
                        {getPaginatedInvoices().map((invoice) => (
                          <tr
                            key={invoice.id}
                            className="border-b border-[#dadce0] hover:bg-[#f8f9fa] transition-colors"
                          >
                            <td className="py-3 px-4 text-sm">
                              <div className="font-medium">
                                {getMonthName(invoice.month)} {invoice.year}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={getStatusBadgeVariant(invoice.status)}
                              >
                                {invoice.status.charAt(0).toUpperCase() +
                                  invoice.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm font-medium">
                              {formatCurrency(invoice.totalAmount)}
                            </td>
                            <td className="py-3 px-4 text-sm text-[#5f6368]">
                              {invoice.totalCredits} credits
                            </td>
                            <td className="py-3 px-4 text-sm text-[#5f6368]">
                              {invoice.generatedAt
                                ? formatDate(invoice.generatedAt)
                                : "N/A"}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleInvoiceDownload(invoice.id)
                                }
                                disabled={downloading === invoice.id}
                                className="h-8 px-3"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                {downloading === invoice.id
                                  ? "Downloading..."
                                  : "Download"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Invoice Pagination Controls */}
                  {invoiceTotalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-[#5f6368] flex items-center gap-2">
                        <span>
                          Showing{" "}
                          {(invoiceCurrentPage - 1) * invoicePageSize + 1} to{" "}
                          {Math.min(
                            invoiceCurrentPage * invoicePageSize,
                            invoiceTotalCount
                          )}{" "}
                          of {invoiceTotalCount} invoices
                        </span>
                        {isInvoicePageLoading && (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-google-blue border-t-transparent" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleInvoicePrevious}
                          disabled={
                            invoiceCurrentPage === 1 || isInvoicePageLoading
                          }
                          className="h-8 px-3"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>

                        {/* Page numbers */}
                        <div className="flex items-center space-x-1">
                          {Array.from(
                            { length: Math.min(5, invoiceTotalPages) },
                            (_, i) => {
                              let pageNum;
                              if (invoiceTotalPages <= 5) {
                                pageNum = i + 1;
                              } else if (invoiceCurrentPage <= 3) {
                                pageNum = i + 1;
                              } else if (
                                invoiceCurrentPage >=
                                invoiceTotalPages - 2
                              ) {
                                pageNum = invoiceTotalPages - 4 + i;
                              } else {
                                pageNum = invoiceCurrentPage - 2 + i;
                              }

                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    invoiceCurrentPage === pageNum
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    handleInvoicePageChange(pageNum)
                                  }
                                  disabled={isInvoicePageLoading}
                                  className="h-8 w-8 p-0"
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleInvoiceNext}
                          disabled={
                            invoiceCurrentPage === invoiceTotalPages ||
                            isInvoicePageLoading
                          }
                          className="h-8 px-3"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default UserSettingPlans;
