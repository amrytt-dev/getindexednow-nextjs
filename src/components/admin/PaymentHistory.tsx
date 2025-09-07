
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, DollarSign, CreditCard, TrendingUp, Calendar, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { useAdminPayments } from '@/hooks/useAdminPayments';
import { PaymentDetailsDialog } from './PaymentDetailsDialog';
import { RefundConfirmationDialog } from './RefundConfirmationDialog';

export default function PaymentHistory() {
  const { payments, metrics, loading, error, updateFilters, refundPayment } = useAdminPayments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [visibleStripeIds, setVisibleStripeIds] = useState<Record<string, boolean>>({});
  
  // Dialog states
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);

  const handleSearch = (value: string) => {
    setSearch(value);
    updateFilters({
      search: value,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      plan: planFilter !== 'all' ? planFilter : undefined,
      dateRange: dateRange !== 'all' ? dateRange : undefined,
    });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    updateFilters({
      search,
      status: value !== 'all' ? value : undefined,
      plan: planFilter !== 'all' ? planFilter : undefined,
      dateRange: dateRange !== 'all' ? dateRange : undefined,
    });
  };

  const handlePlanFilter = (value: string) => {
    setPlanFilter(value);
    updateFilters({
      search,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      plan: value !== 'all' ? value : undefined,
      dateRange: dateRange !== 'all' ? dateRange : undefined,
    });
  };

  const handleDateRange = (value: string) => {
    setDateRange(value);
    updateFilters({
      search,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      plan: planFilter !== 'all' ? planFilter : undefined,
      dateRange: value !== 'all' ? value : undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      succeeded: 'bg-green-100 text-green-800 ',
      failed: 'bg-red-100 text-red-800 ',
      pending: 'bg-yellow-100 text-yellow-800 ',
      refunded: 'bg-gray-100 text-gray-800 ',
      partially_refunded: 'bg-orange-100 text-orange-800 ',
      cancelled: 'bg-orange-100 text-orange-800 '
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Convert from cents
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getUserName = (user: any) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  const maskStripeId = (stripeId: string) => {
    if (!stripeId) return 'N/A';
    if (stripeId.length <= 8) return '••••••••';
    return `${stripeId.substring(0, 4)}••••${stripeId.substring(stripeId.length - 4)}`;
  };

  const uniquePlans = [...new Set(payments.map(p => p.plan.name))];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading payment history</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue, 'USD')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{metrics.totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.thisMonth, 'USD')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="succeeded">Succeeded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={planFilter} onValueChange={handlePlanFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {uniquePlans.map(plan => (
                    <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={handleDateRange}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Plan</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Stripe ID</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{getUserName(payment.user)}</span>
                        <span className="text-sm text-muted-foreground">{payment.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{payment.plan.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(payment.plan.price, payment.currency)}/{payment.plan.billingCycle}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatCurrency(payment.amountPaid, payment.currency)}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(payment.paymentDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {visibleStripeIds[payment.id] ? payment.stripePaymentId : maskStripeId(payment.stripePaymentId)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setVisibleStripeIds(prev => ({ ...prev, [payment.id]: !prev[payment.id] }))}
                          className="h-6 w-6 p-0"
                        >
                          {visibleStripeIds[payment.id] ? (
                            <EyeOff className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <Eye className="h-3 w-3 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadge(payment.status)} border-0`}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setDetailsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(payment.status === 'succeeded' || payment.status === 'partially_refunded') && 
                         (!payment.refundedAt || (payment.refundedAmount && payment.refundedAmount < payment.amountPaid)) && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setRefundDialogOpen(true);
                            }}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {payments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payments found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PaymentDetailsDialog
        payment={selectedPayment}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      <RefundConfirmationDialog
        payment={selectedPayment}
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        onConfirm={refundPayment}
      />
    </div>
  );
}
