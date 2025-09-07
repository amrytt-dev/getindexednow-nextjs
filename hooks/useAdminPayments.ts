import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getWithAuth, postWithAuth } from '@/utils/fetchWithAuth';

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

interface PaymentMetrics {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  thisMonth: number;
}

interface PaymentResponse {
  payments: Payment[];
  metrics: PaymentMetrics;
}

interface PaymentFilters {
  search?: string;
  status?: string;
  plan?: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
}

export function useAdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [metrics, setMetrics] = useState<PaymentMetrics>({
    totalRevenue: 0,
    totalTransactions: 0,
    successRate: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const { toast } = useToast();

  const fetchPayments = async (newFilters?: PaymentFilters) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (newFilters?.search) queryParams.append('search', newFilters.search);
      if (newFilters?.status && newFilters.status !== 'all') queryParams.append('status', newFilters.status);
      if (newFilters?.plan && newFilters.plan !== 'all') queryParams.append('plan', newFilters.plan);
      if (newFilters?.dateRange && newFilters.dateRange !== 'all') queryParams.append('dateRange', newFilters.dateRange);
      if (newFilters?.startDate) queryParams.append('startDate', newFilters.startDate);
      if (newFilters?.endDate) queryParams.append('endDate', newFilters.endDate);

      const data: { code: number; result: PaymentResponse } = await getWithAuth<{ code: number; result: PaymentResponse }>(`/admin/payments?${queryParams}`);
      
      if (data.code === 0) {
        setPayments(data.result.payments);
        setMetrics(data.result.metrics);
      } else {
        throw new Error('Failed to fetch payments');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payments';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const refundPayment = async (paymentId: string, amount: number, reason: string) => {
    try {
      const data: { code: number; result: Payment } = await postWithAuth<{ code: number; result: Payment }>(`/admin/payments/${paymentId}/refund`, { amount, reason });
      
      if (data.code === 0) {
        // Update the payment in the list
        setPayments(prev => prev.map(payment => 
          payment.id === paymentId ? data.result : payment
        ));
        
        // Refresh metrics
        await fetchPayments(filters);
        
        toast({
          title: 'Success',
          description: `Payment refunded successfully (${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount / 100)})`,
        });
      } else {
        throw new Error('Failed to refund payment');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refund payment';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const updateFilters = (newFilters: PaymentFilters) => {
    setFilters(newFilters);
    fetchPayments(newFilters);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    metrics,
    loading,
    error,
    filters,
    updateFilters,
    refundPayment,
    refetch: () => fetchPayments(filters),
  };
} 