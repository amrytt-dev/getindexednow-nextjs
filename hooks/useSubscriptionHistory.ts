import { useQuery } from '@tanstack/react-query';
import { SubscriptionHistory } from '@/types/admin';
import { getWithAuth } from '@/utils/fetchWithAuth';

export const useSubscriptionHistory = (userId: string | null) => {
  return useQuery<SubscriptionHistory>({
    queryKey: ['subscription-history', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const result = await getWithAuth<any>(`/admin/subscriptions/history/${userId}`);
      
      if (result.code !== 0) {
        throw new Error(result.message || 'Failed to fetch subscription history');
      }

      return result.result;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 