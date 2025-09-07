import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { getWithAuth } from '@/utils/fetchWithAuth';

interface CreditUsageData {
  month_year: string;
  indexer_used: number;
  checker_used: number;
  total_used: number;
  total_available: number;
  bonus_credits: number;
  held_credits: number;
  remaining_credits: number;
  period_start: string;
  period_end: string;
  is_current?: boolean;
}

const fetchCreditUsage = async (): Promise<CreditUsageData[]> => {
  const data = await getWithAuth<CreditUsageData[]>('/user/credits/usage/monthly');
  return data || [];
};

// Query key for credit usage
export const creditUsageQueryKeys = {
  all: (userId: string) => ['credit-usage', userId] as const,
  summary: (userId: string) => [...creditUsageQueryKeys.all(userId), 'summary'] as const,
};

export const useCreditUsageData = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const {
    data: usageData = [],
    isLoading: loading,
    error,
    refetch,
    isRefetching: refreshing
  } = useQuery({
    queryKey: user?.id ? creditUsageQueryKeys.summary(user.id) : ['credit-usage', 'no-user', 'summary'],
    queryFn: fetchCreditUsage,
    enabled: !!user?.id && user.id !== 'undefined',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Credit usage refreshed",
        description: "Usage data has been updated",
      });
    } catch (error) {
      toast({
        title: "Error refreshing credit usage",
        description: "Failed to refresh usage data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Expose error for components that need it
  if (error) {
    console.error('Error fetching credit usage:', error);
  }

  return {
    usageData,
    loading,
    refreshing,
    error,
    handleRefresh
  };
};

// Hook to invalidate credit usage when credits are used (e.g., task creation)
export const useInvalidateCreditUsage = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  
  return () => {
    if (user?.id) {
      // Invalidate credit usage queries
      queryClient.invalidateQueries({ queryKey: creditUsageQueryKeys.all(user.id) });
      
      // Also invalidate main user credits query for consistency
      queryClient.invalidateQueries({ queryKey: ['userCredits'] });
    }
  };
};
