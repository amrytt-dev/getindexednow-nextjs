import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Eye,
  RotateCcw,
  AlertCircle,
  Server,
  Network,
  Database,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { getWithAuth, postWithAuth } from "@/utils/fetchWithAuth";

interface VipTaskStats {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  pendingTasks: number;
  processingTasks: number;
  successRate: number;
  averageProcessingTime: number;
}

interface VipQueueStats {
  waiting: number;
  delayed: number;
  pending: number;
  active: number;
  completed: number;
  failed: number;
  totalJobs: number;
}

interface DelayedJob {
  id: string;
  name: string;
  data: any;
  timestamp: number;
  delay: number;
  delayUntil: number;
  remainingTime: number;
  pendingTime: number;
  processedOn?: number;
  finishedOn?: number;
}

interface FailedJob {
  id: string;
  name: string;
  taskId: string;
  title: string;
  failedReason: string;
  timestamp: string;
  data: any;
}

interface FailedTask {
  taskId: string;
  title: string;
  failedJobs: FailedJob[];
}

interface HealthStatus {
  timestamp: string;
  dns: {
    status: string;
    error: string | null;
  };
  api: {
    status: string;
    error: string | null;
    responseTime: string | null;
  };
  overall: string;
}

const VipTaskManagement = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch VIP task statistics
  const {
    data: taskStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["vip-task-stats"],
    queryFn: async (): Promise<VipTaskStats> => {
      return await getWithAuth("/admin/vip-tasks/stats");
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch VIP queue statistics
  const {
    data: queueStats,
    isLoading: queueLoading,
    refetch: refetchQueue,
  } = useQuery({
    queryKey: ["vip-queue-stats"],
    queryFn: async (): Promise<VipQueueStats> => {
      const data = await getWithAuth("/vip/queue/status");
      return {
        waiting: data.stats.waiting,
        delayed: data.stats.delayed ?? 0,
        pending:
          data.stats.pending ?? data.stats.waiting + (data.stats.delayed ?? 0),
        active: data.stats.active,
        completed: data.stats.completed,
        failed: data.stats.failed,
        totalJobs:
          data.stats.waiting +
          (data.stats.delayed ?? 0) +
          data.stats.active +
          data.stats.completed +
          data.stats.failed,
      };
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Fetch failed tasks
  const {
    data: failedTasks,
    isLoading: failedLoading,
    refetch: refetchFailed,
  } = useQuery({
    queryKey: ["vip-failed-tasks"],
    queryFn: async (): Promise<FailedTask[]> => {
      const data = await getWithAuth("/vip/failed");
      return data.failedTasks || [];
    },
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  // Fetch delayed jobs
  const {
    data: delayedJobs,
    isLoading: delayedLoading,
    refetch: refetchDelayed,
  } = useQuery({
    queryKey: ["vip-delayed-jobs"],
    queryFn: async (): Promise<DelayedJob[]> => {
      const data = await getWithAuth("/vip/delayed");
      return data.delayedJobs || [];
    },
    refetchInterval: 10000, // Refresh every 10 seconds to update countdown
  });

  // Fetch health status
  const {
    data: healthStatus,
    isLoading: healthLoading,
    refetch: refetchHealth,
  } = useQuery({
    queryKey: ["vip-health-status"],
    queryFn: async (): Promise<HealthStatus> => {
      return await getWithAuth("/vip/health/speedyindex");
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Bulk retry mutation
  const bulkRetryMutation = useMutation({
    mutationFn: async () => {
      return await postWithAuth("/vip/bulk-retry");
    },
    onSuccess: (data) => {
      toast.success(
        `Bulk retry initiated: ${data.totalJobsRetried} jobs retried`
      );
      queryClient.invalidateQueries({ queryKey: ["vip-failed-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["vip-queue-stats"] });
    },
    onError: (error) => {
      toast.error(`Bulk retry failed: ${error.message}`);
    },
  });

  // Individual task retry mutation
  const retryTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return await postWithAuth(`/vip/retry/${taskId}`);
    },
    onSuccess: (data, taskId) => {
      toast.success(
        `Task ${taskId} retry initiated: ${data.totalJobsRetried} jobs retried`
      );
      queryClient.invalidateQueries({ queryKey: ["vip-failed-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["vip-queue-stats"] });
    },
    onError: (error, taskId) => {
      toast.error(`Failed to retry task ${taskId}: ${error.message}`);
    },
  });

  const handleBulkRetry = () => {
    if (failedTasks && failedTasks.length > 0) {
      bulkRetryMutation.mutate();
    } else {
      toast.info("No failed tasks to retry");
    }
  };

  const handleRetryTask = (taskId: string) => {
    retryTaskMutation.mutate(taskId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "unhealthy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4" />;
      case "unhealthy":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (statsLoading || queueLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading VIP task statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            VIP Task Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage VIP task processing and retry failed jobs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              refetchStats();
              refetchQueue();
              refetchFailed();
              refetchHealth();
            }}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="failed">Failed Tasks</TabsTrigger>
          <TabsTrigger value="delayed">Delayed Jobs</TabsTrigger>
          <TabsTrigger value="queue">Queue Status</TabsTrigger>
          <TabsTrigger value="health">Health Monitor</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tasks
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {taskStats?.totalTasks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  All VIP tasks created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {taskStats?.completedTasks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully processed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {taskStats?.failedTasks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks with errors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {taskStats?.successRate
                    ? `${taskStats.successRate.toFixed(1)}%`
                    : "0%"}
                </div>
                <p className="text-xs text-muted-foreground">Completion rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Processing Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Processing Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending</span>
                  <Badge variant="secondary">
                    {taskStats?.pendingTasks || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processing</span>
                  <Badge variant="outline">
                    {taskStats?.processingTasks || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Average Processing Time
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {taskStats?.averageProcessingTime
                      ? `${taskStats.averageProcessingTime.toFixed(1)} min`
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Queue Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Waiting</span>
                  <Badge variant="secondary">{queueStats?.waiting || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Delayed</span>
                  <Badge variant="secondary">{queueStats?.delayed || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Pending (Waiting + Delayed)
                  </span>
                  <Badge variant="outline">
                    {queueStats?.pending ||
                      (queueStats?.waiting || 0) + (queueStats?.delayed || 0)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active</span>
                  <Badge variant="outline">{queueStats?.active || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed</span>
                  <Badge variant="default">{queueStats?.completed || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Failed</span>
                  <Badge variant="destructive">{queueStats?.failed || 0}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Failed Tasks Tab */}
        <TabsContent value="failed" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Failed Tasks</h2>
            <Button
              onClick={handleBulkRetry}
              disabled={
                bulkRetryMutation.isPending ||
                !failedTasks ||
                failedTasks.length === 0
              }
              className="bg-orange-600 hover:bg-orange-700"
            >
              {bulkRetryMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              Retry All Failed ({failedTasks?.length || 0})
            </Button>
          </div>

          {failedLoading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              Loading failed tasks...
            </div>
          ) : failedTasks && failedTasks.length > 0 ? (
            <div className="space-y-4">
              {failedTasks.map((task) => (
                <Card key={task.taskId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Task ID: {task.taskId}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleRetryTask(task.taskId)}
                        disabled={retryTaskMutation.isPending}
                        size="sm"
                        variant="outline"
                      >
                        {retryTaskMutation.isPending ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                        Retry
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {task.failedJobs.map((job) => (
                        <div
                          key={job.id}
                          className="border-l-4 border-red-500 pl-4 py-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{job.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Failed at:{" "}
                                {format(
                                  new Date(job.timestamp),
                                  "MMM dd, yyyy HH:mm:ss"
                                )}
                              </p>
                            </div>
                            <Badge variant="destructive">Failed</Badge>
                          </div>
                          <p className="text-sm text-red-600 mt-1">
                            {job.failedReason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600">No failed tasks found</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Delayed Jobs Tab */}
        <TabsContent value="delayed" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Delayed Jobs</h2>
            <Button
              onClick={() => refetchDelayed()}
              disabled={delayedLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  delayedLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
          </div>

          {delayedLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Loading delayed jobs...</p>
                </div>
              </CardContent>
            </Card>
          ) : delayedJobs && delayedJobs.length > 0 ? (
            <div className="space-y-4">
              {delayedJobs.map((job) => {
                const remainingMinutes = Math.floor(
                  job.remainingTime / (1000 * 60)
                );
                const remainingSeconds = Math.floor(
                  (job.remainingTime % (1000 * 60)) / 1000
                );
                const pendingMinutes = Math.floor(
                  job.pendingTime / (1000 * 60)
                );
                const pendingSeconds = Math.floor(
                  (job.pendingTime % (1000 * 60)) / 1000
                );

                return (
                  <Card key={job.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{job.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Job ID: {job.id}
                          </p>
                          {job.data?.taskId && (
                            <p className="text-sm text-muted-foreground">
                              Task ID: {job.data.taskId}
                            </p>
                          )}
                          {job.data?.title && (
                            <p className="text-sm text-muted-foreground">
                              Title: {job.data.title}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary">
                          {remainingMinutes > 0
                            ? `${remainingMinutes}m ${remainingSeconds}s`
                            : `${remainingSeconds}s`}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">
                            Timing Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Created:
                              </span>
                              <span>
                                {format(
                                  new Date(job.timestamp),
                                  "MMM dd, yyyy HH:mm:ss"
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Scheduled for:
                              </span>
                              <span>
                                {format(
                                  new Date(job.delayUntil),
                                  "MMM dd, yyyy HH:mm:ss"
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Delay Duration:
                              </span>
                              <span>
                                {pendingMinutes > 0
                                  ? `${pendingMinutes}m ${pendingSeconds}s`
                                  : `${pendingSeconds}s`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Remaining Time:
                              </span>
                              <span className="font-medium">
                                {remainingMinutes > 0
                                  ? `${remainingMinutes}m ${remainingSeconds}s`
                                  : `${remainingSeconds}s`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-2">Job Data</h4>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <pre className="text-xs text-gray-700 overflow-auto">
                              {JSON.stringify(job.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No delayed jobs found</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Queue Status Tab */}
        <TabsContent value="queue" className="space-y-6">
          <h2 className="text-xl font-semibold">Queue Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Jobs
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {queueStats?.totalJobs || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  All jobs in queue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waiting</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {queueStats?.waiting || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Jobs waiting to be processed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <Zap className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {queueStats?.active || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {queueStats?.completed || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Queue Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Queue Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {queueStats?.totalJobs
                      ? `${queueStats.completed}/${queueStats.totalJobs} (${(
                          (queueStats.completed / queueStats.totalJobs) *
                          100
                        ).toFixed(1)}%)`
                      : "N/A"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: queueStats?.totalJobs
                        ? `${
                            (queueStats.completed / queueStats.totalJobs) * 100
                          }%`
                        : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Monitor Tab */}
        <TabsContent value="health" className="space-y-6">
          <h2 className="text-xl font-semibold">
            SpeedyIndex API Health Monitor
          </h2>

          {healthLoading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              Checking API health...
            </div>
          ) : healthStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getStatusIcon(healthStatus.overall)}
                    <span>Overall Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusColor(healthStatus.overall)}>
                    {healthStatus.overall.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Last checked:{" "}
                    {format(
                      new Date(healthStatus.timestamp),
                      "MMM dd, yyyy HH:mm:ss"
                    )}
                  </p>
                </CardContent>
              </Card>

              {/* DNS Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Network className="w-5 h-5" />
                    <span>DNS Resolution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        healthStatus.dns.status === "resolved"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {healthStatus.dns.status}
                    </Badge>
                  </div>
                  {healthStatus.dns.error && (
                    <p className="text-sm text-red-600 mt-2">
                      {healthStatus.dns.error}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* API Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Server className="w-5 h-5" />
                    <span>API Connectivity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <Badge
                        variant={
                          healthStatus.api.status === "reachable"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {healthStatus.api.status}
                      </Badge>
                    </div>
                    {healthStatus.api.responseTime && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Response Time
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {healthStatus.api.responseTime}
                        </span>
                      </div>
                    )}
                    {healthStatus.api.error && (
                      <p className="text-sm text-red-600">
                        {healthStatus.api.error}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Health Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => refetchHealth()}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check Health Now
                  </Button>
                  {healthStatus.overall === "unhealthy" && (
                    <Button
                      onClick={handleBulkRetry}
                      disabled={bulkRetryMutation.isPending}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retry All Failed Jobs
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <p className="text-gray-600">Unable to fetch health status</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VipTaskManagement;
