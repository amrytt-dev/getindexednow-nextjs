import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Task {
  id: string;
  title: string;
  type: string;
  status: string;
  link_count: number;
  processed_count: number;
  indexed_count: number;
  vipQueue: boolean;
  credits_used: number;
  created_at: string;
  completed_at: string | null;
  speedy_task_id: string;
  size: number;
  creditUsage: number;
  report_status?: string | null;
}

interface TaskLink {
  id: string;
  url: string;
  title: string | null;
  is_indexed: boolean;
  error_code: string | null;
  created_at: string;
}

interface TaskDetailsProps {
  task: Task;
  onBack: () => void;
}

const LINKS_PER_PAGE = 10;

export const TaskDetails = ({ task, onBack }: TaskDetailsProps) => {
  const [updating, setUpdating] = useState(false);
  const [taskData, setTaskData] = useState(task);
  const [taskLinks, setTaskLinks] = useState<TaskLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTaskLinks();
  }, [taskData.id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [taskLinks]);

  const fetchTaskLinks = async () => {
    setLoadingLinks(true);
    try {
      // Mock task links data since Supabase is removed
      const mockLinks: TaskLink[] = [
        {
          id: 'link-1',
          url: 'https://example.com/page1',
          title: 'Example Page 1',
          is_indexed: true,
          error_code: null,
          created_at: new Date().toISOString()
        },
        {
          id: 'link-2',
          url: 'https://example.com/page2',
          title: 'Example Page 2',
          is_indexed: false,
          error_code: '404',
          created_at: new Date().toISOString()
        }
      ];
      
      setTaskLinks(mockLinks);
    } catch (error) {
      console.error('Error fetching task links:', error);
      toast({
        title: "Error loading task links",
        description: "Please implement your own backend API.",
        variant: "destructive",
      });
    } finally {
      setLoadingLinks(false);
    }
  };

  const updateTaskStatus = async () => {
    setUpdating(true);
    
    try {
      toast({
        title: "Status updated",
        description: "Task status has been refreshed (mock data)",
      });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Please implement your own backend API.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckOnGoogle = (url: string) => {
    const googleSearchUrl = `https://www.google.com/search?q=site:${encodeURIComponent(url)}`;
    window.open(googleSearchUrl, '_blank');
  };

  const getStatusColor = () => {
    switch (taskData.status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200 ';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200 ';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200 ';
    }
  };

  const getStatusEmoji = () => {
    switch (taskData.status) {
      case 'completed':
        return '✅';
      case 'processing':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '⏸️';
    }
  };

  const progressPercentage = taskData.link_count > 0 
    ? Math.round((taskData.processed_count / taskData.link_count) * 100)
    : 0;

  const indexingPercentage = taskData.processed_count > 0
    ? Math.round((taskData.indexed_count / taskData.processed_count) * 100)
    : 0;

  const hasReport = taskData.status === 'completed' && taskData.report_status === 'available';

  const totalPages = Math.ceil(taskLinks.length / LINKS_PER_PAGE);
  const startIndex = (currentPage - 1) * LINKS_PER_PAGE;
  const endIndex = startIndex + LINKS_PER_PAGE;
  const paginatedLinks = taskLinks.slice(startIndex, endIndex);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <div className="container mx-auto py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="bg-white/80 backdrop-blur-md"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">{taskData.type === 'indexer' ? '🚀' : '🔍'}</span>
                <h1 className="text-2xl font-bold text-gray-900">{taskData.title}</h1>
              </div>
              <div className="flex items-center space-x-3 mt-1">
                <Badge className={`${getStatusColor()} text-sm px-3 py-1`}>
                  {getStatusEmoji()} {taskData.status}
                </Badge>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={updateTaskStatus}
            disabled={updating}
            className="bg-white/80 backdrop-blur-md"
          >
            {updating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Status
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">📊 Total URLs</div>
              <div className="text-2xl font-bold text-gray-900">{taskData.link_count.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">⚙️ Processed</div>
              <div className="text-2xl font-bold text-blue-600">{taskData.processed_count.toLocaleString()}</div>
              <Progress value={progressPercentage} className="mt-2 h-2 [&>div]:bg-green-500" />
              <p className="text-xs text-gray-500 mt-1">📈 {progressPercentage}% complete</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">
                {taskData.type === 'indexer' ? '✅ Indexed' : '🔍 Found Indexed'}
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {hasReport ? taskData.indexed_count.toLocaleString() : '⏳'}
              </div>
              {hasReport && taskData.processed_count > 0 && (
                <>
                  <Progress value={indexingPercentage} className="mt-2 h-2 [&>div]:bg-green-500" />
                  <p className="text-xs text-gray-500 mt-1">📊 {indexingPercentage}% indexed</p>
                </>
              )}
              {!hasReport && (
                <p className="text-xs text-gray-500 mt-1">📋 Awaiting report</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">💰 Credits Used</div>
              <div className="text-2xl font-bold text-amber-600">{taskData.credits_used.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-2">
                🕒 Created {format(new Date(taskData.created_at), 'MMM d, yyyy')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Links */}
        <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <span>🔗</span>
              <span>Submitted URLs</span>
            </CardTitle>
            <CardDescription className="text-gray-600 flex items-center justify-between">
              <span>
                {taskLinks.length > 0 ? `${taskLinks.length} URLs submitted for processing` : 'No URLs found'}
              </span>
              {taskLinks.length > LINKS_PER_PAGE && (
                <span className="text-sm text-gray-500">
                  Showing {startIndex + 1}-{Math.min(endIndex, taskLinks.length)} of {taskLinks.length}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {loadingLinks ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-4" />
                <p className="text-gray-600">⏳ Loading URLs...</p>
              </div>
            ) : taskLinks.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">❌ No URLs found for this task</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 w-[40%]">🔗 URL</TableHead>
                        <TableHead className="font-semibold text-gray-700 w-[120px]">📊 Status</TableHead>
                        <TableHead className="font-semibold text-gray-700 w-[30%]">📝 Title</TableHead>
                        <TableHead className="font-semibold text-gray-700 w-[80px]">⚠️ Error</TableHead>
                        <TableHead className="font-semibold text-gray-700  w-[140px]">🔧 Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedLinks.map((link) => (
                        <TableRow key={link.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 truncate block"
                                title={link.url}
                              >
                                {link.url}
                              </a>
                            </div>
                          </TableCell>
                          <TableCell>
                            {hasReport ? (
                              <Badge 
                                className={`whitespace-nowrap ${link.is_indexed 
                                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                  : 'bg-gray-100 text-gray-700 border-gray-200'
                                }`}
                              >
                                {link.is_indexed ? '✅ Indexed' : '❌ Not Indexed'}
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 whitespace-nowrap">
                                ⏳ Processing
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            <div className="truncate" title={hasReport ? (link.title || 'No title') : 'Processing...'}>
                              {hasReport ? (link.title || 'No title') : '⏳ Processing...'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {hasReport && link.error_code ? (
                              <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 whitespace-nowrap text-xs">
                                {link.error_code}
                              </Badge>
                            ) : (
                              <span className="text-gray-400 text-sm">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCheckOnGoogle(link.url)}
                              className="flex items-center space-x-1 text-sm whitespace-nowrap"
                            >
                              <span>🔍</span>
                              <span>Check on Google</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={handlePrevious}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={handleNext}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
