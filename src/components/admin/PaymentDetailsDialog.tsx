import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  planId: string;
  amountPaid: number;
  currency: string;
  paymentDate: string;
  stripePaymentId: string;
  status: string;
  refundedAt?: string;
  refundedBy?: string;
  refundedAmount?: number;
  refundReason?: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    billingCycle: string;
  };
}

interface PaymentDetailsDialogProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailsDialog({ payment, open, onOpenChange }: PaymentDetailsDialogProps) {
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({});

  if (!payment) return null;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Convert from cents
  };

  const maskId = (id: string) => {
    if (!id) return 'N/A';
    if (id.length <= 8) return '••••••••';
    return `${id.substring(0, 4)}••••${id.substring(id.length - 4)}`;
  };

  const SensitiveInfoField = ({ label, value, fieldKey }: { label: string; value: string; fieldKey: string }) => {
    const isVisible = visibleFields[fieldKey] || false;
    
    return (
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-center justify-between">
          <p className="font-medium font-mono text-sm flex-1">
            {isVisible ? value : maskId(value)}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVisibleFields(prev => ({ ...prev, [fieldKey]: !isVisible }))}
            className="h-6 w-6 p-0 flex-shrink-0"
          >
            {isVisible ? (
              <EyeOff className="h-3 w-3 text-muted-foreground" />
            ) : (
              <Eye className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <DialogTitle>Payment Details</DialogTitle>
            <Badge className={`${getStatusBadge(payment.status)} border-0`}>
              {payment.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">

          {/* User Information */}
          <div>
            <h3 className="text-base font-semibold mb-3">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium text-sm">
                  {payment.user.firstName && payment.user.lastName 
                    ? `${payment.user.firstName} ${payment.user.lastName}`
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-sm">{payment.user.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contact Number</p>
                <p className="font-medium text-sm">{payment.user.contactNumber || 'N/A'}</p>
              </div>
              <SensitiveInfoField 
                label="User ID" 
                value={payment.user.id} 
                fieldKey="userId" 
              />
            </div>
          </div>

          <Separator />

          {/* Plan Information */}
          <div>
            <h3 className="text-base font-semibold mb-3">Plan Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Plan Name</p>
                <p className="font-medium text-sm">{payment.plan.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Billing Cycle</p>
                <p className="font-medium text-sm capitalize">{payment.plan.billingCycle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Plan Price</p>
                <p className="font-medium text-sm">{formatCurrency(payment.plan.price, payment.currency)}</p>
              </div>
              <SensitiveInfoField 
                label="Plan ID" 
                value={payment.plan.id} 
                fieldKey="planId" 
              />
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="text-base font-semibold mb-3">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Amount Paid</p>
                <p className="font-medium text-sm">{formatCurrency(payment.amountPaid, payment.currency)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Currency</p>
                <p className="font-medium text-sm">{payment.currency.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment Date</p>
                <p className="font-medium text-sm">{formatDate(payment.paymentDate)}</p>
              </div>
              <SensitiveInfoField 
                label="Payment ID" 
                value={payment.id} 
                fieldKey="paymentId" 
              />
            </div>
          </div>

          <Separator />

          {/* Stripe Information */}
          <div>
            <h3 className="text-base font-semibold mb-3">Stripe Information</h3>
            <SensitiveInfoField 
              label="Stripe Payment Intent ID" 
              value={payment.stripePaymentId} 
              fieldKey="stripePaymentId" 
            />
          </div>

          {/* Refund Information */}
          {payment.refundedAt && (
            <>
              <Separator />
              <div>
                <h3 className="text-base font-semibold mb-3">Refund Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Refunded At</p>
                    <p className="font-medium text-sm">{formatDate(payment.refundedAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Refunded By</p>
                    <p className="font-medium font-mono text-sm">{payment.refundedBy || 'N/A'}</p>
                  </div>
                  {payment.refundedAmount && (
                    <div>
                      <p className="text-xs text-muted-foreground">Refunded Amount</p>
                      <p className="font-medium text-sm">{formatCurrency(payment.refundedAmount, payment.currency)}</p>
                    </div>
                  )}
                  {payment.refundReason && (
                    <div>
                      <p className="text-xs text-muted-foreground">Refund Reason</p>
                      <p className="font-medium text-sm">{payment.refundReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 