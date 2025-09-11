import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Filter,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PaymentHistoryChart } from "./PaymentHistoryChart";
import { useQuery } from "@tanstack/react-query";
import { getWithAuth } from "@/utils/fetchWithAuth";

interface DashboardStats {
  totalUsers: number;
  totalSubscribedUsers: number;
  totalRevenue: number;
  paymentHistory: Array<{
    date: string;
    amount: number;
    transactions: number;
  }>;
}

interface FilterOption {
  value: string;
  label: string;
}

const filterOptions: FilterOption[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Date Range" },
];

// Inner filter options (without custom date range)
const innerFilterOptions: FilterOption[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
];

export const AdminDashboard = () => {
  const [globalFilter, setGlobalFilter] = useState<string>("month");
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

  // Individual widget filters (only fixed options, no custom)
  const [totalUsersFilter, setTotalUsersFilter] = useState<string>("month");
  const [subscribedUsersFilter, setSubscribedUsersFilter] =
    useState<string>("month");
  const [totalRevenueFilter, setTotalRevenueFilter] = useState<string>("month");
  const [conversionRateFilter, setConversionRateFilter] =
    useState<string>("month");

  // Helper function to build query parameters
  const buildQueryParams = (
    filter: string,
    dateRange: { from: Date | undefined; to: Date | undefined }
  ) => {
    const params = new URLSearchParams();
    if (filter === "custom" && dateRange.from && dateRange.to) {
      params.append("startDate", dateRange.from.toISOString());
      params.append("endDate", dateRange.to.toISOString());
    } else if (filter !== "custom") {
      params.append("dateRange", filter);
    }
    return params;
  };

  // Helper function to combine global and local filters
  const getEffectiveFilter = (localFilter: string) => {
    // If global filter is custom, use custom date range
    if (
      globalFilter === "custom" &&
      customDateRange.from &&
      customDateRange.to
    ) {
      return "custom";
    }
    // Always use local filter if it's set to something other than the default
    return localFilter;
  };

  const getEffectiveDateRange = (localFilter: string) => {
    // If global filter is custom, use global custom date range
    if (
      globalFilter === "custom" &&
      customDateRange.from &&
      customDateRange.to
    ) {
      return customDateRange;
    }
    // For local filters, use empty date range (will use dateRange param)
    return { from: undefined, to: undefined };
  };

  // Fetch dashboard data for global filter
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-dashboard", globalFilter, customDateRange],
    queryFn: async (): Promise<DashboardStats> => {
      const params = buildQueryParams(globalFilter, customDateRange);
      const data = await getWithAuth(`/admin/dashboard?${params.toString()}`);

      return {
        totalUsers: data.result?.totalUsers || 0,
        totalSubscribedUsers: data.result?.totalSubscribedUsers || 0,
        totalRevenue: (data.result?.totalRevenue || 0) / 100,
        paymentHistory: (data.result?.paymentHistory || []).map(
          (item: any) => ({
            ...item,
            amount: item.amount / 100,
          })
        ),
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Individual widget queries with combined filter logic
  const { data: totalUsersData } = useQuery({
    queryKey: [
      "admin-total-users",
      totalUsersFilter,
      globalFilter,
      customDateRange,
    ],
    queryFn: async () => {
      const effectiveFilter = getEffectiveFilter(totalUsersFilter);
      const effectiveDateRange = getEffectiveDateRange(totalUsersFilter);
      const params = buildQueryParams(effectiveFilter, effectiveDateRange);

      try {
        const data = await getWithAuth(`/admin/dashboard?${params.toString()}`);
        return data.result?.totalUsers || 0;
      } catch (error) {
        return null;
      }
    },
    enabled: true, // Always enabled since we need to check both filters
  });

  const { data: subscribedUsersData } = useQuery({
    queryKey: [
      "admin-subscribed-users",
      subscribedUsersFilter,
      globalFilter,
      customDateRange,
    ],
    queryFn: async () => {
      const effectiveFilter = getEffectiveFilter(subscribedUsersFilter);
      const effectiveDateRange = getEffectiveDateRange(subscribedUsersFilter);
      const params = buildQueryParams(effectiveFilter, effectiveDateRange);

      try {
        const data = await getWithAuth(`/admin/dashboard?${params.toString()}`);
        return data.result?.totalSubscribedUsers || 0;
      } catch (error) {
        return null;
      }
    },
    enabled: true,
  });

  const { data: totalRevenueData }: any = useQuery({
    queryKey: [
      "admin-total-revenue",
      totalRevenueFilter,
      globalFilter,
      customDateRange,
    ],
    queryFn: async () => {
      const effectiveFilter = getEffectiveFilter(totalRevenueFilter);
      const effectiveDateRange = getEffectiveDateRange(totalRevenueFilter);
      const params = buildQueryParams(effectiveFilter, effectiveDateRange);

      try {
        const data = await getWithAuth(`/admin/dashboard?${params.toString()}`);
        return (data.result?.totalRevenue || 0) / 100;
      } catch (error) {
        return null;
      }
    },
    enabled: true,
  });

  const handleFilterChange = (value: string) => {
    setGlobalFilter(value);
    if (value !== "custom") {
      setCustomDateRange({ from: undefined, to: undefined });
    }
  };

  const handleCustomDateSelect = (
    date: Date | undefined,
    type: "from" | "to"
  ) => {
    setCustomDateRange((prev) => ({
      ...prev,
      [type]: date,
    }));
  };

  const applyCustomDateRange = () => {
    if (customDateRange.from && customDateRange.to) {
      setIsCustomDateOpen(false);
    }
  };

  // Individual widget filter handlers (only fixed options)
  const handleTotalUsersFilterChange = (value: string) => {
    setTotalUsersFilter(value);
  };

  const handleSubscribedUsersFilterChange = (value: string) => {
    setSubscribedUsersFilter(value);
  };

  const handleTotalRevenueFilterChange = (value: string) => {
    setTotalRevenueFilter(value);
  };

  const handleConversionRateFilterChange = (value: string) => {
    setConversionRateFilter(value);
  };

  // SpeedyIndex balance (always fetch fresh on load)
  const [speedyLoading, setSpeedyLoading] = useState<boolean>(false);
  const [speedyError, setSpeedyError] = useState<string | null>(null);
  const [speedyBalance, setSpeedyBalance] = useState<{
    indexer?: number;
    checker?: number;
  } | null>(null);
  useEffect(() => {
    const fetchSpeedy = async () => {
      try {
        setSpeedyLoading(true);
        setSpeedyError(null);
        setSpeedyBalance(null);
        const data = await getWithAuth("/proxy/speedyindex/account");
        const indexer =
          data?.balance?.indexer ?? data?.result?.balance?.indexer;
        const checker =
          data?.balance?.checker ?? data?.result?.balance?.checker;
        setSpeedyBalance({ indexer, checker });
      } catch (e: any) {
        setSpeedyError(e?.message || "Failed to load");
      } finally {
        setSpeedyLoading(false);
      }
    };
    fetchSpeedy();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-800 ">Failed to load dashboard data</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-2"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Global Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 ">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 ">
            Overview of your application's performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={globalFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {globalFilter === "custom" && (
            <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-48 justify-start text-left font-normal",
                    !customDateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateRange.from ? (
                    customDateRange.to ? (
                      <>
                        {format(customDateRange.from, "LLL dd, y")} -{" "}
                        {format(customDateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(customDateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={customDateRange.from}
                  selected={{
                    from: customDateRange.from,
                    to: customDateRange.to,
                  }}
                  onSelect={(range) => {
                    setCustomDateRange({
                      from: range?.from,
                      to: range?.to,
                    });
                  }}
                  numberOfMonths={2}
                />
                <div className="p-3 border-t">
                  <Button
                    onClick={applyCustomDateRange}
                    disabled={!customDateRange.from || !customDateRange.to}
                    className="w-full"
                  >
                    Apply Range
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </div>
            <Select
              value={totalUsersFilter}
              onValueChange={handleTotalUsersFilterChange}
            >
              <SelectTrigger className="w-32 h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {innerFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalUsersData !== undefined
                ? totalUsersData
                : dashboardData?.totalUsers || 0
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                Subscribed Users
              </CardTitle>
            </div>
            <Select
              value={subscribedUsersFilter}
              onValueChange={handleSubscribedUsersFilterChange}
            >
              <SelectTrigger className="w-32 h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {innerFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(subscribedUsersData !== undefined
                ? subscribedUsersData
                : dashboardData?.totalSubscribedUsers || 0
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
            </div>
            <Select
              value={totalRevenueFilter}
              onValueChange={handleTotalRevenueFilterChange}
            >
              <SelectTrigger className="w-32 h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {innerFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {(totalRevenueData !== undefined
                ? totalRevenueData
                : dashboardData?.totalRevenue || 0
              ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
            </div>
            <Select
              value={conversionRateFilter}
              onValueChange={handleConversionRateFilterChange}
            >
              <SelectTrigger className="w-32 h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {innerFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const totalUsers =
                  totalUsersData !== undefined
                    ? totalUsersData
                    : dashboardData?.totalUsers || 0;
                const subscribedUsers =
                  subscribedUsersData !== undefined
                    ? subscribedUsersData
                    : dashboardData?.totalSubscribedUsers || 0;
                return totalUsers > 0
                  ? ((subscribedUsers / totalUsers) * 100).toFixed(1)
                  : "0";
              })()}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Users to subscribers
            </p>
          </CardContent>
        </Card>

        {/* SpeedyIndex Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                SpeedyIndex Balance
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {speedyLoading ? (
              <div className="flex items-center text-sm text-gray-600">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading…
              </div>
            ) : speedyError ? (
              <div className="text-sm text-red-600">{speedyError}</div>
            ) : (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Indexer</div>
                <div className="text-xl font-semibold">
                  {speedyBalance?.indexer ?? "-"}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Checker
                </div>
                <div className="text-xl font-semibold">
                  {speedyBalance?.checker ?? "-"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <p className="text-sm text-muted-foreground">
            Revenue trends over time
          </p>
        </CardHeader>
        <CardContent>
          <PaymentHistoryChart
            data={dashboardData?.paymentHistory || []}
            filter={globalFilter}
          />
        </CardContent>
      </Card>
    </div>
  );
};
