import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserCreditsInfo } from './useDashboardData';
import { getWithAuth } from '@/utils/fetchWithAuth';

export function useUserCreditsQuery() {
  const queryClient = useQueryClient();
  return useQuery<UserCreditsInfo | null, Error>({
    queryKey: ['userCredits'],
    queryFn: async () => {
      return await getWithAuth<UserCreditsInfo>('/user/credits');
    },
    staleTime: 30 * 1000, // 30 seconds (reduced from 1 minute for more responsive updates)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
  });
}

// Hook to invalidate user credits queries
export const useInvalidateUserCredits = () => {
  const queryClient = useQueryClient();
  
  return () => {
    // Invalidate main user credits query
    queryClient.invalidateQueries({ queryKey: ['userCredits'] });
    
    // Also invalidate credit usage queries
    queryClient.invalidateQueries({ queryKey: ['credit-usage'] });
  };
}; 