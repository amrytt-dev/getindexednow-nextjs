import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, AlertTriangle, BookText, ListChecks, Search, RefreshCw, XCircle, ExternalLink, Coins, PauseCircle, CheckCircle, BarChart, Hourglass } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useTaskLinks, useRefreshTaskLinks, useRefreshRateLimit } from '@/hooks/useTasksQueries';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getWithAuth } from '@/utils/fetchWithAuth';
import { useQuery } from '@tanstack/react-query';

interface TaskUrlsResponse {
  taskId: string;
  speedyTaskId: string;
  checkerTaskId: string | null;
  urls: TaskLink[];
  taskTitle: string;
  taskStatus: string;
  createdAt: string;
}

interface TaskLink {
  id: string;
  task_id: string;
  url: string;
  title: string | null;
  is_indexed: boolean;
  error_code: string | null;
  created_at: string;
  checkedAt?: string;
  processingStatus?: string;
}

interface TaskLinksTableProps {
  taskId: string;
  type?: 'indexer' | 'checker';
  isCompleted?: boolean;
  localLinks?: TaskLink[];
  task?: {
    size?: number;
    vipQueue?: boolean;
    heldCredits?: number;
    creditUsage?: number;
    status?: string;
  };
}

const LINKS_PER_PAGE = 10;

