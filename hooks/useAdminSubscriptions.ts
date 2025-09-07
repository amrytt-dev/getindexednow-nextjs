import { useQuery } from '@tanstack/react-query';
import { SubscriptionsResponse } from '@/types/admin';
import { getWithAuth } from '@/utils/fetchWithAuth';

interface UseAdminSubscriptionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  planFilter?: string;
  statusFilter?: string;
}

export const useAdminSubscriptions = (params: UseAdminSubscriptionsParams = {}) => {
  const { page = 1, pageSize = 20, search = '', planFilter = '', statusFilter = '' } = params;

  return useQuery<SubscriptionsResponse>({
    queryKey: ['admin-subscriptions', page, pageSize, search, planFilter, statusFilter],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
        ...(planFilter && { planFilter }),
        ...(statusFilter && { statusFilter })
      });

      const result = await getWithAuth<any>(`/admin/subscriptions?${searchParams}`);
      
      if (result.code !== 0) {
        throw new Error(result.message || 'Failed to fetch subscriptions');
      }

      return result.result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 