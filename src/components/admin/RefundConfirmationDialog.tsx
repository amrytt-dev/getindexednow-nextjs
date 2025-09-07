import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, DollarSign } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RefundConfirmationDialogProps {
  payment: {
    id: string;
    amountPaid: number;
    currency: string;
    refundedAmount?: number;
    user: {
      email: string;
      firstName?: string;
      lastName?: string;
    };
    plan: {
      name: string;
    };
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (paymentId: string, amount: number, reason: string) => Promise<void>;
}

export function RefundConfirmationDialog({ payment, open, onOpenChange, onConfirm }: RefundConfirmationDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; reason?: string }>({});

  const handleConfirm = async () => {
    if (!payment) return;
    
    // Validate inputs
    const newErrors: { amount?: string; reason?: string } = {};
    
    if (!refundAmount.trim()) {
      newErrors.amount = 'Refund amount is required';
    } else {
      const amount = parseFloat(refundAmount);
      const maxRefundable = (payment.amountPaid - (payment.refundedAmount || 0)) / 100;
      
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      } else if (amount > maxRefundable) {
        newErrors.amount = `Amount cannot exceed ${formatCurrency(payment.amountPaid - (payment.refundedAmount || 0), payment.currency)}`;
      }
    }
    
    if (!refundReason.trim()) {
      newErrors.reason = 'Refund reason is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsProcessing(true);
    try {
      // Convert amount to cents for API
      const amountInCents = Math.round(parseFloat(refundAmount) * 100);
      await onConfirm(payment.id, amountInCents, refundReason.trim());
      onOpenChange(false);
      // Reset form
      setRefundAmount('');
      setRefundReason('');
      setErrors({});
    } catch (error) {
      // Error is handled by the parent component
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Convert from cents
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when closing
      setRefundAmount('');
      setRefundReason('');
      setErrors({});
    }
    onOpenChange(open);
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Process Refund
          </DialogTitle>
          <DialogDescription>
            Enter the refund amount and reason. The refund will be processed through Stripe.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This will process a refund through Stripe and update the payment status.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Customer:</span>
              <span className="font-medium">
                {payment.user.firstName && payment.user.lastName 
                  ? `${payment.user.firstName} ${payment.user.lastName}`
                  : payment.user.email
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Plan:</span>
              <span className="font-medium">{payment.plan.name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Original Amount:</span>
              <span className="font-medium text-lg flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {formatCurrency(payment.amountPaid, payment.currency)}
              </span>
            </div>
            {payment.refundedAmount && payment.refundedAmount > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Already Refunded:</span>
                  <span className="font-medium text-sm text-orange-600">
                    {formatCurrency(payment.refundedAmount, payment.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Remaining Refundable:</span>
                  <span className="font-medium text-sm text-green-600">
                    {formatCurrency(payment.amountPaid - payment.refundedAmount, payment.currency)}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="refund-amount">Refund Amount ({payment.currency.toUpperCase()})</Label>
              <Input
                id="refund-amount"
                type="number"
                step="0.01"
                min="0"
                max={(payment.amountPaid - (payment.refundedAmount || 0)) / 100}
                placeholder="0.00"
                value={refundAmount}
                onChange={(e) => {
                  setRefundAmount(e.target.value);
                  if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
                }}
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="refund-reason">Refund Reason</Label>
              <Textarea
                id="refund-reason"
                placeholder="Enter the reason for this refund..."
                value={refundReason}
                onChange={(e) => {
                  setRefundReason(e.target.value);
                  if (errors.reason) setErrors(prev => ({ ...prev, reason: undefined }));
                }}
                className={errors.reason ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.reason && (
                <p className="text-sm text-red-500">{errors.reason}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process Refund'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 