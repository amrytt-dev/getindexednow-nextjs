import React, { useEffect, useRef, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { TaskCard } from "@/components/TaskCard";
import { TasksEmptyState } from "./tasks/TasksEmptyState";
import { TasksLoadingState } from "./tasks/TasksLoadingState";
import { useTasksList, useUpdateTaskStatus } from "@/hooks/useTasksQueries";
import { useUser } from "@/contexts/UserContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TasksListHeader } from "./tasks/TasksListHeader";
import { useDebounce } from "@/hooks/useDebounce.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  Zap,
  Calendar,
  CheckCircle,
  RefreshCw,
  FileText,
  BarChart3,
  Link,
  TrendingUp,
  CreditCard,
  Clock,
  ChevronRight,
  ActivityIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TaskLinksTable } from "./TaskLinksTable";
import { useLocalLinks } from "@/hooks/useTasksQueries";
import { toast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import { usePendingTasks } from "@/contexts/PendingTasksContext";

interface TasksListProps {
  taskType?: "indexer" | "checker";
  selectedTaskId?: string | null;
  onCreateTask?: () => void;
}

const TASKS_PER_PAGE = 10;

export const TasksList = ({
  taskType,
  selectedTaskId,
  onCreateTask,
}: TasksListProps) => {
  const safeType: "indexer" | "checker" =
    taskType === "checker" ? "checker" : "indexer";
  const { user, loading: userLoading } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeFilter]);

  const {
    data: tasksData,
    isLoading,
    error,
    refetch,
  } = useTasksList(safeType, user?.id, {
    search: debouncedSearch,
    dateRange: activeFilter ?? undefined,
    page: currentPage,
    limit: TASKS_PER_PAGE,
  });

  const tasks = tasksData?.tasks || [];
  const totalCount = tasksData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / TASKS_PER_PAGE);

  // Get pending tasks for this type
  const { pendingTasks } = usePendingTasks();
  const pendingTasksForType = pendingTasks.filter(
    (task) => task.type === safeType
  );

  const updateTaskStatusMutation = useUpdateTaskStatus();
  const selectedTaskRef = useRef<HTMLTableRowElement>(null);

  // Scroll to selected task when component mounts or selectedTaskId changes
  useEffect(() => {
    if (selectedTaskId && selectedTaskRef.current) {
      setTimeout(() => {
        selectedTaskRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
    }
  }, [selectedTaskId, tasks]);

  // Combine real tasks with pending tasks, putting pending tasks at the top
  const filteredTasks = [...pendingTasksForType, ...tasks];

  const handleUpdateStatus = (task: any) => {
    updateTaskStatusMutation.mutate(task);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handler to trigger refetch after task creation
  const handleTaskCreated = () => {
    refetch();
    if (onCreateTask) onCreateTask();
  };

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);

    if (newExpanded.has(taskId)) {
      // Collapsing
      newExpanded.delete(taskId);
      setExpandedTasks(newExpanded);
    } else {
      // Expanding
      newExpanded.add(taskId);
      setExpandedTasks(newExpanded);
    }
  };

  const getStatusColor = (label: string) => {
    switch (label?.toLowerCase()) {
      case "completed":
        return "bg-[#e6f4ea] text-[#34a853] border-[#34a853]/20";
      case "processing":
        return "bg-[#e8f0fe] text-[#4285f4] border-[#4285f4]/20";
      case "creating":
        return "bg-[#fff3cd] text-[#856404] border-[#856404]/20";
      default:
        return "bg-[#f1f3f4] text-[#5f6368] border-[#5f6368]/20";
    }
  };

  const computeTaskStatus = (task: any) => {
    // Check if this is a pending task
    if (task.id && task.id.startsWith("pending-")) {
      return "Creating";
    }

    // Use the status from backend (which includes VIP timing logic) if available
    // Otherwise fall back to simple is_completed check
    if (task.status) {
      return task.status.charAt(0).toUpperCase() + task.status.slice(1);
    }
    return task.is_completed ? "Completed" : "Processing";
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Download report functionality
  const handleDownloadReport = async (task: any, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(
        `${BASE_URL}/api/reports/download?format=csv&taskId=${task.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to download report");
      const blob = await response.blob();
      saveAs(blob, `task_report_${task.id}.csv`);

      toast({
        title: "Report downloaded",
        description: "Task report has been downloaded successfully.",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Failed to download task report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state if user is still loading
  if (userLoading) {
    return (
      <div className="w-full">
        <TasksListHeader
          taskType={taskType}
          onSearch={setSearchQuery}
          onFilterChange={(val) => {
            setActiveFilter(val);
          }}
        />
        <CardContent className="p-6">
          <TasksLoadingState />
        </CardContent>
      </div>
    );
  }

  return (
    <div className="w-full">
      <TasksListHeader
        taskType={taskType}
        onSearch={setSearchQuery}
        onFilterChange={(val) => {
          setActiveFilter(val);
        }}
      />
      <CardContent className="p-6">
        {isLoading ? (
          <TasksLoadingState />
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <TasksEmptyState
              totalTasks={totalCount}
              filteredCount={totalCount}
              onClearFilters={() => {
                setSearchQuery("");
                setActiveFilter(null);
                setCurrentPage(1);
              }}
              onCreateTaskClick={onCreateTask}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Professional Table Design */}
            <div className="overflow-x-auto rounded-lg border border-[#dadce0] bg-white shadow-sm">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-[#f8f9fa] text-[#5f6368] border-b border-[#dadce0]">
                    <TableHead className="font-medium text-[#202124] w-12">
                      <span className="flex items-center gap-1"></span>
                    </TableHead>
                    <TableHead className="font-medium text-[#202124]">
                      <span className="flex items-center gap-1">Task Name</span>
                    </TableHead>
                    <TableHead className="font-medium text-[#202124]">
                      <span className="flex items-center gap-1">Status</span>
                    </TableHead>
                    <TableHead className="font-medium text-[#202124]">
                      <span className="flex items-center gap-1">URLs</span>
                    </TableHead>
                    <TableHead className="font-medium text-[#202124]">
                      <span className="flex items-center gap-1">Progress</span>
                    </TableHead>
                    <TableHead className="font-medium text-[#202124]">
                      <span className="flex items-center gap-1">Credits</span>
                    </TableHead>
                    <TableHead className="font-medium text-[#202124]">
                      <span className="flex items-center gap-1">Created</span>
                    </TableHead>
                    <TableHead className="font-medium text-[#202124] w-32">
                      <span className="flex items-center justify-center gap-1">
                        Actions
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => {
                    // Check if task is null/undefined
                    if (!task) {
                      return null;
                    }

                    const isExpanded = expandedTasks.has(task.id);
                    const isCompleted =
                      task.is_completed || task.status === "completed";
                    const computedStatus = computeTaskStatus(task);
                    const isPendingTask =
                      task.id && task.id.startsWith("pending-");
                    const progressPercentage = isPendingTask
                      ? 0
                      : typeof task.size === "number" &&
                        typeof task.indexed_count === "number" &&
                        task.size > 0
                      ? Math.min(
                          Math.round((task.indexed_count / task.size) * 100),
                          100
                        )
                      : 0;

                    return (
                      <React.Fragment key={task.id || `task-${Math.random()}`}>
                        <TableRow
                          ref={
                            task.id === selectedTaskId ? selectedTaskRef : null
                          }
                          className={`border-b border-[#dadce0] transition-colors ${
                            task.id === selectedTaskId
                              ? "ring-2 ring-[#4285f4] bg-[#e8f0fe]"
                              : isPendingTask
                              ? "bg-gray-50 opacity-75"
                              : "hover:bg-[#f8f9fa]"
                          }`}
                        >
                          {/* Task Type Icon */}
                          <TableCell className="w-12">
                            <span className="text-xl">
                              {isPendingTask
                                ? "⏳"
                                : task.speedyType &&
                                  task.speedyType.includes("indexer")
                                ? "🚀"
                                : "🔍"}
                            </span>
                          </TableCell>

                          {/* Task Name */}
                          <TableCell className="max-w-xs">
                            <div className="flex flex-col">
                              <div className="font-medium text-[#202124] truncate">
                                {task.title || "Untitled Task"}
                              </div>
                            </div>
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <Badge
                              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                computedStatus
                              )}`}
                            >
                              {computedStatus}
                            </Badge>
                          </TableCell>

                          {/* URLs Count */}
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-[#202124]">
                                {isPendingTask
                                  ? `${task.urls?.length || 0}`
                                  : `${
                                      task.indexed_count?.toLocaleString() ||
                                      "0"
                                    }/${task.size?.toLocaleString() || "0"}`}
                              </span>
                              <span className="text-xs text-[#5f6368]">
                                {isPendingTask
                                  ? "pending"
                                  : `${
                                      task.processed_count?.toLocaleString() ||
                                      "0"
                                    } processed`}
                              </span>
                            </div>
                          </TableCell>

                          {/* Progress */}
                          <TableCell className="w-32">
                            <div className="space-y-1">
                              <Progress
                                value={progressPercentage}
                                className="h-2"
                                style={{ backgroundColor: "#f1f3f4" }}
                              />
                              <span className="text-xs text-[#5f6368]">
                                {progressPercentage}%
                              </span>
                            </div>
                          </TableCell>

                          {/* Credits */}
                          <TableCell>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger asChild>
                                <div className="cursor-help">
                                  <span className="font-medium text-[#fbbc04]">
                                    {isPendingTask
                                      ? `${task.urls?.length || 0} (pending)`
                                      : (() => {
                                          const totalCreditsForTask =
                                            1 * (task.size || 0);
                                          const heldCredits =
                                            task.heldCredits || 0;
                                          const usedCredits =
                                            task.creditUsage || 0;

                                          if (heldCredits > 0) {
                                            return `${heldCredits} (held)`;
                                          } else if (usedCredits > 0) {
                                            return `${usedCredits} (used)`;
                                          } else {
                                            return `${totalCreditsForTask} (total)`;
                                          }
                                        })()}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="bg-white border border-[#dadce0] shadow-lg p-3 rounded-lg"
                              >
                                <div className="space-y-1 text-sm">
                                  <p>
                                    Total credits for task:{" "}
                                    {(task.size || 0) * 1}
                                  </p>
                                  <p>
                                    Credits on hold:{" "}
                                    {task.heldCredits?.toLocaleString() || "0"}
                                  </p>
                                  <p>
                                    Credits used:{" "}
                                    {task.creditUsage?.toLocaleString() || "0"}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>

                          {/* Created Date */}
                          <TableCell>
                            <div className="flex items-center space-x-2 text-sm text-[#5f6368]">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {isPendingTask
                                  ? "Just now"
                                  : task.created_at &&
                                    !isNaN(new Date(task.created_at).getTime())
                                  ? formatTimeAgo(task.created_at)
                                  : "Unknown date"}
                              </span>
                            </div>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="w-32">
                            <div className="flex items-center space-x-2">
                              {/* Download Report Button - Disabled for pending tasks */}
                              <div className="w-8 h-8">
                                {!isPendingTask &&
                                computedStatus === "Completed" &&
                                (task.type === "indexer" ||
                                  task.type === "google/indexer" ||
                                  (task.speedyType &&
                                    task.speedyType === "fastindex/indexer") ||
                                  (task.speedyType &&
                                    task.speedyType.includes("indexer"))) ? (
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) =>
                                          handleDownloadReport(task, e)
                                        }
                                        className="h-8 w-8 p-0 rounded-full border-[#dadce0] text-[#4285f4] hover:bg-[#f1f3f4]"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className="bg-white border border-[#dadce0] shadow-lg p-3 rounded-lg"
                                    >
                                      <p className="text-sm">Download Report</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <div className="w-8 h-8" />
                                )}
                              </div>

                              {/* VIP sync button hidden by request */}

                              {/* View Details Button - Disabled for pending tasks */}
                              {isPendingTask ? (
                                <div className="w-8 h-8 flex items-center justify-center">
                                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                <Tooltip delayDuration={300}>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        toggleTaskExpansion(task.id)
                                      }
                                      className="h-8 w-8 p-0 rounded-full border-[#dadce0] text-[#4285f4] hover:bg-[#f1f3f4] transition-all duration-200"
                                    >
                                      <ChevronRight
                                        className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                                          isExpanded ? "rotate-90" : "rotate-0"
                                        }`}
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="bg-white border border-[#dadce0] shadow-lg p-3 rounded-lg"
                                  >
                                    <p className="text-sm">
                                      {isExpanded
                                        ? "Hide Details"
                                        : "View Details"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Details Row - Not shown for pending tasks */}
                        <AnimatePresence>
                          {isExpanded && !isPendingTask && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <td colSpan={8} className="p-0">
                                <div className="bg-[#f8f9fa] border-t border-[#dadce0] p-4">
                                  <TaskLinksTable
                                    taskId={task.id || ""}
                                    type={
                                      task.type === "checker" ||
                                      task.type === "google/checker" ||
                                      (task.speedyType &&
                                        task.speedyType.includes("checker"))
                                        ? "checker"
                                        : "indexer"
                                    }
                                    isCompleted={isCompleted}
                                    localLinks={undefined} // Will be fetched by the component
                                    task={{
                                      size: task.size || 0,
                                      vipQueue: task.vipQueue || false,
                                      heldCredits: task.heldCredits || 0,
                                      creditUsage: task.creditUsage || 0,
                                      status: computedStatus,
                                    }}
                                  />
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Google-style pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={`rounded-full border-[#dadce0] hover:bg-[#f1f3f4] hover:text-[#4285f4] ${
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }`}
                      onClick={handlePrevious}
                    />
                  </PaginationItem>

                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;

                    if (totalPages <= maxVisiblePages) {
                      // Show all pages if total is 5 or less
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Show first page
                      pages.push(1);

                      if (currentPage > 3) {
                        pages.push("...");
                      }

                      // Show pages around current page
                      const start = Math.max(2, currentPage - 1);
                      const end = Math.min(totalPages - 1, currentPage + 1);

                      for (let i = start; i <= end; i++) {
                        if (!pages.includes(i)) {
                          pages.push(i);
                        }
                      }

                      if (currentPage < totalPages - 2) {
                        pages.push("...");
                      }

                      // Show last page
                      if (totalPages > 1) {
                        pages.push(totalPages);
                      }
                    }

                    return pages.map((page, index) => (
                      <PaginationItem key={index}>
                        {page === "..." ? (
                          <span className="px-3 py-2 text-[#5f6368]">...</span>
                        ) : (
                          <PaginationLink
                            className={`rounded-full border-[#dadce0] hover:bg-[#f1f3f4] cursor-pointer ${
                              currentPage === page
                                ? "bg-[#4285f4] text-white"
                                : ""
                            }`}
                            onClick={() => handlePageChange(page as number)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ));
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      className={`rounded-full border-[#dadce0] hover:bg-[#f1f3f4] hover:text-[#4285f4] ${
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }`}
                      onClick={handleNext}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default TasksList;
