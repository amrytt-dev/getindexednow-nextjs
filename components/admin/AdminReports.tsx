import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  ChevronRight,
  Eye,
  Calendar,
  Users,
  Globe,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays, format } from 'date-fns';

// Mock data structure
interface URLData {
  id: string;
  url: string;
  taskType: 'indexer' | 'checker';
  status: 'pending' | 'in_progress' | 'completed';
  submissionDate: string;
}

interface UserReport {
  id: string;
  name: string;
  email: string;
  totalUrls: number;
  indexerCount: number;
  checkerCount: number;
  lastSubmissionDate: string;
  urls: URLData[];
}

// Mock data
const mockUsers: UserReport[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    totalUrls: 45,
    indexerCount: 30,
    checkerCount: 15,
    lastSubmissionDate: '2024-01-15',
    urls: [
      { id: '1', url: 'https://example1.com', taskType: 'indexer', status: 'completed', submissionDate: '2024-01-15' },
      { id: '2', url: 'https://example2.com', taskType: 'checker', status: 'pending', submissionDate: '2024-01-14' },
      { id: '3', url: 'https://example3.com', taskType: 'indexer', status: 'in_progress', submissionDate: '2024-01-13' },
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    totalUrls: 28,
    indexerCount: 18,
    checkerCount: 10,
    lastSubmissionDate: '2024-01-14',
    urls: [
      { id: '4', url: 'https://example4.com', taskType: 'indexer', status: 'completed', submissionDate: '2024-01-14' },
      { id: '5', url: 'https://example5.com', taskType: 'checker', status: 'completed', submissionDate: '2024-01-13' },
    ]
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    totalUrls: 67,
    indexerCount: 42,
    checkerCount: 25,
    lastSubmissionDate: '2024-01-15',
    urls: [
      { id: '6', url: 'https://example6.com', taskType: 'indexer', status: 'completed', submissionDate: '2024-01-15' },
      { id: '7', url: 'https://example7.com', taskType: 'checker', status: 'completed', submissionDate: '2024-01-14' },
      { id: '8', url: 'https://example8.com', taskType: 'indexer', status: 'pending', submissionDate: '2024-01-13' },
    ]
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'in_progress':
      return <Clock className="w-4 h-4 text-blue-500" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'pending':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  const statusMap = {
    completed: { label: 'Completed', variant: 'default' as const, className: 'bg-green-100 text-green-800 ' },
    in_progress: { label: 'In Progress', variant: 'default' as const, className: 'bg-blue-100 text-blue-800 ' },
    failed: { label: 'Failed', variant: 'destructive' as const, className: 'bg-red-100 text-red-800 ' },
    pending: { label: 'Pending', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 ' },
  };
  
  const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
  
  return (
    <Badge variant={statusInfo.variant} className={statusInfo.className}>
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

export default function AdminReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  } | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const itemsPerPage = 10;

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalIndexer = mockUsers.reduce((sum, user) => sum + user.indexerCount, 0);
    const totalChecker = mockUsers.reduce((sum, user) => sum + user.checkerCount, 0);
    return { totalIndexer, totalChecker };
  }, []);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTaskType = selectedTaskType === 'all' || 
        (selectedTaskType === 'indexer' && user.indexerCount > 0) ||
        (selectedTaskType === 'checker' && user.checkerCount > 0);
      
      return matchesSearch && matchesTaskType;
    });
  }, [searchTerm, selectedTaskType]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle user expansion
  const toggleUserExpansion = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  // Filter URLs for a user based on selected filters
  const getFilteredUrls = (urls: URLData[]) => {
    return urls.filter(url => {
      const matchesTaskType = selectedTaskType === 'all' || url.taskType === selectedTaskType;
      const matchesStatus = selectedStatus === 'all' || url.status === selectedStatus;
      return matchesTaskType && matchesStatus;
    });
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ['User Name', 'Email', 'Total URLs', 'Indexer Count', 'Checker Count', 'Last Submission Date'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.totalUrls,
        user.indexerCount,
        user.checkerCount,
        user.lastSubmissionDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 ">Reports</h1>
          <p className="text-gray-600 ">View and analyze user submission data</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indexer Tasks</CardTitle>
            <Globe className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{summaryStats.totalIndexer}</div>
            <p className="text-xs text-muted-foreground">Total URLs submitted for indexing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checker Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{summaryStats.totalChecker}</div>
            <p className="text-xs text-muted-foreground">Total URLs submitted for checking</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 ">
                {dateRange?.from ? format(dateRange.from, 'MMM dd') : 'Start'} - {dateRange?.to ? format(dateRange.to, 'MMM dd, yyyy') : 'End'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>User Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>User Name / Email</TableHead>
                  <TableHead>Total URLs</TableHead>
                  <TableHead>Indexer Count</TableHead>
                  <TableHead>Checker Count</TableHead>
                  <TableHead>Last Submission</TableHead>
                  <TableHead className="w-20">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => {
                  const isExpanded = expandedUsers.has(user.id);
                  const filteredUrls = getFilteredUrls(user.urls);
                  
                  return (
                    <React.Fragment key={user.id}>
                      <TableRow>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserExpansion(user.id)}
                            className="h-8 w-8 p-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.totalUrls}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 ">
                            {user.indexerCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 ">
                            {user.checkerCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600 ">
                            {format(new Date(user.lastSubmissionDate), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserExpansion(user.id)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View URLs</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded URL Details */}
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={7} className="p-0">
                            <div className="bg-gray-50 p-4">
                              <div className="mb-4">
                                <h4 className="font-medium text-gray-900  mb-2">
                                  URLs for {user.name}
                                </h4>
                                {filteredUrls.length === 0 ? (
                                  <p className="text-gray-500 ">No URLs match the current filters.</p>
                                ) : (
                                  <div className="rounded-md border">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>URL</TableHead>
                                          <TableHead>Task Type</TableHead>
                                          <TableHead>Status</TableHead>
                                          <TableHead>Submission Date</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {filteredUrls.map((url) => (
                                          <TableRow key={url.id}>
                                            <TableCell className="font-mono text-sm">
                                              {url.url}
                                            </TableCell>
                                            <TableCell>
                                              {getTaskTypeBadge(url.taskType)}
                                            </TableCell>
                                            <TableCell>
                                              <div className="flex items-center space-x-2">
                                                {getStatusIcon(url.status)}
                                                {getStatusBadge(url.status)}
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              {format(new Date(url.submissionDate), 'MMM dd, yyyy HH:mm')}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600 ">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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