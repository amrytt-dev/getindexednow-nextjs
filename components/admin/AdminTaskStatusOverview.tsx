import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Download, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays, format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// Task data structure from API
interface TaskData {
  id: string;
  userId: string;
  createdAt: string;
  status: string;
  taskType: string;
  speedyType: string;
  speedyTaskId: string;
  subtaskId?: string;
  title: string | null;
  vipQueue: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  };
  urls: Array<{
    url: string;
    isIndexed: boolean;
    title: string | null;
    error_code: string | null;
  }>;
  urlCount: number;
  processedCount: number;
  indexedUrlCount: number;
  submissionDate: string | null;
  processingTime: number | null;
  totalCredits: number;
  heldCredits: number;
  usedCredits: number;
  creditsPerUrl: number;
  hasSubtasks?: boolean;
}

// Mock data structure for task status overview (legacy)
interface TaskStatusData {
  id: string;
  taskType: 'indexer' | 'checker';
  status: 'pending' | 'in_progress' | 'completed';
  url: string;
  userEmail: string;
  userName: string;
  submissionDate: string;
  completionDate?: string;
  processingTime?: number; // in minutes
}

interface StatusSummary {
  pending: number;
  in_progress: number;
  completed: number;
  failed: number;
  total: number;
}


const getStatusBadge = (status: string) => {
  const statusMap = {
    completed: { label: 'Completed', className: 'bg-green-100 text-green-800 ' },
    processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800 ' },
    failed: { label: 'Failed', className: 'bg-red-100 text-red-800 ' },
  };
  
  const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.processing;
  
  return (
    <Badge variant="outline" className={statusInfo.className}>
      {statusInfo.label}
    </Badge>
  );
};

const getTaskTypeBadge = (taskType: string) => {
  const typeMap = {
    indexer: { label: 'Indexer', className: 'bg-purple-100 text-purple-800 ' },
    checker: { label: 'Checker', className: 'bg-orange-100 text-orange-800 ' },
  };
  
  const typeInfo = typeMap[taskType as keyof typeof typeMap] || typeMap.indexer;
  
  return (
    <Badge variant="outline" className={typeInfo.className}>
      {typeInfo.label}
    </Badge>
  );
};

// API functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const fetchSummaryMetrics = async (params: { startDate?: string; endDate?: string }) => {
  const queryParams = new URLSearchParams();
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  
  const response = await fetch(`${API_BASE_URL}/api/admin/reports/task-status-overview/summary?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) throw new Error('Failed to fetch summary metrics');
  const data = await response.json();
  return data.result;
};

const fetchStatusDistribution = async (params: { startDate?: string; endDate?: string }) => {
  const queryParams = new URLSearchParams();
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  
  const response = await fetch(`${API_BASE_URL}/api/admin/reports/task-status-overview/status-distribution?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) throw new Error('Failed to fetch status distribution');
  const data = await response.json();
  return data.result;
};

