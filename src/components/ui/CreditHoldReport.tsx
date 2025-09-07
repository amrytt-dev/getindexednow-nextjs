import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Search,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { safeToLocaleString } from "@/utils/creditFormatting.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CreditHold {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  releasedAt?: string;
  taskId: string;
  taskTitle: string;
  taskStatus: string;
  taskSize: number;
  speedyTaskId: string;
  creditsPerUrl: number;
}

interface CreditHoldReportProps {
  holds: any[]; // Replace 'any' with actual type if known
  loading: boolean;
  error: string;
  refreshing: boolean;
  handleRefresh: () => Promise<void>;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange?: (page: number) => void;
  billingCycle?: {
    periodStart: string;
    periodEnd: string;
    planName: string;
  };
  summary?: {
    totalTasks: number;
    activeHolds: number;
    creditUsed: number;
    completedTasksWithHolds: number;
    totalHeldCredits: number;
    totalCreditsUsed: number;
    indexerUsed?: number;
    checkerUsed?: number;
  };
  cycles?: Array<{ label: string; periodStart: string; periodEnd: string }>;
  selectedPeriod?: { periodStart: string; periodEnd: string } | null;
  onCycleChange?: (
    period: { periodStart: string; periodEnd: string } | null
  ) => void;
}

export const CreditHoldReport = ({
  holds,
  loading,
  error,
  refreshing,
  handleRefresh,
  pagination,
  onPageChange,
  billingCycle,
  summary,
  cycles = [],
  selectedPeriod = null,
  onCycleChange,
}: CreditHoldReportProps) => {
  const router = useRouter();
  // Enhanced status badges with clearer labels
  const getStatusBadge = (status: string, taskStatus: string) => {
    switch (status) {
      case "Active Hold":
        return (
          <Badge className="bg-blue-600 text-white rounded-full px-3">
            Active Hold
          </Badge>
        );
      case "Credit Used":
        return (
          <Badge className="bg-green-600 text-white rounded-full px-3">
            Credit Used
          </Badge>
        );
      case "Released":
        return (
          <Badge className="bg-green-600 text-white rounded-full px-3">
            Credit Used
          </Badge>
        );
      case "Expired":
        return (
          <Badge className="bg-red-600 text-white rounded-full px-3">
            Expired
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-blue-600 text-white rounded-full px-3">
            Active Hold
          </Badge>
        );
      case "released":
        return (
          <Badge className="bg-green-600 text-white rounded-full px-3">
            Credit Used
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-600 text-white rounded-full px-3">
            Expired
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-600 text-white rounded-full px-3">
            {status}
          </Badge>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "released":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTaskStatusBadge = (taskStatus: string) => {
    switch (taskStatus?.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-[#e6f4ea] text-[#34a853] border-[#34a853]/20">
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-[#e8f0fe] text-[#4285f4] border-[#4285f4]/20">
            Processing
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-[#fce8e6] text-[#ea4335] border-[#ea4335]/20">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-[#f1f3f4] text-[#5f6368] border-[#5f6368]/20">
            {taskStatus || "Unknown"}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading credit holds...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Use summary data from API instead of calculating from current page holds
  const activeHolds = summary?.activeHolds || 0;
  const totalHeldCredits = summary?.totalHeldCredits || 0;
  const totalCreditsUsed = summary?.totalCreditsUsed || 0;
  const indexerUsed = summary?.indexerUsed || 0;
  const checkerUsed = summary?.checkerUsed || 0;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-0 border-b rounded-none shadow-none">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Credit Hold Summary
              </CardTitle>
              <CardDescription className="text-sm">
                Overview of your held credits
                {billingCycle && (
                  <span className="block text-xs sm:text-sm text-[#5f6368] mt-1">
                    {billingCycle.planName} •{" "}
                    {new Date(billingCycle.periodStart).toLocaleDateString()} -{" "}
                    {new Date(billingCycle.periodEnd).toLocaleDateString()}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="w-full lg:w-auto flex flex-col items-stretch lg:items-end gap-3">
              {!!cycles.length && (
                <div className="w-full lg:w-80">
                  <Select
                    value={
                      selectedPeriod
                        ? JSON.stringify({
                            periodStart: selectedPeriod.periodStart,
                            periodEnd: selectedPeriod.periodEnd,
                          })
                        : "current"
                    }
                    onValueChange={(value) => {
                      if (value === "current") {
                        onCycleChange?.(null);
                      } else {
                        try {
                          const parsed = JSON.parse(value);
                          onCycleChange?.({
                            periodStart: parsed.periodStart,
                            periodEnd: parsed.periodEnd,
                          });
                        } catch {}
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select past billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current cycle</SelectItem>
                      {cycles.map((c) => (
                        <SelectItem
                          key={`${c.periodStart}-${c.periodEnd}`}
                          value={JSON.stringify({
                            periodStart: c.periodStart,
                            periodEnd: c.periodEnd,
                          })}
                        >
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto">
                <div className="text-center p-2 sm:p-3 bg-[#f8f9fa] rounded-lg">
                  <div
                    className="text-lg sm:text-xl font-bold text-[#1a73e8]"
                    style={{ fontFamily: "Product Sans, sans-serif" }}
                  >
                    {activeHolds}
                  </div>
                  <div className="text-xs text-[#5f6368] dark:text-gray-400">
                    Active Holds
                  </div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-[#f8f9fa] rounded-lg">
                  <div
                    className="text-lg sm:text-xl font-bold text-[#34a853]"
                    style={{ fontFamily: "Product Sans, sans-serif" }}
                  >
                    {safeToLocaleString(totalHeldCredits)}
                  </div>
                  <div className="text-xs text-[#5f6368] dark:text-gray-400">
                    Credits on Hold
                  </div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-[#f8f9fa] rounded-lg">
                  <div
                    className="text-lg sm:text-xl font-bold text-[#fbbc04]"
                    style={{ fontFamily: "Product Sans, sans-serif" }}
                  >
                    {safeToLocaleString(totalCreditsUsed)}
                  </div>
                  <div className="text-xs text-[#5f6368] dark:text-gray-400">
                    Credits Used
                  </div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-[#f8f9fa] rounded-lg">
                  <div
                    className="text-lg sm:text-xl font-bold text-[#9334e6]"
                    style={{ fontFamily: "Product Sans, sans-serif" }}
                  >
                    {safeToLocaleString(indexerUsed)}
                  </div>
                  <div className="text-xs text-[#5f6368] dark:text-gray-400">
                    Indexer Used
                  </div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-[#f8f9fa] rounded-lg col-span-2 sm:col-span-1">
                  <div
                    className="text-lg sm:text-xl font-bold text-[#ea4335]"
                    style={{ fontFamily: "Product Sans, sans-serif" }}
                  >
                    {safeToLocaleString(checkerUsed)}
                  </div>
                  <div className="text-xs text-[#5f6368] dark:text-gray-400">
                    Checker Used
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Holds Table */}
      <Card className="border-0">
        <CardContent className="p-4 sm:p-6">
          {holds.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-600">
                No credit holds found
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-[#dadce0] bg-white shadow-sm">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="bg-[#f8f9fa] text-[#5f6368] border-b border-[#dadce0]">
                      <TableHead className="font-medium text-[#202124]">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4 text-[#4285f4]" />
                          Task Name
                        </span>
                      </TableHead>
                      <TableHead className="font-medium text-[#202124]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#4285f4]" />
                          Credit Status
                        </span>
                      </TableHead>
                      <TableHead className="font-medium text-[#202124]">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-[#4285f4]" />
                          Task Status
                        </span>
                      </TableHead>
                      <TableHead className="font-medium text-[#202124] text-left">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4 text-[#4285f4]" />
                          Used Credits
                        </span>
                      </TableHead>
                      <TableHead className="font-medium text-[#202124] text-left">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4 text-[#4285f4]" />
                          Held Credits
                        </span>
                      </TableHead>
                      <TableHead className="font-medium text-[#202124] text-left">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#4285f4]" />
                          Created
                        </span>
                      </TableHead>
                      <TableHead className="font-medium text-[#202124] text-left">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-[#4285f4]" />
                          Released
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holds.map((task) => (
                      <TableRow
                        key={task.taskId}
                        className="border-b border-[#dadce0] hover:bg-[#f8f9fa] transition-colors"
                      >
                        <TableCell className="max-w-xs">
                          <div className="flex flex-col">
                            <div
                              className="font-medium text-[#202124] truncate cursor-pointer hover:text-[#4285f4] transition-colors"
                              onClick={() =>
                                router.push(
                                  `/tasks?taskId=${task.taskId}&type=${
                                    task.taskType || "indexer"
                                  }`
                                )
                              }
                            >
                              {task.taskTitle}
                            </div>
                            <div className="text-xs text-[#5f6368]">
                              {task.taskSize} URLs
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(task.currentStatus, task.taskStatus)}
                        </TableCell>
                        <TableCell>
                          {getTaskStatusBadge(task.taskStatus)}
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="font-bold text-[#34a853]">
                            {(task.totalUsedCredits ?? 0).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="font-bold text-[#fbbc04]">
                            {(task.totalHeldCredits ?? 0).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="text-sm text-[#5f6368]">
                            {task.latestHold?.createdAt
                              ? formatDistanceToNow(
                                  new Date(task.latestHold.createdAt),
                                  { addSuffix: true }
                                )
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="text-sm text-[#5f6368]">
                            {task.latestHold?.releasedAt
                              ? formatDistanceToNow(
                                  new Date(task.latestHold.releasedAt),
                                  { addSuffix: true }
                                )
                              : "-"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs sm:text-sm text-[#5f6368] text-center sm:text-left">
                    Showing{" "}
                    {(pagination.currentPage - 1) * pagination.pageSize + 1} to{" "}
                    {Math.min(
                      pagination.currentPage * pagination.pageSize,
                      pagination.totalCount
                    )}{" "}
                    of {pagination.totalCount} holds
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange?.(pagination.currentPage - 1)}
                      disabled={!pagination.hasPreviousPage}
                      className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </Button>

                    {/* Page numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(3, pagination.totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.currentPage <= 2) {
                            pageNum = i + 1;
                          } else if (
                            pagination.currentPage >=
                            pagination.totalPages - 1
                          ) {
                            pageNum = pagination.totalPages - 2 + i;
                          } else {
                            pageNum = pagination.currentPage - 1 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                pagination.currentPage === pageNum
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => onPageChange?.(pageNum)}
                              className="h-8 w-8 p-0 text-xs sm:text-sm"
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
                      onClick={() => onPageChange?.(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
