import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersResponse } from '@/types/admin';
import { toast } from '@/hooks/use-toast';
import { getWithAuth, postWithAuth, putWithAuth, deleteWithAuth } from '@/utils/fetchWithAuth';

export function useAdminUsers({ page = 1, pageSize = 20, search = '', status = 'active' }) {
  return useQuery({
    queryKey: ['admin-users', page, pageSize, search, status],
    queryFn: async (): Promise<UsersResponse> => {
      const params = new URLSearchParams({ 
        page: String(page), 
        pageSize: String(pageSize), 
        search, 
        status 
      });
      const data = await getWithAuth<any>(`/admin/users?${params}`);
      
      // Handle the new response structure
      if (data.code === 0 && data.result) {
        return data.result;
      } else {
        throw new Error(data.error || 'Failed to fetch users');
      }
    },
    placeholderData: (previousData) => previousData,
  });
}

// Archive user mutation
export function useArchiveUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      return await postWithAuth(`/admin/users/${userId}/archive`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Success',
        description: 'User archived successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Unarchive user mutation
export function useUnarchiveUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      return await postWithAuth(`/admin/users/${userId}/unarchive`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Success',
        description: 'User unarchived successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Delete user mutation
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      return await deleteWithAuth(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Update user mutation
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: any }) => {
      return await putWithAuth(`/admin/users/${userId}`, userData);
    },
    onSuccess: (data, variables) => {
      // Invalidate all admin-users queries to ensure fresh data
      queryClient.invalidateQueries({ 
        queryKey: ['admin-users'],
        exact: false 
      });
      
      // Also remove any cached data for this specific user
      queryClient.removeQueries({
        queryKey: ['admin-users'],
        exact: false
      });
      
      // Force refetch the admin users data
      queryClient.refetchQueries({
        queryKey: ['admin-users'],
        exact: false
      });
      
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
} 