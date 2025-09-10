import { useEffect, useState, useMemo } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useUserCreditsQuery } from "@/hooks/useUserCreditsQuery";
import {
  useRecentTasks,
  useDashboardOverviewTasks,
} from "@/hooks/useTasksQueries";
import { useUser } from "@/contexts/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart2,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  FileText,
  Filter,
  Lightbulb,
  Loader,
  Plus,
  Search,
  Zap,
} from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { SubmitTaskForm } from "@/components/SubmitTaskForm";

import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { NoSubscriptionView } from "@/components/dashboard/NoSubscriptionView";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TasksEmptyState } from "@/components/tasks/TasksEmptyState";
import { DashboardHeader } from "@/components/DashboardHeader";

// Mock recent tasks data
const RECENT_TASKS = [
  {
    id: "task-1",
    url: "https://example.com/page-1",
    type: "indexer",
    status: "completed",
    date: "2025-07-20T14:30:00Z",
    result: "indexed",
  },
  {
    id: "task-2",
    url: "https://example.com/blog/article-1",
    type: "checker",
    status: "completed",
    date: "2025-07-19T10:15:00Z",
    result: "indexed",
  },
  {
    id: "task-3",
    url: "https://example.com/products/new-product",
    type: "indexer",
    status: "processing",
    date: "2025-07-24T09:45:00Z",
  },
  {
    id: "task-4",
    url: "https://example.com/contact",
    type: "checker",
    status: "completed",
    date: "2025-07-22T16:20:00Z",
    result: "indexed",
  },
];

// Credit Stats Card Skeleton Component
const CreditStatsCardSkeleton = () => (
  <Card className="border-0 rounded-xl shadow-sm bg-white overflow-hidden">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-2 w-full mb-2" />
      <Skeleton className="h-4 w-32" />
    </CardContent>
  </Card>
);

// Subscription Timeline Skeleton Component
const SubscriptionTimelineSkeleton = () => (
  <Card className="border-0 rounded-xl shadow-sm bg-white h-full">
    <CardHeader className="pb-2 pt-6">
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-64" />
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <Skeleton className="w-full h-px" />
          </div>
          <div className="relative flex justify-center">
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        <Skeleton className="h-9 w-full rounded-full" />
      </div>
    </CardContent>
  </Card>
);