export const TaskLinksTable = ({ taskId, type = 'indexer', isCompleted, localLinks, task }: TaskLinksTableProps) => {
  console.log('TaskLinksTable - task status:', task?.status, 'isCompleted:', isCompleted);
  const [currentPage, setCurrentPage] = useState(1);
  const [showInvalidUrlsDialog, setShowInvalidUrlsDialog] = useState(false);

  // Helper function to check if a link is in initial processing state (before BullMQ worker processes it)
  const isLinkInInitialProcessing = (link: TaskLink) => {
    const createdAt = new Date(link.created_at);
    const now = new Date();
    const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    // Use 30 minutes for production, 2 minutes for development (matching backend config)
    const processingDelay = process.env.NODE_ENV === 'production' ? 30 : 2;
    return minutesSinceCreation < processingDelay;
  };
  
  // User context
  const { user } = useUser();

  // TanStack Query hooks
  const {
    data: taskLinks = [],
    isLoading: loadingLinks,
    error,
    refetch: refetchTaskLinks,
  } = useTaskLinks(taskId, isCompleted, localLinks, user?.id, type);

  const refreshTaskLinksMutation = useRefreshTaskLinks();
  const { canRefresh, getTimeUntilNextRefresh, handleRefreshWithRateLimit } = useRefreshRateLimit(taskId);

  // Debug logging for VIP tasks
  useEffect(() => {
    console.log('🔍 TaskLinksTable debug:', {
      taskId,
      type,
      isCompleted,
      taskLinksLength: taskLinks.length,
      taskLinks: taskLinks.slice(0, 3), // Show first 3 for debugging
      error: error?.message
    });
  }, [taskId, type, isCompleted, taskLinks, error]);

  // No force refresh needed - use same caching behavior as indexer tasks

  // TanStack Query for URL validation details with caching
  const {
    data: urlValidationData,
    isLoading: loadingValidation,
    error: validationError,
  } = useQuery({
    queryKey: ['urlValidationDetails', taskId, type, task?.vipQueue],
    queryFn: async () => {
      // Call URL validation details for indexer tasks OR VIP tasks
      if (!taskId || (type !== 'indexer' && !task?.vipQueue)) {
        console.log('🔍 fetchUrlValidationDetails: Skipping - taskId:', taskId, 'type:', type, 'vipQueue:', task?.vipQueue);
        return null;
      }
      
      console.log('🔍 fetchUrlValidationDetails: Fetching for taskId:', taskId, 'type:', type, 'vipQueue:', task?.vipQueue);
      
      const data = await getWithAuth(`/proxy/speedyindex/url-validation/details/${taskId}`);
      console.log('🔍 fetchUrlValidationDetails: Data received:', data);
      return data;
    },
    enabled: !!taskId && (type === 'indexer' || task?.vipQueue),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [taskLinks]);

  // Debug logging for render
  useEffect(() => {
    console.log('🔍 TaskLinksTable render debug - type:', type, 'urlValidationData:', urlValidationData, 'loadingValidation:', loadingValidation);
  }, [type, urlValidationData, loadingValidation]);

  // Get invalid URLs for the dialog
  const getInvalidUrls = () => {
    if (!urlValidationData?.urls) return [];
    // VIP tasks allow 2xx (200,201,202,203,204,206) and 401, 403
    const vipAllowed = new Set([200, 201, 202, 203, 204, 206, 401, 403]);
    return urlValidationData.urls.filter((url: any) => {
      const isFinal = url.processingStatus === 'completed' || url.processingStatus === 'failed';
      if (!isFinal) return false;
      if (task?.vipQueue) {
        const status = url.accessibleStatus ?? null;
        // Exclude VIP-allowed statuses from invalid list
        if (status !== null && vipAllowed.has(status)) return false;
      }
      return !url.isAccessible;
    });
  };

  const invalidUrls = getInvalidUrls();

  const totalPages = Math.ceil(taskLinks.length / LINKS_PER_PAGE);
  const startIndex = (currentPage - 1) * LINKS_PER_PAGE;
  const endIndex = Math.min(startIndex + LINKS_PER_PAGE, taskLinks.length);
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

  const handleCheckOnGoogle = (url: string) => {
    const googleSearchUrl = `https://www.google.com/search?q=site:${encodeURIComponent(url)}`;
    window.open(googleSearchUrl, '_blank');
  };

  const handleRefreshLinks = () => {
    handleRefreshWithRateLimit(() => {
      refreshTaskLinksMutation.mutate(taskId);
    });
  };

  if (loadingLinks) return (
      <div className="py-8 text-center text-[#5f6368] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4285f4] mr-3"></div>
        Loading URLs...
      </div>
  );

  if (taskLinks.length === 0) {
    if (isCompleted) {
      return (
          <div className="py-8 text-center text-[#34a853] flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Task completed. No URLs found or all processed.
          </div>
      );
    }
    return (
        <div className="py-8 text-center text-[#5f6368]">
          No URLs found for this task.
        </div>
    );
  }

  const isRefreshEnabled = canRefresh();
  const timeUntilNextRefresh = getTimeUntilNextRefresh();

  return (
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-2 text-[18px] font-medium text-[#202124] ">
            <LinkIcon className="w-5 h-5 text-[#4285f4]" />
            Submitted URLs
            <span className="ml-auto text-xs font-normal text-[#5f6368]">
            Showing {startIndex + 1}-{endIndex} of {taskLinks.length}
          </span>
          </div>

          {/* URL Validation Summary - Show for Indexer tasks and VIP tasks */}
          {(type === 'indexer' || task?.vipQueue) && (
            <>
              {loadingValidation && (
                <div className="flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-blue-800">Loading URL validation details...</span>
                </div>
              )}
              {urlValidationData && (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    You submitted <strong>{urlValidationData.total} URLs</strong>
                  </span>
                </div>
                {urlValidationData.accessible > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      <strong>{urlValidationData.accessible} valid</strong> and sent for indexing
                    </span>
                  </div>
                )}
                {urlValidationData.failed > 0 && (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800">
                      <strong>{urlValidationData.failed} invalid</strong> and not sent
                    </span>
                  </div>
                )}
                {urlValidationData.processing > 0 && (
                  <div className="flex items-center gap-2">
                    <Hourglass className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-800">
                      <strong>{urlValidationData.processing} processing</strong>
                    </span>
                  </div>
                )}
              </div>
              
              {/* Show invalid URLs button if there are any */}
              {invalidUrls.length > 0 && (
                <Dialog open={showInvalidUrlsDialog} onOpenChange={setShowInvalidUrlsDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Show {invalidUrls.length} Invalid URL{invalidUrls.length !== 1 ? 's' : ''}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        Invalid URLs - Not Sent for Indexing
                      </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[60vh]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>URL</TableHead>
                            <TableHead>Submitted Status</TableHead>
                            <TableHead>Final Status</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Processed At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invalidUrls.map((url: any) => (
                            <TableRow key={url.id}>
                              <TableCell>
                                <div className="max-w-xs truncate">
                                  <a 
                                    href={url.submittedUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                  >
                                    <span className="truncate">{url.submittedUrl}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </TableCell>
                              <TableCell>
                                {(() => {
                                  const status = url.submittedStatus;
                                  const vipAllowed = new Set([200, 201, 202, 203, 204, 206, 401, 403]);
                                  const ok = task?.vipQueue ? (status != null && vipAllowed.has(status)) : status === 200;
                                  return status !== null ? (
                                    <Badge variant={ok ? "default" : "destructive"}>
                                      {status}
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive">404</Badge>
                                  );
                                })()}
                              </TableCell>
                              <TableCell>
                                {(() => {
                                  const status = url.accessibleStatus;
                                  const vipAllowed = new Set([200, 201, 202, 203, 204, 206, 401, 403]);
                                  const ok = task?.vipQueue ? (status != null && vipAllowed.has(status)) : status === 200;
                                  return status !== null ? (
                                    <Badge variant={ok ? "default" : "destructive"}>
                                      {status}
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive">404</Badge>
                                  );
                                })()}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {(url.accessibleStatus === 404 || url.accessibleStatus === null) && (
                                    <span className="text-red-600">Page not found</span>
                                  )}
                                  {url.accessibleStatus === 403 && (
                                    <span className="text-red-600">Access forbidden</span>
                                  )}
                                  {url.accessibleStatus === 500 && (
                                    <span className="text-red-600">Server error</span>
                                  )}
                                  {url.accessibleStatus === 301 || url.accessibleStatus === 302 ? (
                                    <span className="text-orange-600">Redirect failed</span>
                                  ) : null}
                                  {url.processingStatus === 'failed' && (
                                    <span className="text-red-600">Validation failed</span>
                                  )}
                                  {url.accessibleStatus && url.accessibleStatus >= 400 && url.accessibleStatus < 500 && url.accessibleStatus !== 404 && (
                                    <span className="text-red-600">Client error</span>
                                  )}
                                  {url.accessibleStatus && url.accessibleStatus >= 500 && (
                                    <span className="text-red-600">Server error</span>
                                  )}
                                  {!url.accessibleStatus && url.processingStatus === 'failed' && (
                                    <span className="text-red-600">Connection failed</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {url.processedAt ? (
                                  <span className="text-sm text-gray-600">
                                    {new Date(url.processedAt).toLocaleString()}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Note:</strong> These URLs were not sent for indexing because they failed validation.
                        {task?.vipQueue ? (
                          <>
                            {' '}For VIP tasks, URLs are considered valid if final status is 200, 201, 202, 203, 204, 206, 401, or 403.
                          </>
                        ) : (
                          <> Only URLs that return a 200 status code are considered valid and sent for indexing.</>
                        )}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
              )}
            </>
          )}

          {task && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#5f6368] mt-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#fbbc04]" />
                  <span>Total Credits: {(task.size || 0) * 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PauseCircle className="w-4 h-4 text-[#4285f4]" />
                  <span>Held Credits: {task.heldCredits || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#34a853]" />
                  <span>Used Credits: {task.creditUsage || 0}</span>
                </div>
                
              </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-[#dadce0] bg-white">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-[#f8f9fa] text-[#5f6368] border-b border-[#dadce0]">
                <TableHead className="font-medium text-[#202124]">
                <span className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4 text-[#4285f4]" /> URL
                </span>
                </TableHead>
                <TableHead className="font-medium text-[#202124]">
                <span className="flex items-center gap-1">
                  <ListChecks className="w-4 h-4 text-[#4285f4]" /> Status
                </span>
                </TableHead>
                <TableHead className="font-medium text-[#202124]">
                <span className="flex items-center gap-1">
                  <BookText className="w-4 h-4 text-[#4285f4]" /> Title
                </span>
                </TableHead>
                <TableHead className="font-medium text-[#202124]">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-[#fbbc04]" /> Error
                </span>
                </TableHead>
                <TableHead className="font-medium text-[#202124]">
                <span className="flex items-center gap-1">
                  <Search className="w-4 h-4 text-[#4285f4]" /> Action
                </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLinks.map((link, idx) => (
                  <TableRow
                      key={link.id || link.url || idx}
                      className="border-b border-[#dadce0] hover:bg-[#f8f9fa]"
                  >
                    <TableCell className="max-w-xs truncate">
                      <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4285f4] hover:underline"
                          title={link.url}
                      >
                        {link.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      {link.processingStatus === 'pending' || isLinkInInitialProcessing(link) ? (
                        <span className="text-[#5f6368]">Processing...</span>
                      ) : link.is_indexed ? (
                        <span className="inline-flex items-center rounded-full bg-[#e6f4ea] px-2.5 py-0.5 text-xs font-medium text-[#34a853]">
                          Indexed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-[#fce8e6] px-2.5 py-0.5 text-xs font-medium text-[#ea4335]">
                          Not Indexed
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-[#202124]">
                      {link.processingStatus === 'pending' || isLinkInInitialProcessing(link) ? 'Processing...' : (link.title || (link.is_indexed ? 'Indexed by Google' : 'Not indexed by Google'))}
                    </TableCell>
                    <TableCell className="text-[#5f6368]">
                      {link.processingStatus === 'pending' || isLinkInInitialProcessing(link) ? 'Processing...' : (link.error_code || 'None')}
                    </TableCell>
                    <TableCell>
                      <button
                          onClick={() => handleCheckOnGoogle(link.url)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-[#4285f4] rounded-full border border-[#4285f4] hover:bg-[#e8f0fe] transition"
                      >
                        <Search className="w-3.5 h-3.5" /> Check on Google
                      </button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex justify-end items-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                        onClick={handlePrevious}
                        className={`rounded-full border-[#dadce0] hover:bg-[#f1f3f4] hover:text-[#4285f4] ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                            isActive={currentPage === i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`rounded-full border-[#dadce0] ${currentPage === i + 1 ? 'bg-[#e8f0fe] text-[#4285f4] border-[#4285f4]/30' : 'hover:bg-[#f1f3f4]'}`}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                        onClick={handleNext}
                        className={`rounded-full border-[#dadce0] hover:bg-[#f1f3f4] hover:text-[#4285f4] ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
        )}

        {/* Refresh Section - Disabled for now */}
        {/* {!isCompleted && taskLinks.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-sm text-[#5f6368]">
              <div>
                Last checked: {taskLinks[0]?.checkedAt ? new Date(taskLinks[0].checkedAt).toLocaleString() : 'Never'}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                      onClick={handleRefreshLinks}
                      disabled={refreshTaskLinksMutation.isPending || !isRefreshEnabled}
                      className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-[#4285f4] rounded-full border border-[#4285f4] hover:bg-[#e8f0fe] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshTaskLinksMutation.isPending ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-[#dadce0] shadow-lg p-3 rounded-lg">
                  <p className="text-sm">
                    {isRefreshEnabled
                        ? 'Click to refresh task links data'
                        : `Next refresh available in ${timeUntilNextRefresh}`
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
        )} */}
      </div>
  );
};