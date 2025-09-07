import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {RefreshCw, FileText, BarChart3, Clock, AlertCircle, ChevronLeft, ChevronRight} from 'lucide-react';
import { ReportsTable, ReportsTableSkeleton } from './ReportsTable';
import { CreditUsageTab } from './CreditUsageTab';
import { CreditHoldReport } from '@/components/ui/CreditHoldReport';
import { toast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useTaskReports } from '@/hooks/useTasksQueries';
import { useUser } from '@/contexts/UserContext';
import { useCreditUsageData } from '@/hooks/useCreditUsageData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getWithAuth } from '@/utils/fetchWithAuth';
import {useCreditHoldData} from "@/hooks/useCreditHoldData.ts";

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('credit-usage');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Fixed page size for reports
  const { user } = useUser();

  // Reset to page 1 when switching to task-reports tab
  useEffect(() => {
    if (activeTab === 'task-reports') {
      setCurrentPage(1);
    }
  }, [activeTab]);

  // Use TanStack Query for task reports with pagination
  const {
    data: taskData,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useTaskReports(user?.id, currentPage, pageSize);

  // Extract tasks array and pagination info from the result object
  const tasks = taskData?.tasks || [];
  const totalCount = taskData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const {
    usageData,
    loading: creditUsageLoading,
    refreshing: creditUsageRefreshing,
    error: creditUsageError,
    handleRefresh: refreshCreditUsage
  } = useCreditUsageData();

  const [selectedPeriod, setSelectedPeriod] = useState<{ periodStart: string; periodEnd: string } | null>(null);

  const {
    holds,
    pagination: creditHoldsPagination,
    billingCycle,
    summary: creditHoldsSummary,
    loading: creditHoldsLoading,
    error: creditHoldsError,
    refreshing: creditHoldsRefreshing,
    handleRefresh: refreshCreditHolds,
    handlePageChange: handleCreditHoldsPageChange
  } = useCreditHoldData(1, 10, selectedPeriod);

  // Pick indexer/checker metrics based on selected or current cycle
  const selectedMonthData = selectedPeriod
    ? usageData?.find(d => d.period_start === selectedPeriod.periodStart && d.period_end === selectedPeriod.periodEnd)
    : usageData?.find(d => d.is_current) || usageData?.[0];

  // Combine credit holds summary with matching monthly usage data
  const summary = creditHoldsSummary ? {
    ...creditHoldsSummary,
    indexerUsed: selectedMonthData?.indexer_used || 0,
    checkerUsed: selectedMonthData?.checker_used || 0,
  } : undefined;

  // Monthly cycles for dropdown (exclude current)
  type MonthlyCycle = { month_year: string; period_start: string; period_end: string; is_current?: boolean };
  const [monthlyCycles, setMonthlyCycles] = useState<MonthlyCycle[]>([]);
  useEffect(() => {
    const loadCycles = async () => {
      try {
        const data = await getWithAuth<MonthlyCycle[]>('/user/credits/usage/monthly');
        const past = Array.isArray(data) ? data.filter(m => m.is_current !== true) : [];
        setMonthlyCycles(past);
      } catch (e) {
        // silently ignore; dropdown will be hidden
        setMonthlyCycles([]);
      }
    };
    loadCycles();
  }, []);

  const cycleOptions = monthlyCycles.map(c => ({
    periodStart: c.period_start,
    periodEnd: c.period_end,
    label: (() => {
      const formatDate = (iso: string) => {
        const d = new Date(iso);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
      };
      const start = new Date(c.period_start);
      const monthYear = start.toLocaleString(undefined, { month: 'long', year: 'numeric' });
      return `${monthYear} ${formatDate(c.period_start)} to ${formatDate(c.period_end)}`;
    })()
  }));

  const handleRefresh = async () => {
    try {
      if (activeTab === 'credit-usage') {
        await refreshCreditUsage();
      } else if (activeTab === 'task-reports') {
        await refetch();
      } else if (activeTab === 'credit-holds') {
        await refreshCreditHolds();
      }

      toast({
        title: 'Refreshed',
        description: `${activeTab.replace('-', ' ')} updated.`,
      });
    } catch (error) {
      toast({
        title: 'Error refreshing data',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
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

  // Error state
  if (error) {
    return (
        <>
          
          <div className="min-h-screen bg-[#f8f9fa]">
            <div className="container mx-auto p-4 sm:p-6">
              <div className="flex items-center justify-center h-48 sm:h-64">
                <div className="text-center px-4">
                  <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#202124] mb-2">
                    Failed to load reports
                  </h3>
                  <p className="text-sm sm:text-base text-[#5f6368] mb-4 max-w-md mx-auto">
                    {error instanceof Error ? error.message : 'An error occurred while loading reports'}
                  </p>
                  <Button onClick={() => refetch()} variant="outline" className="text-sm sm:text-base">
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
    );
  }

  return (
      <div className="min-h-screen bg-[#f8f9fa]">
        

        <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
          {/* Hero Section - Google-style heading */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-normal text-[#202124] mb-2">
              Reports
            </h1>
            <p className="text-[14px] sm:text-[16px] text-[#5f6368] max-w-2xl">
              Track and manage your reports with detailed reports and usage analytics
            </p>
          </div>

          {/* Reports Container - Google Material Card Style */}
          <Card className="border-0 rounded-xl shadow-sm bg-white overflow-hidden">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                 {/* Header with Tabs and Action Button */}
                 <div className="flex flex-col gap-4 p-4 sm:p-6 border-b border-[#dadce0]">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     {/* Scrollable Tabs Container */}
                     <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
                       <TabsList className="h-10 p-1 bg-[#f1f3f4] rounded-full flex flex-row w-max min-w-full sm:min-w-0">
                         <TabsTrigger
                             value="credit-usage"
                             className="rounded-full px-4 sm:px-5 py-1.5 text-[13px] sm:text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#4285f4] data-[state=active]:shadow-sm transition-all flex items-center justify-center whitespace-nowrap flex-shrink-0"
                         >
                           <BarChart3 className="h-4 w-4 mr-2" />
                           <span>Credit Usage</span>
                         </TabsTrigger>
                         <TabsTrigger
                             value="task-reports"
                             className="rounded-full px-4 sm:px-5 py-1.5 text-[13px] sm:text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#34a853] data-[state=active]:shadow-sm transition-all flex items-center justify-center whitespace-nowrap flex-shrink-0"
                         >
                           <FileText className="h-4 w-4 mr-2" />
                           <span>Task Reports</span>
                         </TabsTrigger>
                         <TabsTrigger
                             value="credit-holds"
                             className="rounded-full px-4 sm:px-5 py-1.5 text-[13px] sm:text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#ea4335] data-[state=active]:shadow-sm transition-all flex items-center justify-center whitespace-nowrap flex-shrink-0"
                         >
                           <Clock className="h-4 w-4 mr-2" />
                           <span>Credit Holds</span>
                         </TabsTrigger>
                       </TabsList>
                     </div>

                     <Button
                         onClick={handleRefresh}
                         disabled={isRefetching}
                         className="bg-[#4285f4] hover:bg-[#3b78e7] text-white rounded-full h-10 px-4 sm:px-6 font-medium text-[13px] sm:text-[14px] flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center flex-shrink-0"
                     >
                       <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                       <span>Refresh</span>
                     </Button>
                   </div>
                 </div>

                {/* Tab Content */}
                <TabsContent value="credit-usage" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <CreditUsageTab  usageData={usageData}
                                   loading={creditUsageLoading}
                                   error={creditUsageError}
                                   refreshing={creditUsageRefreshing}
                                   handleRefresh={refreshCreditUsage}/>
                </TabsContent>

                <TabsContent value="task-reports" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  {isLoading ? (
                    <div className="p-4 sm:p-6">
                      <ReportsTableSkeleton />
                    </div>
                  ) : isRefetching ? (
                    <div className="p-4 sm:p-6">
                      <ReportsTableSkeleton />
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 px-4">
                      <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-[#dadce0] mb-4 sm:mb-6" />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[#202124]">No Reports Available</h3>
                      <p className="text-sm sm:text-base text-[#5f6368] max-w-md mx-auto">
                        Complete some VIP indexer tasks to see reports here. Reports are only available for VIP tasks after completion.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 sm:p-6">
                      <div className="mb-4 p-3 bg-[#f1f3f4] rounded-lg border border-[#dadce0]">
                        <p className="text-xs sm:text-sm text-[#5f6368] font-medium">
                          📝 Note: Reports are only available for VIP tasks and can take up to 5–7 days to generate after task completion.
                        </p>
                      </div>
                      <ReportsTable tasks={tasks} onRefresh={handleRefresh} />
                      
                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-xs sm:text-sm text-[#5f6368] text-center sm:text-left">
                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} reports
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handlePrevious}
                              disabled={currentPage === 1}
                              className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              <span className="hidden sm:inline">Previous</span>
                            </Button>
                            
                            {/* Page numbers */}
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 2) {
                                  pageNum = i + 1;
                                } else if (currentPage >= totalPages - 1) {
                                  pageNum = totalPages - 2 + i;
                                } else {
                                  pageNum = currentPage - 1 + i;
                                }
                                
                                return (
                                  <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handlePageChange(pageNum)}
                                    className="h-8 w-8 p-0 text-xs sm:text-sm"
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              })}
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleNext}
                              disabled={currentPage === totalPages}
                              className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                            >
                              <span className="hidden sm:inline">Next</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="credit-holds" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <CreditHoldReport
                      holds={holds}
                      loading={creditHoldsLoading}
                      error={creditHoldsError}
                      refreshing={creditHoldsRefreshing}
                      handleRefresh={refreshCreditHolds}
                      pagination={creditHoldsPagination}
                      onPageChange={handleCreditHoldsPageChange}
                      billingCycle={billingCycle}
                      summary={summary}
                      cycles={cycleOptions}
                      selectedPeriod={selectedPeriod}
                      onCycleChange={(p) => setSelectedPeriod(p)}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};