// Recent Tasks Skeleton Component
const RecentTasksSkeleton = () => (
  <Card className="border-0 rounded-xl shadow-sm bg-white h-full">
    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
      <div>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-8 w-20" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa]"
          >
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-4 w-16 ml-2" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const UserDashboard = () => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const {
    subscription,
    creditUsage,
    totalCredits,
    subscriptionLoading,
    error,
    fetchSubscription,
    handleDataRefresh,
  } = useDashboardData();

  const { data: userCreditsData, isLoading: creditsLoading } =
    useUserCreditsQuery();
  const [selectedTab, setSelectedTab] = useState("overview");
  const router = useRouter();

  // Get user ID from context
  const { user } = useUser();
  const userId = user?.id;

  // Dashboard/Recent tasks state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [limitRecent, setLimitRecent] = useState("4");

  // React Query hooks for tasks
  const { data: overviewTasks = [], refetch: refetchOverviewTasks } =
    useDashboardOverviewTasks(userId);

  // Recent tasks filters - memoized to prevent unnecessary re-renders
  const recentTasksFilters = useMemo(
    () => ({
      search,
      type: filterType,
      startDate: filterStartDate,
      endDate: filterEndDate,
      limit: limitRecent,
    }),
    [search, filterType, filterStartDate, filterEndDate, limitRecent]
  );

  const {
    data: recentTasks = [],
    isLoading: recentLoading,
    error: recentError,
    refetch: refetchRecentTasks,
  } = useRecentTasks(userId, recentTasksFilters);
  const isOutOfCredits =
    userCreditsData && (userCreditsData.creditsAvailable || 0) <= 0;

  // Debug logging
  console.log("📊 UserDashboard - Recent tasks data:", {
    recentTasks: recentTasks.length,
    recentLoading,
    recentError,
    filters: recentTasksFilters,
  });

  console.log("📊 UserDashboard - Overview tasks data:", {
    overviewTasks: overviewTasks.length,
    userId,
  });

  useEffect(() => {
    if (selectedTab === "tasks") {
      setLimitRecent("6");
    } else {
      setLimitRecent("4");
    }
  }, [selectedTab]);

  // Debug effect to log when data changes
  useEffect(() => {
    console.log("🔄 Recent tasks data changed:", recentTasks.length);
  }, [recentTasks]);

  useEffect(() => {
    console.log("🔄 Overview tasks data changed:", overviewTasks.length);
  }, [overviewTasks]);

  // Calculate usage percentages (computed after totals are declared)
  // Placeholder; actual calculation moved below after totals
  let usagePercentage = 0;
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "N/A";
    }
  };

  // Helper function to get task status and completion state
  const getTaskStatus = (task: any) => {
    // For VIP tasks, use the status field directly
    if (task.vipQueue) {
      return {
        isCompleted: task.status === "completed",
        statusText: task.status === "completed" ? "Completed" : "Processing",
        statusClass:
          task.status === "completed"
            ? "bg-[#e6f4ea] text-[#137333] border-0"
            : "bg-[#e8f0fe] text-[#1a73e8] border-0",
        isVip: true,
      };
    }

    // For non-VIP tasks, use computedStatus
    return {
      isCompleted: task.is_completed,
      statusText: task.is_completed ? "Completed" : "Processing",
      statusClass: task.is_completed
        ? "bg-[#e6f4ea] text-[#137333] border-0"
        : "bg-[#e8f0fe] text-[#1a73e8] border-0",
      isVip: false,
    };
  };

  // If subscription is loading, show DashboardHeader with loading indicator below
  if (subscriptionLoading) {
    return <DashboardLoading />;
  }

  // Error state
  if (error) {
    return (
      <DashboardError
        error={error}
        subscription={subscription}
        monthlyUsage={creditUsage.total_used}
        onRetry={() => {
          fetchSubscription();
        }}
        onSubscriptionUpdate={fetchSubscription}
      />
    );
  }

  // No subscription state
  if (!subscription) {
    return (
      <NoSubscriptionView
        monthlyUsage={creditUsage.total_used}
        onSubscriptionUpdate={fetchSubscription}
      />
    );
  }

  // Calculate available credits from the API response
  const availableCredits = userCreditsData?.creditsAvailable || 0;
  const totalAvailableCredits = totalCredits?.total_credits || 0; // base plan credits
  const heldCredits = userCreditsData?.heldCredits || 0;
  const usedCreditsThisMonth =
    userCreditsData?.usedCredits || creditUsage.total_used || 0;
  const bonusCredits =
    totalCredits?.extra_credits || userCreditsData?.bonusCredits || 0;
  const carriedForwardCredits = userCreditsData?.carriedForwardCredits || 0;
  const totalWithExtras =
    totalAvailableCredits + bonusCredits + carriedForwardCredits;
  usagePercentage = totalWithExtras
    ? Math.min(
        100,
        Math.round(
          ((userCreditsData?.usedCredits || 0) / totalWithExtras) * 100
        )
      )
    : 0;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <DashboardHeader
        subscription={subscription}
        monthlyUsage={creditUsage.total_used}
        userCreditsData={userCreditsData}
      />
      <div className="container mx-auto py-8 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-normal text-[#202124] mb-2">
                Dashboard
              </h1>
              <p className="text-[16px] text-[#5f6368] max-w-2xl">
                Here's what's happening with your indexing tasks today
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/reports")}
                className="rounded-full border-[#dadce0] hover:bg-[#f1f3f4] text-[14px]"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Reports
              </Button>
              <Button
                onClick={() => setShowCreateTask(true)}
                className="bg-[#4285f4] hover:bg-[#3b78e7] text-white rounded-full h-10 px-6 font-medium text-[14px] flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs
          defaultValue="overview"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-6"
        >
          <TabsList className="h-10 p-1 bg-[#f1f3f4] rounded-full inline-flex">
            <TabsTrigger
              value="overview"
              className="rounded-full px-5 py-1.5 text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#4285f4] data-[state=active]:shadow-sm transition-all"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="rounded-full px-5 py-1.5 text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#4285f4] data-[state=active]:shadow-sm transition-all"
            >
              Recent Tasks
            </TabsTrigger>
            <TabsTrigger
              value="new-task"
              className="rounded-full px-5 py-1.5 text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#4285f4] data-[state=active]:shadow-sm transition-all"
            >
              New Task
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Credits Usage Card */}
              {creditsLoading ? (
                <CreditStatsCardSkeleton />
              ) : (
                <Card className="border-0 rounded-xl shadow-sm bg-white overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium text-[#5f6368]">
                        Available Credits
                      </CardTitle>
                      <div className="h-8 w-8 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                        <Zap className="h-4 w-4 text-[#4285f4]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-medium text-[#202124]">
                      {availableCredits}
                      <span className="text-sm font-normal text-[#5f6368] ml-1">
                        / {totalWithExtras}
                      </span>
                    </div>
                    {bonusCredits > 0 || carriedForwardCredits > 0 ? (
                      <p className="text-xs text-[#5f6368] mt-1">
                        {totalAvailableCredits} plan
                        {carriedForwardCredits > 0
                          ? ` + ${carriedForwardCredits} carry`
                          : ""}
                        {bonusCredits > 0 ? ` + ${bonusCredits} bonus` : ""}
                      </p>
                    ) : null}
                    <Progress
                      value={usagePercentage}
                      className="h-2 mt-2 bg-[#e8f0fe]"
                    />
                    <p className="text-xs text-[#5f6368] mt-2">
                      {usagePercentage}% used this billing cycle
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Current Plan Card */}
              {subscriptionLoading || creditsLoading ? (
                <CreditStatsCardSkeleton />
              ) : (
                <Card className="border-0 rounded-xl shadow-sm bg-white overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium text-[#5f6368]">
                        Current Plan
                      </CardTitle>
                      <div className="h-8 w-8 rounded-full bg-[#e6f4ea] flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-[#34a853]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-medium text-[#202124]">
                      {subscription?.subscription_plans?.name ||
                        userCreditsData?.planName ||
                        "Free Plan"}
                    </div>
                    <p className="text-xs text-[#5f6368] mt-2">
                      Renews on{" "}
                      {formatDate(
                        subscription?.current_period_end ||
                          userCreditsData?.planEnd ||
                          ""
                      )}
                    </p>
                    <Button
                      variant="link"
                      className="px-0 h-auto mt-2 text-[#4285f4]"
                      onClick={() => router.push("/plans-billing")}
                    >
                      Manage Subscription
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Held Credits Card */}
              {creditsLoading ? (
                <CreditStatsCardSkeleton />
              ) : (
                <Card className="border-0 rounded-xl shadow-sm bg-white overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium text-[#5f6368]">
                        Credits On Hold
                      </CardTitle>
                      <div className="h-8 w-8 rounded-full bg-[#fef7e0] flex items-center justify-center">
                        <Clock className="h-4 w-4 text-[#fbbc04]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-medium text-[#202124]">
                      {heldCredits}
                    </div>
                    <p className="text-xs text-[#5f6368] mt-2">
                      Credits reserved for pending tasks
                    </p>
                    <Button
                      variant="link"
                      className="px-0 h-auto mt-2 text-[#4285f4]"
                      onClick={() => router.push("/tasks?status=pending")}
                    >
                      View Pending Tasks
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Used Credits Card */}
              {creditsLoading ? (
                <CreditStatsCardSkeleton />
              ) : (
                <Card className="border-0 rounded-xl shadow-sm bg-white overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium text-[#5f6368]">
                        Used This Month
                      </CardTitle>
                      <div className="h-8 w-8 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                        <Activity className="h-4 w-4 text-[#4285f4]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-medium text-[#202124]">
                      {usedCreditsThisMonth}
                    </div>
                    <p className="text-xs text-[#5f6368] mt-2">
                      Credits consumed since{" "}
                      {formatDate(
                        subscription?.current_period_start ||
                          userCreditsData?.planStart ||
                          ""
                      )}
                    </p>
                    <Button
                      variant="link"
                      className="px-0 h-auto mt-2 text-[#4285f4]"
                      onClick={() => router.push("/reports")}
                    >
                      View Usage Reports
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Tasks and Subscription Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Tasks */}
              <div className="lg:col-span-2">
                {creditsLoading ? (
                  <RecentTasksSkeleton />
                ) : (
                  <Card className="border-0 rounded-xl shadow-sm bg-white h-full">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
                      <div>
                        <CardTitle className="text-[20px] text-[#202124]">
                          Recent Tasks
                        </CardTitle>
                        <CardDescription className="text-[#5f6368]">
                          Your latest indexing and checking activities
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-[#4285f4]"
                        onClick={() => router.push("/tasks")}
                      >
                        View All
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentLoading ? (
                          <RecentTasksSkeleton />
                        ) : !recentTasks || recentTasks.length === 0 ? (
                          <TasksEmptyState
                            totalTasks={recentTasks?.length || 0}
                            filteredCount={recentTasks?.length || 0}
                            onClearFilters={() => {}}
                            onCreateTaskClick={() => setShowCreateTask(true)}
                          />
                        ) : (
                          recentTasks.map((task) => {
                            const taskStatus = getTaskStatus(task);

                            return (
                              <div
                                key={task.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
                                onClick={() =>
                                  router.push(
                                    `/tasks?taskId=${task.id}&type=${task?.type
                                      ?.split("/")
                                      .pop()}`
                                  )
                                }
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`
                              h-8 w-8 rounded-full flex items-center justify-center
                              ${
                                taskStatus.isCompleted
                                  ? "bg-[#e6f4ea] text-[#34a853]"
                                  : "bg-[#e8f0fe] text-[#4285f4]"
                              }
                            `}
                                  >
                                    {taskStatus.isCompleted ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <Loader className="h-4 w-4 animate-spin" />
                                    )}
                                  </div>

                                  <div>
                                    <div className="flex items-center">
                                      <p className="text-sm font-medium truncate max-w-[200px] md:max-w-[300px] text-[#202124] hover:text-[#4285f4] transition-colors">
                                        {task.title}
                                      </p>
                                      <Badge
                                        variant="outline"
                                        className="ml-2 text-xs border-[#dadce0]"
                                      >
                                        {task.type.includes("indexer") ||
                                        task.type.includes("google/indexer")
                                          ? "Indexer"
                                          : "Checker"}
                                      </Badge>
                                      {/* VIP badge removed */}
                                    </div>
                                    <p className="text-xs text-[#5f6368]">
                                      {formatDistanceToNow(
                                        new Date(task.created_at)
                                      )}{" "}
                                      ago
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Badge className={taskStatus.statusClass}>
                                    {taskStatus.statusText}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Subscription Timeline */}
              <div className="lg:col-span-1">
                {subscriptionLoading || creditsLoading ? (
                  <SubscriptionTimelineSkeleton />
                ) : (
                  <Card className="border-0 rounded-xl shadow-sm bg-white h-full">
                    <CardHeader className="pb-2 pt-6">
                      <CardTitle className="text-[20px] text-[#202124]">
                        Subscription Timeline
                      </CardTitle>
                      <CardDescription className="text-[#5f6368]">
                        Your billing cycle information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-[#4285f4]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#202124]">
                                  Current Period
                                </p>
                                <p className="text-xs text-[#5f6368]">
                                  {formatDate(
                                    subscription?.current_period_start ||
                                      userCreditsData?.planStart ||
                                      ""
                                  )}{" "}
                                  -{" "}
                                  {formatDate(
                                    subscription?.current_period_end ||
                                      userCreditsData?.planEnd ||
                                      ""
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[#dadce0]" />
                          </div>
                          <div className="relative flex justify-center text-xs text-[#5f6368]">
                            <span className="bg-white px-2">PLAN DETAILS</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-[#5f6368]">Plan Name</p>
                            <p className="text-sm font-medium text-[#202124]">
                              {subscription?.subscription_plans?.name ||
                                userCreditsData?.planName ||
                                "Free Plan"}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-[#5f6368]">
                              Monthly Credits
                            </p>
                            <p className="text-sm font-medium text-[#202124]">
                              {subscription?.subscription_plans
                                ?.monthly_credits ||
                                totalCredits?.total_credits ||
                                0}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-[#5f6368]">
                              Carry Forward Credits
                            </p>
                            <p className="text-sm font-medium text-[#202124]">
                              {carriedForwardCredits}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-[#5f6368]">
                              Bonus Credits
                            </p>
                            <p className="text-sm font-medium text-[#202124]">
                              {bonusCredits}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-[#5f6368]">
                              Auto-Renewal
                            </p>
                            <Badge
                              variant="outline"
                              className={`
                                  ${
                                    userCreditsData?.isFreePlan ||
                                    userCreditsData?.planName?.toLowerCase() ===
                                      "free"
                                      ? "bg-[#fef7e0] text-[#ea8600]"
                                      : "bg-[#e6f4ea] text-[#137333]"
                                  } 
                                  border-0`}
                            >
                              {userCreditsData?.isFreePlan ||
                              userCreditsData?.planName?.toLowerCase() ===
                                "free"
                                ? "Inactive"
                                : "Active"}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full border-[#dadce0] rounded-full text-[14px]"
                          onClick={() => router.push("/plans-billing")}
                        >
                          Manage Subscription
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Tips and Resources */}
            <div>
              <Card className="border-0 rounded-xl shadow-sm bg-gradient-to-r from-[#e8f0fe] to-[#edf7ee]">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#d2e3fc] flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-[#4285f4]" />
                    </div>
                    <div>
                      <CardTitle className="text-[20px] text-[#202124]">
                        Pro Tips for Better Indexing
                      </CardTitle>
                      <CardDescription className="text-[#5f6368]">
                        Maximize your success with these best practices
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="p-4 bg-white/80 rounded-lg">
                      <h4 className="font-medium text-sm mb-2 text-[#4285f4]">
                        Optimize Your URLs
                      </h4>
                      <p className="text-sm text-[#5f6368]">
                        Choose important pages and make sure they're accessible
                        to search engines with proper internal linking.
                      </p>
                    </div>
                    <div className="p-4 bg-white/80 rounded-lg">
                      <h4 className="font-medium text-sm mb-2 text-[#34a853]">
                        Use Both Tools
                      </h4>
                      <p className="text-sm text-[#5f6368]">
                        First index your URLs and then use the checker to verify
                        they've been properly indexed by Google.
                      </p>
                    </div>
                    <div className="p-4 bg-white/80 rounded-lg">
                      <h4 className="font-medium text-sm mb-2 text-[#9334e6]">
                        Monitor Regularly
                      </h4>
                      <p className="text-sm text-[#5f6368]">
                        Check your indexing status weekly and review reports to
                        identify patterns and issues.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="link"
                      className="h-8 text-[#4285f4]"
                      onClick={() => router.push("/help-center")}
                    >
                      Visit Help Center
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recent Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6 mt-6">
            <Card className="border-0 rounded-xl shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[20px] text-[#202124]">
                    All Recent Tasks
                  </CardTitle>
                  <CardDescription className="text-[#5f6368]">
                    View and manage your recent indexing activities
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Extended task list - could include more tasks or pagination */}
                  {recentLoading ? (
                    <RecentTasksSkeleton />
                  ) : recentError ? (
                    <p className="text-center text-sm text-[#5f6368]">
                      Failed to load recent tasks
                    </p>
                  ) : recentTasks.length === 0 ? (
                    <TasksEmptyState
                      totalTasks={recentTasks.length}
                      filteredCount={recentTasks.length}
                      onClearFilters={() => {}}
                      onCreateTaskClick={() => setShowCreateTask(true)}
                    />
                  ) : (
                    recentTasks.map((task, index) => {
                      const taskStatus = getTaskStatus(task);
                      return (
                        <div
                          key={`${task.id}-${index}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/tasks?taskId=${task.id}&type=${task?.type
                                ?.split("/")
                                .pop()}`
                            )
                          }
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`
                              h-8 w-8 rounded-full flex items-center justify-center
                              ${
                                taskStatus.isCompleted
                                  ? "bg-[#e6f4ea] text-[#34a853]"
                                  : "bg-[#e8f0fe] text-[#4285f4]"
                              }
                        `}
                            >
                              {taskStatus.isCompleted ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Loader className="h-4 w-4 animate-spin" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <p className="text-sm font-medium truncate max-w-[200px] md:max-w-[300px] lg:max-w-[500px] text-[#202124] hover:text-[#4285f4] transition-colors">
                                  {task.title}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs border-[#dadce0]"
                                >
                                  {task.type.includes("indexer") ||
                                  task.type.includes("google/indexer")
                                    ? "Indexer"
                                    : "Checker"}
                                </Badge>
                                {/* VIP badge removed */}
                              </div>
                              <p className="text-xs text-[#5f6368]">
                                {formatDistanceToNow(new Date(task.created_at))}{" "}
                                ago
                              </p>
                            </div>
                          </div>
                          <div>
                            <Badge className={taskStatus.statusClass}>
                              {taskStatus.statusText}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                {recentTasks.length > 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/tasks")}
                    className="border-[#dadce0] rounded-full text-[14px]"
                  >
                    View All Tasks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  ""
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          {/* New Task Tab */}
          <TabsContent value="new-task" className="space-y-6 mt-6">
            <Card className="border-0 rounded-xl shadow-sm bg-white">
              <CardHeader className="border-b bg-gradient-to-r from-[#e8f0fe] via-[#e6f4ea] to-[#f4effc] border-[#dadce0]">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#d2e3fc]">
                    <Lightbulb className="h-6 w-6 text-[#4285f4]" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-[20px] font-medium text-[#202124]">
                      Submit New Task
                    </CardTitle>
                    <CardDescription className="text-[#5f6368] font-medium">
                      Create and submit indexing or checking tasks for your URLs
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Queue Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#f8f9fa] rounded-lg border border-[#dadce0]">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-[#e8f0fe]">
                      <Clock className="h-5 w-5 text-[#4285f4]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#4285f4]">
                        Standard Queue
                      </h4>
                      <p className="text-sm text-[#5f6368]">
                        Crawler will take up to <strong>24 hours</strong> to
                        visit your link
                      </p>
                    </div>
                  </div>
                </div>

                <SubmitTaskForm
                  onTaskSubmitted={() => {
                    handleDataRefresh();
                    // Force refetch recent tasks
                    refetchRecentTasks();
                    refetchOverviewTasks();
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-0">
          <DialogHeader className="p-6 border-b border-[#dadce0]">
            <DialogTitle className="text-[22px] font-normal text-[#202124] ">
              {isOutOfCredits ? "Credit Limit Reached" : "Create a new task"}{" "}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            <SubmitTaskForm
              onTaskSubmitted={() => {
                setShowCreateTask(false);
                handleDataRefresh();
                // Force refetch recent tasks
                refetchRecentTasks();
                refetchOverviewTasks();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
