import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Zap } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { ReportViewer } from "./ReportViewer";
import { saveAs } from "file-saver";
import { Skeleton } from "@/components/ui/skeleton";

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
  report_status?: string | null;
  report_last_checked?: string;
  is_completed?: boolean;
  size?: number;
  creditUsage: number;
}

interface ReportsTableProps {
  tasks: Task[];
  onRefresh: () => void;
}

// Skeleton component for loading state
export const ReportsTableSkeleton = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>URLs</TableHead>
            <TableHead>Indexed</TableHead>
            <TableHead>Processed</TableHead>
            <TableHead>Report Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const ReportsTable = ({ tasks, onRefresh }: ReportsTableProps) => {
  const navigate = useNavigate();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [viewingReport, setViewingReport] = useState<any>(null);

  const setLoading = (taskId: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [taskId]: loading }));
  };

  const handleViewReport = async (task: Task) => {
    setLoading(task.id, true);
    try {
      toast({
        title: "Report viewing",
        description:
          "Please implement your own backend API for viewing reports.",
      });
    } catch (error) {
      toast({
        title: "Failed to load report",
        description: "Please implement your own backend API.",
        variant: "destructive",
      });
    } finally {
      setLoading(task.id, false);
    }
  };

  // Download report as CSV immediately when clicking button
  const handleDownloadCsv = async (taskId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(
        `${BASE_URL}/api/reports/download?format=csv&taskId=${taskId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to download report");
      const blob = await response.blob();
      saveAs(blob, `task_report_${taskId}.csv`);
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Failed to download CSV report.",
        variant: "destructive",
      });
    }
  };

  // Helper function to get task status and determine if download should be shown
  const getTaskStatus = (task: Task) => {
    // For VIP tasks, use the status field directly
    if (task.vipQueue) {
      return {
        isCompleted: task.status === "completed",
        isVip: true,
      };
    }

    // For non-VIP tasks, use computedStatus
    return {
      isCompleted: task.is_completed,
      isVip: false,
    };
  };

  const getReportStatusBadge = (task: Task) => {
    const status = task.report_status;
    if (status === "available") {
      return (
        <Badge variant="default" className="bg-green-500 text-white">
          Report available
        </Badge>
      );
    } else if (status === "not_ready") {
      return (
        <Badge variant="destructive" className="bg-red-500 text-white">
          Report not generated yet
        </Badge>
      );
    } else {
      return <Badge variant="outline">Click refresh to check</Badge>;
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>URLs</TableHead>
              <TableHead>Indexed</TableHead>
              <TableHead>Processed</TableHead>
              <TableHead>Report Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(tasks)
              ? tasks.map((task) => {
                  const isLoading = loadingStates[task.id] || false;
                  const taskStatus = getTaskStatus(task);

                  return (
                    <TableRow
                      key={task.id}
                      className="cursor-pointer hover:bg-gray-50 "
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="font-medium cursor-pointer hover:text-[#4285f4] transition-colors"
                            onClick={() =>
                              navigate(
                                `/tasks?taskId=${task.id}&type=${task?.type
                                  ?.split("/")
                                  .pop()}`
                              )
                            }
                          >
                            {task.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {typeof task.size === "number"
                          ? task.size
                          : task.link_count ?? "-"}
                      </TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">
                          {task.indexed_count}
                        </span>
                        <span className="text-muted-foreground">
                          /{task.size}
                        </span>
                      </TableCell>
                      <TableCell>{task.processed_count}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {/* Only show Download Report button for VIP tasks that are completed */}
                          {taskStatus.isVip && taskStatus.isCompleted ? (
                            <button
                              className="flex items-center gap-2 text-green-700 hover:underline"
                              onClick={(e) => handleDownloadCsv(task.id, e)}
                            >
                              <Download className="w-4 h-4" />
                              Download report
                            </button>
                          ) : (
                            <span className="text-gray-400">Not ready</span>
                          )}
                          {task.report_last_checked && (
                            <div className="text-xs text-muted-foreground">
                              Last checked:{" "}
                              {format(
                                new Date(task.report_last_checked),
                                "MMM dd, HH:mm"
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </div>

      {/*{viewingReport && (*/}
      {/*  <ReportViewer*/}
      {/*    report={viewingReport}*/}
      {/*    onClose={() => setViewingReport(null)}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};
