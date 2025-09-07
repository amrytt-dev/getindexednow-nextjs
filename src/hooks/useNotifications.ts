import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/utils/notificationApi';
import { toast } from '@/hooks/use-toast';

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: string) => [...notificationKeys.lists(), { filters }] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

// Hook to get all notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: async () => {
      const response = await notificationApi.getNotifications();
      return response.result;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get unread count
export const useUnreadCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await notificationApi.getUnreadCount();
      return response.result.count;
    },
    staleTime: 10000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to mark notification as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      return notificationApi.markAsRead(notificationId);
    },
    onSuccess: (_, notificationId) => {
      // Update notifications list
      queryClient.setQueryData(notificationKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.map((notif: any) => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        );
      });
      
      // Update unread count
      queryClient.setQueryData(notificationKeys.unreadCount(), (old: number) => {
        return Math.max(0, (old || 0) - 1);
      });
      
      toast({
        title: 'Success',
        description: 'Notification marked as read',
      });
    },
    onError: (error) => {
      console.error('Failed to mark notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    },
  });
};

// Hook to mark all notifications as read
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return notificationApi.markAllAsRead();
    },
    onSuccess: () => {
      // Update notifications list
      queryClient.setQueryData(notificationKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.map((notif: any) => ({ ...notif, isRead: true }));
      });
      
      // Update unread count
      queryClient.setQueryData(notificationKeys.unreadCount(), 0);
      
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    },
    onError: (error) => {
      console.error('Failed to mark all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    },
  });
};

// Hook to delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      return notificationApi.deleteNotification(notificationId);
    },
    onSuccess: (_, notificationId) => {
      // Update notifications list
      queryClient.setQueryData(notificationKeys.lists(), (old: any) => {
        if (!old) return old;
        const deletedNotification = old.find((n: any) => n.id === notificationId);
        const newList = old.filter((notif: any) => notif.id !== notificationId);
        
        // Update unread count if the deleted notification was unread
        if (deletedNotification && !deletedNotification.isRead) {
          queryClient.setQueryData(notificationKeys.unreadCount(), (oldCount: number) => {
            return Math.max(0, (oldCount || 0) - 1);
          });
        }
        
        return newList;
      });
      
      toast({
        title: 'Success',
        description: 'Notification deleted',
      });
    },
    onError: (error) => {
      console.error('Failed to delete notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    },
  });
};

// Hook to create notification (admin only)
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      return notificationApi.createNotification(data);
    },
    onSuccess: () => {
      // Invalidate notifications list to refetch
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      
      toast({
        title: 'Success',
        description: 'Notification created successfully',
      });
    },
    onError: (error) => {
      console.error('Failed to create notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to create notification',
        variant: 'destructive',
      });
    },
  });
}; 