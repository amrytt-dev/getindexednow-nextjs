import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  ChevronRight,
  Calendar,
  Code,
  AlertTriangle,
  Globe,
  Server,
  Clock,
  User,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ApiLog {
  id: string;
  endpoint: string;
  method: string;
  requestPayload: any;
  errorMessage: string;
  stackTrace?: string;
  timestamp: string;
  statusCode?: number;
  userId?: string;
  isThirdParty: boolean;
  userAgent?: string;
  ipAddress?: string;
  responseTime?: number;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

interface ApiLogStats {
  totalLogs: number;
  internalLogs: number;
  thirdPartyLogs: number;
  statusCodeDistribution: Array<{
    statusCode: number;
    count: number;
  }>;
  topEndpoints: Array<{
    endpoint: string;
    count: number;
  }>;
}

interface ApiLogsResponse {
  code: number;
  result: {
    logs: ApiLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const getStatusColor = (statusCode: number) => {
  if (statusCode >= 500) return 'text-red-500';
  if (statusCode >= 400) return 'text-orange-500';
  if (statusCode >= 300) return 'text-blue-500';
  return 'text-green-500';
};

const getMethodColor = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET': return 'bg-blue-100 text-blue-800 ';
    case 'POST': return 'bg-green-100 text-green-800 ';
    case 'PUT': return 'bg-yellow-100 text-yellow-800 ';
    case 'DELETE': return 'bg-red-100 text-red-800 ';
    default: return 'bg-gray-100 text-gray-800 ';
  }
};

export default function ApiLogs() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [stats, setStats] = useState<ApiLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  
  // Filters
  const [apiType, setApiType] = useState<'all' | 'internal' | 'third-party'>('all');
  const [statusCode, setStatusCode] = useState<string>('all');
  const [endpoint, setEndpoint] = useState('');
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  } | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { toast } = useToast();
  const backendBaseUrl = import.meta.env.VITE_API_URL || '';

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
        apiType,
        ...(statusCode && statusCode !== 'all' && { statusCode }),
        ...(endpoint && { endpoint }),
        ...(dateRange?.from && { startDate: dateRange.from.toISOString() }),
        ...(dateRange?.to && { endDate: dateRange.to.toISOString() }),
      });

      const response = await fetch(`${backendBaseUrl}/api/admin/api-logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch API logs');
      }

      const data: ApiLogsResponse = await response.json();
      
      if (data.code === 0) {
        setLogs(data.result.logs);
        setTotalPages(data.result.pagination.totalPages);
        setTotalLogs(data.result.pagination.total);
      } else {
        throw new Error('Failed to fetch API logs');
      }
    } catch (error) {
      console.error('Error fetching API logs:', error);
      toast({
        title: "Error",
        description: "Failed to load API logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (dateRange?.from) params.append('startDate', dateRange.from.toISOString());
      if (dateRange?.to) params.append('endDate', dateRange.to.toISOString());

      const response = await fetch(`${backendBaseUrl}/api/admin/api-logs/stats?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch API logs stats');
      }

      const data = await response.json();
      
      if (data.code === 0) {
        setStats(data.result);
      }
    } catch (error) {
      console.error('Error fetching API logs stats:', error);
    }
  };

  const deleteOldLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendBaseUrl}/api/admin/api-logs/cleanup`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ daysOld: 30 }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete old logs');
      }

      const data = await response.json();
      
      if (data.code === 0) {
        toast({
          title: "Success",
          description: data.result.message,
        });
        fetchLogs();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting old logs:', error);
      toast({
        title: "Error",
        description: "Failed to delete old logs",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [currentPage, apiType, statusCode, endpoint, dateRange]);

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Endpoint', 'Method', 'Status Code', 'Error Message', 'User', 'Third Party', 'Response Time'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        `"${log.endpoint}"`,
        log.method,
        log.statusCode || '',
        `"${log.errorMessage.replace(/"/g, '""')}"`,
        log.user?.email || '',
        log.isThirdParty ? 'Yes' : 'No',
        log.responseTime || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatJson = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 ">API Logs</h1>
            <p className="text-gray-600 ">Monitor and debug API failures</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 ">API Logs</h1>
          <p className="text-gray-600 ">Monitor and debug API failures</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchLogs} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={deleteOldLogs} variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Cleanup
          </Button>
          <Button onClick={exportToCSV} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.totalLogs}</div>
              <p className="text-xs text-muted-foreground">Total API failures</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Internal APIs</CardTitle>
              <Server className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.internalLogs}</div>
              <p className="text-xs text-muted-foreground">Internal API failures</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Third-Party APIs</CardTitle>
              <Globe className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.thirdPartyLogs}</div>
              <p className="text-xs text-muted-foreground">Third-party API failures</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Status Code</CardTitle>
              <Code className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.statusCodeDistribution[0]?.statusCode || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.statusCodeDistribution[0]?.count || 0} occurrences
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search endpoint..."
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={apiType} onValueChange={(value: 'all' | 'internal' | 'third-party') => setApiType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="API Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All APIs</SelectItem>
                <SelectItem value="internal">Internal APIs</SelectItem>
                <SelectItem value="third-party">Third-Party APIs</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusCode} onValueChange={setStatusCode}>
              <SelectTrigger>
                <SelectValue placeholder="Status Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status Codes</SelectItem>
                <SelectItem value="400">400 - Bad Request</SelectItem>
                <SelectItem value="401">401 - Unauthorized</SelectItem>
                <SelectItem value="403">403 - Forbidden</SelectItem>
                <SelectItem value="404">404 - Not Found</SelectItem>
                <SelectItem value="500">500 - Internal Server Error</SelectItem>
                <SelectItem value="502">502 - Bad Gateway</SelectItem>
                <SelectItem value="503">503 - Service Unavailable</SelectItem>
              </SelectContent>
            </Select>

            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Button 
              onClick={() => {
                setApiType('all');
                setStatusCode('');
                setEndpoint('');
                setDateRange({
                  from: addDays(new Date(), -7),
                  to: new Date(),
                });
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span>API Failure Logs</span>
            <Badge variant="secondary">{totalLogs} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => {
              const isExpanded = expandedLogs.has(log.id);
              
              return (
                <div key={log.id} className="border border-gray-200  rounded-lg overflow-hidden">   
                  {/* Log Header */}
                  <div className="bg-gray-50  p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLogExpansion(log.id)}
                          className="h-8 w-8 p-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getMethodColor(log.method)}>
                            {log.method}
                          </Badge>
                          {log.statusCode && (
                            <Badge variant="outline" className={getStatusColor(log.statusCode)}>
                              {log.statusCode}
                            </Badge>
                          )}
                          {log.isThirdParty && (
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 ">
                              Third-Party
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600 ">
                          <Clock className="w-4 h-4" />
                          <span>{format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600 ">
                        {log.user && (
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{log.user.email}</span>
                          </div>
                        )}
                        {log.responseTime && (
                          <span>{log.responseTime}ms</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="text-sm font-mono text-gray-900  break-all">
                        {log.endpoint}
                      </div>
                      <div className="text-sm text-red-600  mt-1">
                        {log.errorMessage}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="bg-gray-900 text-gray-100 p-4 font-mono text-sm">
                      <div className="space-y-4">
                        {/* Request Payload */}
                        {log.requestPayload && (
                          <div>
                            <div className="text-gray-400 mb-2">Request Payload:</div>
                            <pre className="bg-gray-800 p-3 rounded overflow-x-auto">
                              <code>{formatJson(log.requestPayload)}</code>
                            </pre>
                          </div>
                        )}
                        
                        {/* Stack Trace */}
                        {log.stackTrace && (
                          <div>
                            <div className="text-gray-400 mb-2">Stack Trace:</div>
                            <pre className="bg-gray-800 p-3 rounded overflow-x-auto">
                              <code className="text-red-400">{log.stackTrace}</code>
                            </pre>
                          </div>
                        )}
                        
                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {log.userAgent && (
                            <div>
                              <span className="text-gray-400">User Agent:</span>
                              <div className="text-gray-300 break-all">{log.userAgent}</div>
                            </div>
                          )}
                          {log.ipAddress && (
                            <div>
                              <span className="text-gray-400">IP Address:</span>
                              <div className="text-gray-300">{log.ipAddress}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 ">
                Showing page {currentPage} of {totalPages} ({totalLogs} total logs)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 ">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
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