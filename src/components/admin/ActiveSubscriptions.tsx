
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Calendar, CreditCard, TrendingUp, ChevronLeft, ChevronRight, Eye, Info } from 'lucide-react';
import { useAdminSubscriptions } from '@/hooks/useAdminSubscriptions';
import { SubscriptionHistoryModal } from './SubscriptionHistoryModal';
import { SubscriptionData } from '@/types/admin';

export default function ActiveSubscriptions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Use the custom hook for fetching subscriptions
  const { data, isLoading, error, refetch } = useAdminSubscriptions({
    page: currentPage,
    pageSize,
    search: searchTerm,
    planFilter: planFilter === 'all' ? '' : planFilter,
    statusFilter: statusFilter === 'all' ? '' : statusFilter
  });

  const subscriptions = data?.subscriptions || [];
  const total = data?.total || 0;
  const stats = data?.stats;
  const totalPages = data?.pagination?.totalPages || 0;

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, planFilter, statusFilter]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleViewHistory = (subscription: SubscriptionData) => {
    const userName = subscription.user.firstName && subscription.user.lastName 
      ? `${subscription.user.firstName} ${subscription.user.lastName}`
      : subscription.user.email;
    
    setSelectedUser({
      id: subscription.userId,
      name: userName,
      email: subscription.user.email
    });
    setShowHistoryModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100); // Assuming amount is in cents
  };

  const getStatusBadgeColor = (isActive: boolean, endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    
    if (!isActive) return 'bg-gray-100 text-gray-800 ';
    if (end < now) return 'bg-red-100 text-red-800 ';
    return 'bg-green-100 text-green-800 ';
  };

  const getStatusText = (isActive: boolean, endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    
    if (!isActive) return 'Inactive';
    if (end < now) return 'Expired';
    return 'Active';
  };

  const getUserDisplayName = (subscription: SubscriptionData) => {
    if (subscription.user.firstName && subscription.user.lastName) {
      return `${subscription.user.firstName} ${subscription.user.lastName}`;
    }
    return subscription.user.email;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Error loading subscriptions</h3>
          <p className="text-muted-foreground mb-4">
            Failed to load subscriptions. Please try again.
          </p>
          <Button onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Subscriptions</p>
                  <p className="text-2xl font-bold">{stats?.totalSubscriptions || '0 / 0'}</p>
                  <p className="text-xs text-muted-foreground">Paid / Free</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{stats?.active || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                  <p className="text-2xl font-bold">{stats?.expired || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats?.monthlyRevenue || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Active Subscriptions Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Plan Name</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Start Date</TableHead>
                  <TableHead className="font-semibold">End Date</TableHead>
                  <TableHead className="font-semibold">Credits</TableHead>
                  <TableHead className="font-semibold">Usage</TableHead>
                  <TableHead className="font-semibold">Auto Renew</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="animate-pulse">
                          <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="animate-pulse h-4 bg-muted rounded w-16"></div>
                      </TableCell>
                      <TableCell>
                        <div className="animate-pulse h-6 bg-muted rounded w-16"></div>
                      </TableCell>
                      <TableCell>
                        <div className="animate-pulse h-4 bg-muted rounded w-20"></div>
                      </TableCell>
                      <TableCell>
                        <div className="animate-pulse h-4 bg-muted rounded w-20"></div>
                      </TableCell>
                      <TableCell>
                        <div className="animate-pulse h-4 bg-muted rounded w-16"></div>
                      </TableCell>
                      <TableCell>
                        <div className="animate-pulse space-y-1">
                          <div className="h-3 bg-muted rounded w-12"></div>
                          <div className="h-3 bg-muted rounded w-14"></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="animate-pulse h-6 bg-muted rounded w-12"></div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  subscriptions.map((subscription) => {
                    const statusText = getStatusText(subscription.isActive, subscription.endDate);
                    const totalUsage = subscription.usedCredits + subscription.heldCredits;
                    
                    return (
                      <TableRow key={subscription.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {getUserDisplayName(subscription)}
                            </span>
                            {subscription.user.firstName && subscription.user.lastName && (
                              <span className="text-sm text-muted-foreground">{subscription.user.email}</span>
                            )}
                            {subscription.user.contactNumber && (
                              <span className="text-xs text-muted-foreground">{subscription.user.contactNumber}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{subscription.plan.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatCurrency(subscription.plan.price)}/month
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadgeColor(subscription.isActive, subscription.endDate)} border-0`}>
                            {statusText}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(subscription.startDate)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(subscription.endDate)}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{subscription.plan.credits.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-help">
                                  <div className="text-sm font-medium">
                                    {totalUsage.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Total Usage
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="space-y-2">
                                  <div className="font-medium text-sm">Usage Breakdown:</div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">Used Credits:</span>
                                      <span className="font-medium text-green-600 "> 
                                        {subscription.usedCredits.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">Held Credits:</span>
                                      <span className="font-medium text-yellow-600 ">
                                        {subscription.heldCredits.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Held: reserved for ongoing tasks
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Badge variant={subscription.isActive ? "default" : "secondary"}>
                            {subscription.isActive ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewHistory(subscription)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} subscriptions
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      {/* Subscription History Modal */}
      <SubscriptionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        userId={selectedUser?.id || null}
        userData={selectedUser ? {
          name: selectedUser.name,
          email: selectedUser.email
        } : undefined}
      />
    </div>
  );
}
