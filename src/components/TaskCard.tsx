import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  RefreshCw,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./ui/collapsible";
import { TaskLinksTable } from "./TaskLinksTable";
import { useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useRefreshRateLimit, useLocalLinks } from "@/hooks/useTasksQueries";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";

interface Task {
  id: string;
  title: string;
  type: string;
  status: string;
  link_count?: number;
  processed_count?: number;
  indexed_count?: number;
  vipQueue?: boolean;
  credits_used?: number;
  created_at: string;
  completed_at?: string | null;
  speedy_task_id?: string;
  size?: number;
  creditUsage: number;
  heldCredits?: number;
  totalCredits?: number;
  is_completed: boolean;
}

interface TaskCardProps {
  task: Task;
  isUpdating: boolean;
  onUpdateStatus: (task: Task) => void;
  statusLabel?: string;
}

export const TaskCard = ({
  task,
  isUpdating,
  onUpdateStatus,
  statusLabel,
}: TaskCardProps) => {
  const getStatusColor = (label: string) => {
    switch (label?.toLowerCase()) {
      case "completed":
        return "bg-[#e6f4ea] text-[#34a853] border-[#34a853]/20";
      case "processing":
        return "bg-[#e8f0fe] text-[#4285f4] border-[#4285f4]/20";
      default:
        return "bg-[#f1f3f4] text-[#5f6368] border-[#5f6368]/20";
    }
  };

  const getProgressColor = (label: string) => {
    switch (label?.toLowerCase()) {
      case "completed":
        return "bg-[#34a853]";
      case "processing":
        return "bg-[#4285f4]";
      default:
        return "bg-[#5f6368]";
    }
  };

  // Use the status from backend (which includes VIP timing logic) if available
  // Otherwise fall back to simple is_completed check
  const computeTaskStatus = (task: Task) => {
    if (task.status) {
      // Convert "pending" to "Processing" for VIP tasks
      if (task.status.toLowerCase() === "pending") {
        return "Processing";
      }
      return task.status.charAt(0).toUpperCase() + task.status.slice(1);
    }
    return task.is_completed ? "Completed" : "Processing";
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const isCompleted = task.is_completed;

  // User context
  const { user } = useUser();

  // TanStack Query for local links (completed tasks)
  const { data: localLinks } = useLocalLinks(task.id, isCompleted, user?.id);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value && !hasOpened) setHasOpened(true); // trigger one-time fetch
  };

  // Refresh rate limiting for task status
  const {
    canRefresh,
    getTimeUntilNextRefresh,
    handleRefreshWithRateLimit,
    getLastRefreshTime,
  } = useRefreshRateLimit(task.id);

  const handleUpdateStatus = () => {
    handleRefreshWithRateLimit(() => {
      onUpdateStatus(task);
    });
  };

  const isRefreshEnabled = canRefresh();
  const timeUntilNextRefresh = getTimeUntilNextRefresh();

  // Get last refresh time for display
  const lastRefreshTime = getLastRefreshTime();
  const hasBeenRefreshed = lastRefreshTime > 0;
  const lastRefreshText = hasBeenRefreshed
    ? formatDistanceToNow(new Date(lastRefreshTime), { addSuffix: true })
    : "";

  // Compute status for child tables - use backend status if available
  const computedStatus =
    task.status || (task.is_completed ? "completed" : "processing");

  // Calculate progress percentage
  const progressPercentage =
    typeof task.size === "number" &&
    typeof task.processed_count === "number" &&
    task.size > 0
      ? Math.min(Math.round((task.processed_count / task.size) * 100), 100)
      : 0;

  // Download report functionality
  const handleDownloadReport = async (event: React.MouseEvent) => {
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

  return (
    <Card className="border border-[#dadce0] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden bg-white">
      <div className="p-5">
        <div className="space-y-4">
          {/* Header with Title and Status */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">
                {task.type.includes("indexer") ? "🚀" : "🔍"}
              </span>
              <h3 className=" text-[18px] font-medium text-[#202124] truncate">
                {task.title}
              </h3>
            </div>
            <Badge
              className={`rounded-full px-3 py-1 text-sm font-medium hover:bg-${getStatusColor(
                computeTaskStatus(task)
              )} ${getStatusColor(computeTaskStatus(task))}`}
            >
              {computeTaskStatus(task)}
            </Badge>
          </div>

          {/* Progress Bar */}
          {/* <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#5f6368]">Progress</span>
              <span className="font-medium text-[#202124]">{progressPercentage}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2" 
              style={{ backgroundColor: '#f1f3f4' }}
            />
            <div className="flex justify-between text-xs text-[#5f6368]">
              <span>Indexed: {task.indexed_count || 0} / {task.size || 0}</span>
              <span className={getProgressColor(computeTaskStatus(task))}>
                {computeTaskStatus(task) === 'failed' && task.size && task.indexed_count 
                  ? `${task.size - task.indexed_count} failed` 
                  : ''}
              </span>
            </div>
          </div> */}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#f8f9fa] rounded-lg p-3">
              <div className="text-xs text-[#5f6368] mb-1">Total URLs</div>
              <div className="text-[16px] font-medium text-[#202124]">
                {task.size?.toLocaleString() || "0"}
              </div>
            </div>
            <div className="bg-[#f8f9fa] rounded-lg p-3">
              <div className="text-xs text-[#5f6368] mb-1">Processed</div>
              <div className="text-[16px] font-medium text-[#4285f4]">
                {task.processed_count?.toLocaleString() || "0"}
              </div>
            </div>
            <div className="bg-[#f8f9fa] rounded-lg p-3">
              <div className="text-xs text-[#5f6368] mb-1">Indexed</div>
              <div className="text-[16px] font-medium text-[#34a853]">
                {task.indexed_count?.toLocaleString() || "0"}/
                {task.size?.toLocaleString() || "0"}
              </div>
            </div>
            <div className="bg-[#f8f9fa] rounded-lg p-3">
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div>
                    <div className="text-xs text-[#5f6368] mb-1">Credits</div>
                    <div className="text-[16px] font-medium text-[#fbbc04] cursor-help">
                      {(() => {
                        const totalCreditsForTask = 1 * (task.size || 0);
                        const heldCredits = task.heldCredits || 0;
                        const usedCredits = task.creditUsage || 0;
                        const statusLower = (task.status || "").toLowerCase();

                        // Processing: prefer showing held; fallback to used; else total
                        if (statusLower === "processing") {
                          if (heldCredits > 0) return `${heldCredits} (held)`;
                          if (usedCredits > 0) return `${usedCredits} (used)`;
                          return `${totalCreditsForTask} (total)`;
                        }

                        // Completed or other: never show '(held)'. Prefer used, else total
                        if (usedCredits > 0) return `${usedCredits} (used)`;
                        return `${totalCreditsForTask} (total)`;
                      })()}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-white border border-[#dadce0] shadow-lg p-3 rounded-lg"
                >
                  <div className="space-y-1 text-sm">
                    <p>Total credits for task: {(task.size || 0) * 1}</p>
                    <p>
                      Credits on hold:{" "}
                      {task.heldCredits?.toLocaleString() || "0"}
                    </p>
                    <p>
                      Credits used: {task.creditUsage?.toLocaleString() || "0"}
                    </p>
                    <p>Credits per URL: 1</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Footer with Creation Time and Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#dadce0]">
            <div className="flex items-center space-x-2 text-sm text-[#5f6368]">
              <Calendar className="h-4 w-4" />
              <span>Created {formatTimeAgo(task.created_at)}</span>
            </div>

            <div className="flex items-center space-x-2">
              {/* VIP sync button hidden by request */}

              {isCompleted &&
                (task.type === "indexer" ||
                  task.type === "google/indexer" ||
                  task.type === "fastindex/indexer") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadReport}
                    className="h-9 rounded-full border-[#dadce0] text-[#4285f4] hover:bg-[#f1f3f4] px-5"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                )}

              <Collapsible open={open} onOpenChange={handleOpenChange}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-full border-[#dadce0] text-[#4285f4] hover:bg-[#f1f3f4] px-5"
                    aria-expanded={open}
                  >
                    {open ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Hide details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        View details
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          </div>

          {/* Collapsible Content */}
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleContent>
              <div className="mt-4 pt-4 border-t border-[#dadce0]">
                <TaskLinksTable
                  taskId={task.id}
                  type={
                    task.type === "checker" ||
                    task.type === "google/checker" ||
                    task.type === "fastindex/indexer"
                      ? "checker"
                      : "indexer"
                  }
                  isCompleted={isCompleted}
                  localLinks={localLinks}
                  task={{
                    size: task.size,
                    vipQueue: task.vipQueue,
                    heldCredits: task.heldCredits,
                    creditUsage: task.creditUsage,
                    status: computedStatus,
                  }}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </Card>
  );
};
