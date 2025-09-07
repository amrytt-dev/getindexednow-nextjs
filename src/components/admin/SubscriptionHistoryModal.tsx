import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CreditCard, TrendingUp, Clock, Info } from 'lucide-react';
import { useSubscriptionHistory } from '@/hooks/useSubscriptionHistory';

interface SubscriptionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userData?: {
    name: string;
    email: string;
  };
}

export const SubscriptionHistoryModal = ({ 
  isOpen, 
  onClose, 
  userId, 
  userData 
}: SubscriptionHistoryModalProps) => {
  const { data: history, isLoading, error } = useSubscriptionHistory(userId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subscription History</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading subscription history...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subscription History</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load subscription history</p>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Subscription History</span>
          </DialogTitle>
          {userData && (
            <div className="text-sm text-muted-foreground">
              {userData.name} • {userData.email}
            </div>
          )}
        </DialogHeader>

        <Tabs defaultValue="subscriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="usage">Credit Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-4">
            {/* Total Usage Summary */}
            {history?.totalUsage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Total Usage Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Credits Used</p>
                      <p className="font-medium text-lg">{history.totalUsage.usedCredits.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Credits Held</p>
                      <p className="font-medium text-lg">{history.totalUsage.heldCredits.toLocaleString()}</p>
                    </div>
                  </div>
                  
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-4">
              {history?.subscriptions.map((subscription) => (
                <Card key={subscription.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div>
                          <CardTitle className="text-lg">{subscription.plan.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(subscription.plan.price)}/month • {subscription.plan.credits.toLocaleString()} credits
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusBadgeColor(subscription.isActive, subscription.endDate)}>
                        {getStatusText(subscription.isActive, subscription.endDate)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                                                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                       <div>
                         <p className="text-muted-foreground">Start Date</p>
                         <p className="font-medium">{formatDate(subscription.startDate)}</p>
                       </div>
                       <div>
                         <p className="text-muted-foreground">End Date</p>
                         <p className="font-medium">{formatDate(subscription.endDate)}</p>
                       </div>
                       <div>
                         <p className="text-muted-foreground">Used Credits</p>
                         <p className="font-medium">{(subscription.usedCredits || 0).toLocaleString()}</p>
                       </div>
                       <div>
                         <p className="text-muted-foreground">Held Credits</p>
                         <p className="font-medium">{(subscription.heldCredits || 0).toLocaleString()}</p>
                       </div>
                     </div>
                     
                     {/* Show message if no credits were used during this period */}
                     {subscription.usedCredits === 0 && (
                       <div className="mt-3 p-3 bg-blue-50  rounded-lg">   
                         <div className="flex items-center space-x-2">
                           <Info className="h-4 w-4 text-blue-600" />
                           <span className="text-sm text-blue-800 ">
                             No credits were used during this subscription period
                           </span>
                         </div>
                       </div>
                     )}
                    {subscription.carriedForwardCredits > 0 && (
                      <div className="mt-3 p-3 bg-blue-50  rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Info className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-800 ">
                            {subscription.carriedForwardCredits.toLocaleString()} credits carried forward from previous plan
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {history?.subscriptions.length === 0 && (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No subscription history found</p>
                </div>
              )}
                         </div>
             
             
            </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Payment History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history?.payments && history.payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                          <TableCell>{payment.plan.name}</TableCell>
                          <TableCell>{formatCurrency(payment.amountPaid)}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === 'succeeded' ? 'default' : 'secondary'}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payment history found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Credit Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history?.creditUsage && history.creditUsage.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Credits Used</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.creditUsage.map((usage) => (
                        <TableRow key={usage.id}>
                          <TableCell>{formatDate(usage.createdAt)}</TableCell>
                          <TableCell className="font-medium">{usage.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            {usage.task ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help">
                                      {usage.task.title || 'Untitled Task'}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Task ID: {usage.task.id}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {usage.task && (
                              <Badge variant="outline">
                                {usage.task.status}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No credit usage history found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}; 