const fetchFilteredTasks = async (params: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  taskType?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  
  const response = await fetch(`${API_BASE_URL}/api/admin/reports/task-status-overview/tasks?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) throw new Error('Failed to fetch tasks');
  const data = await response.json();
  return data.result;
};



export default function AdminTaskStatusOverview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  } | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [expandedTaskTypeFilter, setExpandedTaskTypeFilter] = useState<'all' | 'indexer' | 'checker'>('all');
  const [expandedTaskUrls, setExpandedTaskUrls] = useState<Record<string, any[]>>({});
  const [expandedTaskTitles, setExpandedTaskTitles] = useState<Record<string, string>>({});
  const [expandedTaskDetails, setExpandedTaskDetails] = useState<Record<string, {
    vipQueue: boolean;
    totalCredits: number;
    heldCredits: number;
    usedCredits: number;
    creditsPerUrl: number;
    hasSubtasks?: boolean;
    speedyTaskId?: string;
    subtaskId?: string;
    title?: string | null;
    urls?: any[];
  }>>({});

  const itemsPerPage = 10;

  // API queries
  const { data: summaryMetrics, isLoading: summaryLoading } = useQuery({
    queryKey: ['taskStatusSummary', dateRange],
    queryFn: () => fetchSummaryMetrics({
      startDate: dateRange?.from?.toISOString(),
      endDate: dateRange?.to?.toISOString()
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: statusDistribution, isLoading: statusLoading } = useQuery({
    queryKey: ['taskStatusDistribution', dateRange],
    queryFn: () => fetchStatusDistribution({
      startDate: dateRange?.from?.toISOString(),
      endDate: dateRange?.to?.toISOString()
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['filteredTasks', currentPage, selectedTaskType, selectedStatus, searchTerm, dateRange],
    queryFn: () => fetchFilteredTasks({
      page: currentPage,
      limit: itemsPerPage,
      startDate: dateRange?.from?.toISOString(),
      endDate: dateRange?.to?.toISOString(),
      taskType: selectedTaskType !== 'all' ? selectedTaskType : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      search: searchTerm || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Use real data or fallback to mock data
  const summaryStats = summaryMetrics || {
    totalTasks: 0,
    successRate: 0,
    avgProcessingTime: 0,
    processingTasks: 0,
    completedTasks: 0
  };

  const statusStats = statusDistribution || {
    processing: 0,
    completed: 0
  };

  const tasks: TaskData[] = tasksData?.tasks || [];
  const pagination = tasksData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  };

  // Performance metrics are now coming from the API
  const performanceMetrics = {
    avgProcessingTime: summaryStats.avgProcessingTime,
    successRate: summaryStats.successRate,
    totalCompleted: summaryStats.completedTasks,
    totalProcessing: summaryStats.processingTasks
  };

  // Tasks are now fetched from API with filtering applied on the backend

  // CSV Export with detailed URL data
  const exportToCSV = async () => {
    // Show loading state
    const exportButton = document.querySelector('[data-export-csv]') as HTMLButtonElement;
    const originalText = exportButton?.innerHTML;
    if (exportButton) {
      exportButton.disabled = true;
      exportButton.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Exporting...';
    }

    try {
      // Use URL data directly from the main response
      const tasksWithUrls = tasks.map((task) => {
                    return {
              // Use all fields from the main task
              id: task.id,
              taskType: task.taskType,
              status: task.status,
              title: task.title,
              user: task.user,
              submissionDate: task.submissionDate,
              processingTime: task.processingTime,
              totalCredits: task.totalCredits,
              vipQueue: task.vipQueue,
              urlCount: task.urlCount,
              processedCount: task.processedCount,
              indexedUrlCount: task.indexedUrlCount,
              hasSubtasks: task.hasSubtasks,
              // Use URLs from the main response
              urls: task.urls || []
            };
      });

      // Create CSV content with detailed URL data
      const headers = [
        'Task ID', 
        'Task Type', 
        'Status', 
        'Task Title',
        'User Name', 
        'User Email', 
        'Submission Date', 
        'Processing Time',
        'VIP Status',
        'Has Subtasks',
        'Total Credits',
        'URL Count (Indexed/Total)',
        'Processed Count',
        'URL',
        'URL Title',
        'Is Indexed',
        'Error Code'
      ];

      const csvRows = [];
      csvRows.push(headers.join(','));

      // Add a row for each URL of each task
      tasksWithUrls.forEach(task => {
        // Format processing time correctly - ensure we're accessing the right field
        const processingTimeMinutes = task.processingTime || null;
        const processingTime = processingTimeMinutes ? (
          processingTimeMinutes >= 60 
            ? `${(processingTimeMinutes / 60).toFixed(1)}h` 
            : `${processingTimeMinutes}m`
        ) : 'N/A';

        // Format submission date correctly - ensure we're accessing the right field
        const submissionDate = task.submissionDate ? 
          format(new Date(task.submissionDate), 'MMMM-dd-yyyy HH:mm') : '';
        


        const vipStatus = task.vipQueue ? 'VIP' : 'Standard';
        const hasSubtasks = task.hasSubtasks ? 'Yes' : 'No';

        if (task.urls.length === 0) {
          // If no URLs, add a row with task info but empty URL fields
                      const csvRow = [
              task.id,
              task.taskType,
              task.urlCount > 0 && task.processedCount === task.urlCount ? 'Completed' : task.status,
              `"${task.title || ''}"`,
              `"${task.user.name}"`,
              task.user.email,
              submissionDate,
              processingTime,
              vipStatus,
              hasSubtasks,
              task.totalCredits || 0,
              task.indexedUrlCount !== undefined ? `${task.indexedUrlCount}/${task.urlCount}` : task.urlCount,
              task.processedCount,
              '',
              '',
              '',
              ''
            ];
          

          
          csvRows.push(csvRow.join(','));
        } else {
          // Add a row for each URL
          task.urls.forEach(url => {
            const csvRow = [
              task.id,
              task.taskType,
              task.urlCount > 0 && task.processedCount === task.urlCount ? 'Completed' : task.status,
              `"${task.title || ''}"`,
              `"${task.user.name}"`,
              task.user.email,
              submissionDate,
              processingTime,
              vipStatus,
              hasSubtasks,
              task.totalCredits || 0,
              task.indexedUrlCount !== undefined ? `${task.indexedUrlCount}/${task.urlCount}` : task.urlCount,
              task.processedCount,
              `"${url.url}"`,
              `"${url.title || ''}"`,
              url.isIndexed ? 'Yes' : 'No',
              url.error_code || ''
            ];
            

            
            csvRows.push(csvRow.join(','));
          });
        }
      });

      const csvContent = csvRows.join('\n');

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `task-status-overview-detailed-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      // Restore button state
      if (exportButton) {
        exportButton.disabled = false;
        exportButton.innerHTML = originalText || '<Download className="w-4 h-4" /><span>Export CSV</span>';
      }
    }
  };

  // Handle task expansion - now uses data from main response
  const handleExpandTask = async (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
      return;
    }
    
    setExpandedTaskId(taskId);
    
    // Get task data from the main response
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setExpandedTaskUrls(prev => ({ ...prev, [taskId]: task.urls }));
      setExpandedTaskTitles(prev => ({ ...prev, [taskId]: task.title }));
      setExpandedTaskDetails(prev => ({ 
        ...prev, 
        [taskId]: {
          title: task.title,
          urls: task.urls,
          totalCredits: task.totalCredits,
          heldCredits: task.heldCredits,
          usedCredits: task.usedCredits,
          creditsPerUrl: task.creditsPerUrl,
          vipQueue: task.vipQueue,
          hasSubtasks: task.hasSubtasks,
          speedyTaskId: task.speedyTaskId,
          subtaskId: task.subtaskId
        }
      }));
    }
  };

  // Filter URLs by task type in expanded view
  const getFilteredUrls = (taskId: string) => {
    return expandedTaskUrls[taskId] || [];
  };

  // Reset all filters to default values
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTaskType('all');
    setSelectedStatus('all');
    setDateRange({
      from: addDays(new Date(), -7),
      to: new Date(),
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 ">Task Status Overview</h1>
          <p className="text-gray-600 ">Monitor and analyze task processing status</p>
        </div>
        <Button 
          onClick={exportToCSV} 
          className="flex items-center space-x-2"
          data-export-csv
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summaryStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">All submitted tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{performanceMetrics.successRate}%</div>
            <p className="text-xs text-muted-foreground">Completed successfully</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {performanceMetrics.avgProcessingTime >= 60 
                ? `${(performanceMetrics.avgProcessingTime / 60).toFixed(1)}h` 
                : `${performanceMetrics.avgProcessingTime}m`}
            </div>
            <p className="text-xs text-muted-foreground">Average completion time</p>
          </CardContent>
        </Card>

        {/* Processing Tasks card hidden for now
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Tasks</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{performanceMetrics.totalProcessing}</div>
            <p className="text-xs text-muted-foreground">Currently being processed</p>
          </CardContent>
        </Card>
        */}
      </div>

      {/* Status Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Processing</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-2">{statusStats.processing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mt-2">{statusStats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by task name, URLs, or user email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedTaskType} onValueChange={setSelectedTaskType}>
              <SelectTrigger>
                <SelectValue placeholder="Task Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="indexer">Indexer</SelectItem>
                <SelectItem value="checker">Checker</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange.from && !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                        {format(dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
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
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({
                        from: range.from,
                        to: range.to
                      });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Task Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name & User</TableHead>
                  <TableHead>Task Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>URL Count (Indexed/Total)</TableHead>
                  <TableHead>Total Credits</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Processing Time</TableHead>
                  <TableHead></TableHead> {/* For expand/collapse button */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasksLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Loading tasks...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No tasks found matching the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <React.Fragment key={task.id}>
                      <TableRow>
                        <TableCell>
                          <div>
                            <div className="font-medium text-blue-700 ">{task.title || '-'}</div>
                            <div className="mt-1 text-xs text-gray-700 ">{task.user.name}</div>
                            <div className="text-xs text-gray-400">{task.user.email}</div>
                            {task.hasSubtasks && (
                              <Badge className="bg-gray-100 text-gray-600 text-xs px-1 py-0.5 text-[10px] mt-1">
                                Has Subtasks
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getTaskTypeBadge(task.taskType)}</TableCell>
                        <TableCell>
                          {getStatusBadge(task.status)}
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline">
                                {task.indexedUrlCount !== undefined ? `${task.indexedUrlCount}/${task.urlCount}` : task.urlCount}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              {task.indexedUrlCount !== undefined 
                                ? `${task.indexedUrlCount} indexed out of ${task.urlCount} total URLs`
                                : `${task.urlCount} total URLs`
                              }
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        {/* VIP badge and Total Credits columns */}
                        <TableCell>
                          {task.totalCredits > 0 ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-pointer underline decoration-dotted">{task.totalCredits}</span>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <div style={{ whiteSpace: 'pre-line' }}>
                                  {`Total: ${task.totalCredits}\nHeld: ${task.heldCredits}\nUsed: ${task.usedCredits}\nPer URL: ${task.creditsPerUrl}`}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>{task.submissionDate ? format(new Date(task.submissionDate), 'MMM dd, yyyy HH:mm') : '-'}</TableCell>
                        <TableCell>
                          {task.processingTime ? (
                            task.processingTime >= 60 
                              ? `${(task.processingTime / 60).toFixed(1)}h` 
                              : `${task.processingTime}m`
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <button onClick={() => handleExpandTask(task.id)} className="focus:outline-none">
                            {expandedTaskId === task.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </TableCell>
                      </TableRow>
                      {/* Expanded row: show credits info and VIP badge above the URLs table */}
                      {expandedTaskId === task.id && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-gray-50 p-4">
                            <div className="mb-2 font-semibold text-base text-blue-700 ">
                              Submitted URLs
                              {expandedTaskDetails[task.id]?.vipQueue && (
                                <Badge className="ml-2 bg-yellow-200 text-yellow-800 ">VIP</Badge>
                              )}
                            </div>
                            {/* Credits info */}
                            <div className="mb-4 flex flex-wrap gap-4 text-xs">
                              <span>Total Credits: <b>{expandedTaskDetails[task.id]?.totalCredits ?? '-'}</b></span>
                              <span>Held Credits: <b>{expandedTaskDetails[task.id]?.heldCredits ?? '-'}</b></span>
                              <span>Used Credits: <b>{expandedTaskDetails[task.id]?.usedCredits ?? '-'}</b></span>
                            </div>
                            {/* Task IDs info */}
                            <div className="mb-4 flex flex-wrap gap-4 text-xs items-center">
                              {expandedTaskDetails[task.id]?.hasSubtasks ? (
                                <>
                                  <span>Indexer Task ID: <b className="font-mono">{expandedTaskDetails[task.id]?.subtaskId ?? '-'}</b></span>
                                  <Badge className="bg-orange-100 text-orange-800 text-xs">Has Subtasks</Badge>
                                </>
                              ) : (
                                <span>Checker Task ID: <b className="font-mono">{expandedTaskDetails[task.id]?.speedyTaskId ?? '-'}</b></span>
                              )}
                            </div>
                            {getFilteredUrls(task.id).length === 0 ? (
                              <div className="py-8 text-center text-gray-500">No URLs found for this task.</div>
                            ) : (
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>URL</TableHead>
                                      <TableHead>Title</TableHead>
                                      <TableHead>Is Indexed</TableHead>
                                      <TableHead>Error</TableHead>
                                      <TableHead>Check on Google</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {getFilteredUrls(task.id).map((url, idx) => (
                                      <TableRow key={url.url + idx}>
                                        <TableCell className="font-mono text-xs max-w-xs truncate">{url.url}</TableCell>
                                        <TableCell className="text-xs">{url.title || '-'}</TableCell>
                                        <TableCell>
                                          {url.isIndexed ? (
                                            <Badge className="bg-green-100 text-green-800 ">Indexed</Badge>
                                          ) : (
                                            <Badge className="bg-yellow-100 text-yellow-800 ">Not Indexed</Badge>
                                          )}
                                        </TableCell>
                                        <TableCell className="text-xs">{url.error_code || '-'}</TableCell>
                                        <TableCell className="text-xs">
                                          <a
                                            href={`https://www.google.com/search?q=${encodeURIComponent(url.url)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline hover:text-blue-800"
                                          >
                                            Search
                                          </a>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          </TooltipProvider>
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600 ">
                Showing {((pagination.currentPage - 1) * itemsPerPage) + 1} to {Math.min(pagination.currentPage * itemsPerPage, pagination.totalCount)} of {pagination.totalCount} tasks
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 ">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 