import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from '@/hooks/use-toast';
import { getWithAuth, postWithAuth } from '@/utils/fetchWithAuth';

interface Task {
  id: string;
  title: string;
  type: string;
  status: string;
  link_count?: number;
  processed_count?: number;
  indexed_count?: number;
  vipQueue?: boolean;
  credits_used?: number;
  created_at: string;
  completed_at?: string | null;
  speedy_task_id?: string;
  report_status?: string | null;
  is_completed: boolean;
  size?: number;
  creditUsage: number;
  heldCredits?: number;
}

interface TaskLink {
  id: string;
  task_id: string;
  url: string;
  title: string | null;
  is_indexed: boolean;
  error_code: string | null;
  created_at: string;
  checkedAt?: string;
  processingStatus?: string;
}

interface TaskUrlsResponse {
  taskId: string;
  speedyTaskId: string;
  checkerTaskId: string | null;
  urls: TaskLink[];
  taskTitle: string;
  taskStatus: string;
  createdAt: string;
}

// API functions
export const fetchTasks = async (
    type: 'indexer' | 'checker',
    filters?: { search?: string; dateRange?: string; page?: number; limit?: number }
) => {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append('search', filters.search);
  if (filters?.dateRange) queryParams.append('dateRange', filters.dateRange);
  if (filters?.page) queryParams.append('page', filters.page.toString());
  if (filters?.limit) queryParams.append('limit', filters.limit.toString());

  const url = `/proxy/speedyindex/status/${type}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  console.log('Fetching tasks from:', url);
  
  const json = await postWithAuth<any>(url);
  return {
    tasks: json.result || [],
    totalCount: json.totalCount || 0
  };
};

// Fetch indexer tasks
export const fetchIndexerTasks = async () => {
  const url = `/proxy/speedyindex/status/indexer`;
  console.log('Fetching indexer tasks from:', url);
  
  const data = await postWithAuth<any>(url);
  return data.result || [];
};

// Fetch checker tasks
export const fetchCheckerTasks = async () => {
  const url = `/proxy/speedyindex/status/checker`;
  console.log('Fetching checker tasks from:', url);
  
  const data = await postWithAuth<any>(url);
  return data.result || [];
};



const fetchTaskLinks = async (taskId: string, type?: 'indexer' | 'checker'): Promise<TaskLink[]> => {
  // For both checker and indexer tasks, use the report endpoint which calls SpeedyIndex full report API
  // This ensures we get real-time data from SpeedyIndex instead of local database
  const data = await getWithAuth<any>(`/proxy/speedyindex/report/${taskId}`);
  
  // Handle the response format from SpeedyIndex full report API
  if (data.indexed_links && data.unindexed_links) {
    // Standard SpeedyIndex full report format
    const indexed = (data.indexed_links || []).map((link: any) => ({ ...link, is_indexed: true }));
    const unindexed = (data.unindexed_links || []).map((link: any) => ({ ...link, is_indexed: false }));
    return [...indexed, ...unindexed];
  } else if (data.urls) {
    // Alternative format where URLs are in a single array with is_indexed property
    return data.urls || [];
  } else {
    // Fallback to empty array if no data
    return [];
  }
};

const fetchLocalLinks = async (taskId: string): Promise<TaskLink[]> => {
  const data = await getWithAuth<any>(`/proxy/speedyindex/urls/${taskId}`);
  return data.urls || [];
};

const updateTaskStatus = async (task: Task): Promise<Task> => {
  // Normalize type for backend
  let normalizedType: 'indexer' | 'checker' = 'indexer';
  if (task.type === 'checker' || task.type === 'google/checker') {
    normalizedType = 'checker';
  } else if (task.type === 'indexer' || task.type === 'google/indexer') {
    normalizedType = 'indexer';
  }
  
  const responseData = await postWithAuth<any>(`/proxy/speedyindex/refresh/${task.id}`, { type: normalizedType });
  
  // If the response contains updated task data, return it
  if (responseData.result && responseData.result.length > 0) {
    // Find the updated task in the response
    const updatedTask = responseData.result.find((t: Task) => t.id === task.id);
    if (updatedTask) {
      return updatedTask;
    }
  }
  
  // If no updated data in response, return the original task
  return task;
};

// Utility function to check if refresh is allowed (twice per day)
const canRefresh = (lastRefreshTime: number): boolean => {
  const now = Date.now();
  const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  return now - lastRefreshTime >= twelveHours;
};

const getTimeUntilNextRefresh = (lastRefreshTime: number): string => {
  const now = Date.now();
  const twelveHours = 12 * 60 * 60 * 1000;
  const timeRemaining = twelveHours - (now - lastRefreshTime);
  
  if (timeRemaining <= 0) return 'Available now';
  
  const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
  const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
};

// Query keys with user ID scoping
export const taskQueryKeys = {
  all: (userId: string) => ['tasks', userId] as const,
  lists: (userId: string) => [...taskQueryKeys.all(userId), 'list'] as const,
  list: (
      userId: string,
      type: 'indexer' | 'checker',
      filters?: { search?: string; dateRange?: string; page?: number; limit?: number }
  ) => [...taskQueryKeys.lists(userId), type, filters?.search || '', filters?.dateRange || '', filters?.page || 1, filters?.limit || 10] as const,
  details: (userId: string) => [...taskQueryKeys.all(userId), 'detail'] as const,
  detail: (userId: string, taskId: string) => [...taskQueryKeys.details(userId), taskId] as const,
  links: (userId: string, taskId: string) => [...taskQueryKeys.detail(userId, taskId), 'links'] as const,
  localLinks: (userId: string, taskId: string) => [...taskQueryKeys.detail(userId, taskId), 'local-links'] as const,
  recent: (userId: string, filters?: { search?: string; type?: string; startDate?: string; endDate?: string; limit?: string }) => 
    [...taskQueryKeys.all(userId), 'recent', filters?.search || '', filters?.type || '', filters?.startDate || '', filters?.endDate || '', filters?.limit || ''] as const,
  dashboardOverview: (userId: string) => [...taskQueryKeys.all(userId), 'dashboard-overview'] as const,
};

// Hooks
export const useTasksList = (
    type: 'indexer' | 'checker',
    userId?: string,
    filters?: { search?: string; dateRange?: string; page?: number; limit?: number }
) => {
  console.log('useTasksList called with:', { userId, type, filters });
  return useQuery({
    queryKey: userId ? taskQueryKeys.list(userId, type, filters) : ['tasks', 'no-user', type],
    queryFn: async () => {
      const result = await fetchTasks(type, filters);
      return result; // Return the full object with tasks and totalCount
    },
    enabled: !!userId,
  });
};

// Hook for getting just the tasks array (for components that don't need pagination info)
export const useTasksArray = (
    type: 'indexer' | 'checker',
    userId?: string
) => {
  console.log('useTasksArray called with:', { userId, type });
  return useQuery({
    queryKey: userId ? ['tasks-array', userId, type] : ['tasks-array', 'no-user', type],
    queryFn: async () => {
      if (type === 'indexer') {
        return await fetchIndexerTasks();
      } else if (type === 'checker') {
        return await fetchCheckerTasks();
      }
      return [];
    },
    enabled: !!userId,
  });
};

export const useTaskLinks = (
  taskId: string,
  isCompleted?: boolean,
  localLinks?: TaskLink[],
  userId?: string,
  type?: 'indexer' | 'checker'
) => {
  return useQuery({
    queryKey: userId ? [...taskQueryKeys.links(userId, taskId), type] : ['task-links', 'no-user', taskId, type],
    queryFn: () => fetchTaskLinks(taskId, type),
    enabled: !!userId, // Always allow fetching, regardless of isCompleted or localLinks
    staleTime: 5 * 60 * 1000, // 5 minutes cache for all task types
    gcTime: 10 * 60 * 1000, // 10 minutes cache for all task types
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useLocalLinks = (taskId: string, isCompleted?: boolean, userId?: string) => {
  return useQuery({
    queryKey: userId ? taskQueryKeys.localLinks(userId, taskId) : ['local-links', 'no-user', taskId],
    queryFn: () => fetchLocalLinks(taskId),
    enabled: !!userId && !!isCompleted, // Only fetch for completed tasks and if user ID is available
    staleTime: 30 * 60 * 1000, // 30 minutes (longer cache for completed tasks)
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: (updatedTask, originalTask) => {
      // Get user ID from localStorage token (decode JWT)
      const token = localStorage.getItem('token');
      let userId: string | undefined;
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id;
        } catch (e) {
          console.error('Failed to decode token for cache invalidation');
        }
      }
      
      if (userId) {
        // Update only the specific task in the cache instead of invalidating the entire list
        const taskType = originalTask.type === 'checker' || originalTask.type === 'google/checker' ? 'checker' : 'indexer';
        const queryKey = taskQueryKeys.list(userId, taskType as 'indexer' | 'checker');
        
        // Get current tasks data
        const currentData = queryClient.getQueryData(queryKey) as Task[] | undefined;
        
        if (currentData) {
          // Update the specific task in the list
          const updatedData = currentData.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          );
          
          // Set the updated data in cache
          queryClient.setQueryData(queryKey, updatedData);
        }

        // Check if task status changed to completed or if credits changed
        const wasCompleted = originalTask.is_completed || (originalTask.size && originalTask.processed_count && originalTask.size === originalTask.processed_count);
        const isNowCompleted = updatedTask.is_completed || (updatedTask.size && updatedTask.processed_count && updatedTask.size === updatedTask.processed_count);
        const creditsChanged = (originalTask.creditUsage !== updatedTask.creditUsage) || (originalTask.heldCredits !== updatedTask.heldCredits);

        // If task was completed or credits changed, invalidate user credits cache
        if ((!wasCompleted && isNowCompleted) || creditsChanged) {
          console.log('Task completed or credits changed, invalidating user credits cache');
          queryClient.invalidateQueries({ queryKey: ['userCredits'] });
          
          // Also invalidate credit usage cache
          queryClient.invalidateQueries({ queryKey: ['credit-usage', userId] });
        }
      }
      
      toast({
        title: 'Status updated',
        description: 'Task status has been refreshed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating status',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    },
  });
};

export const useRefreshTaskLinks = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: fetchTaskLinks,
    onSuccess: (data, taskId) => {
      // Get user ID from localStorage token (decode JWT)
      const token = localStorage.getItem('token');
      let userId: string | undefined;
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id;
        } catch (e) {
          console.error('Failed to decode token for cache invalidation');
        }
      }
      
      if (userId) {
        // Update the cache with new data
        queryClient.setQueryData(taskQueryKeys.links(userId, taskId), data);
      }
      
      toast({
        title: 'Links refreshed',
        description: 'Task links have been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error refreshing links',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    },
  });
};

// Utility hooks for refresh rate limiting
export const useRefreshRateLimit = (taskId: string) => {
  const getLastRefreshTime = (): number => {
    const stored = localStorage.getItem(`task-refresh-${taskId}`);
    return stored ? parseInt(stored, 10) : 0;
  };

  const setLastRefreshTime = (time: number) => {
    localStorage.setItem(`task-refresh-${taskId}`, time.toString());
  };

  const canRefreshTask = (): boolean => {
    return canRefresh(getLastRefreshTime());
  };

  const getTimeUntilNextRefreshTask = (): string => {
    return getTimeUntilNextRefresh(getLastRefreshTime());
  };

  const markTaskRefreshed = () => {
    setLastRefreshTime(Date.now());
  };

  const handleRefreshWithRateLimit = (refreshFunction: () => void) => {
    if (canRefreshTask()) {
      refreshFunction();
      markTaskRefreshed();
    } else {
      toast({
        title: 'Refresh rate limited',
        description: `You can refresh again in ${getTimeUntilNextRefreshTask()}`,
        variant: 'destructive',
      });
    }
  };

  return {
    canRefresh: canRefreshTask,
    getTimeUntilNextRefresh: getTimeUntilNextRefreshTask,
    getLastRefreshTime,
    markRefreshed: markTaskRefreshed,
    handleRefreshWithRateLimit,
  };
};

// Hook to invalidate tasks when a new task is created
export const useInvalidateTasksOnCreate = () => {
  const queryClient = useQueryClient();
  
  return (taskType: 'indexer' | 'checker') => {
    // Get user ID from localStorage token (decode JWT)
    const token = localStorage.getItem('token');
    let userId: string | undefined;
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
      } catch (e) {
        console.error('Failed to decode token for cache invalidation');
      }
    }
    
    if (userId) {
      // Invalidate task list queries
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.list(userId, taskType) });
      
      // Invalidate task reports queries (all pages)
      if (taskType === 'indexer') {
        queryClient.invalidateQueries({ 
          queryKey: ['task-reports', userId],
          exact: false 
        });
      }
    }
  };
};

// Hook for task reports (separate from useTasksList to avoid pagination conflicts)
export const useTaskReports = (userId?: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: userId ? ['task-reports', userId, page, limit] : ['task-reports', 'no-user', page, limit],
    queryFn: async () => {
      const result = await fetchTasks('indexer', { page, limit });
      return result; // Return the full object with tasks and totalCount
    },
    enabled: !!userId && userId !== 'undefined' && userId !== '', // Only run if user ID is available and valid
    staleTime: 10 * 60 * 1000, // 10 minutes - data is considered fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache for 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};

// Hook for recent tasks with optimized caching
export const useRecentTasks = (
  userId?: string,
  filters?: {
    search?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    limit?: string;
  }
) => {
  const queryKey = userId ? taskQueryKeys.recent(userId, filters) : ['recent-tasks', 'no-user', filters];
  
  console.log('🔍 useRecentTasks called with:', { userId, filters, queryKey });
  
  // Fetch both indexer and checker tasks
  const { data: indexerTasks = [], isLoading: indexerLoading, error: indexerError } = useQuery({
    queryKey: ['indexer-tasks', userId],
    queryFn: fetchIndexerTasks,
    enabled: !!userId,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const { data: checkerTasks = [], isLoading: checkerLoading, error: checkerError } = useQuery({
    queryKey: ['checker-tasks', userId],
    queryFn: fetchCheckerTasks,
    enabled: !!userId,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Merge and sort tasks by creation date
  const mergedTasks = useMemo(() => {
    const allTasks = [...indexerTasks, ...checkerTasks];
    
    // Sort by created_at in descending order (most recent first)
    const sortedTasks = allTasks.sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || 0);
      const dateB = new Date(b.created_at || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Apply limit if specified
    const limit = filters?.limit ? parseInt(filters.limit, 10) : 6;
    return sortedTasks.slice(0, limit);
  }, [indexerTasks, checkerTasks, filters?.limit]);

  return {
    data: mergedTasks,
    isLoading: indexerLoading || checkerLoading,
    error: indexerError || checkerError,
    refetch: () => {
      // This would need to be implemented if you want to refetch both queries
    }
  };
};

// Hook for dashboard overview tasks
export const useDashboardOverviewTasks = (userId?: string) => {
  const queryKey = userId ? taskQueryKeys.dashboardOverview(userId) : ['dashboard-overview', 'no-user'];
  
  console.log('🔍 useDashboardOverviewTasks called with:', { userId, queryKey });
  
  // Fetch both indexer and checker tasks
  const { data: indexerTasks = [], isLoading: indexerLoading, error: indexerError } = useQuery({
    queryKey: ['indexer-tasks-overview', userId],
    queryFn: fetchIndexerTasks,
    enabled: !!userId,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const { data: checkerTasks = [], isLoading: checkerLoading, error: checkerError } = useQuery({
    queryKey: ['checker-tasks-overview', userId],
    queryFn: fetchCheckerTasks,
    enabled: !!userId,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Merge and sort tasks by creation date, limit to 4 for overview
  const mergedTasks = useMemo(() => {
    const allTasks = [...indexerTasks, ...checkerTasks];
    
    // Sort by created_at in descending order (most recent first)
    const sortedTasks = allTasks.sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || 0);
      const dateB = new Date(b.created_at || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Limit to 4 tasks for dashboard overview
    return sortedTasks.slice(0, 4);
  }, [indexerTasks, checkerTasks]);

  return {
    data: mergedTasks,
    isLoading: indexerLoading || checkerLoading,
    error: indexerError || checkerError,
    refetch: () => {
      // This would need to be implemented if you want to refetch both queries
    }
  };
};

// Hook to invalidate recent tasks when a new task is created
export const useInvalidateRecentTasksOnCreate = () => {
  const queryClient = useQueryClient();
  
  return () => {
    console.log('🔄 Invalidating recent tasks cache...');
    
    // Get user ID from localStorage token (decode JWT)
    const token = localStorage.getItem('token');
    let userId: string | undefined;
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
      } catch (e) {
        console.error('Failed to decode token for cache invalidation');
      }
    }
    
    if (userId) {
      console.log('👤 Invalidating for user:', userId);
      
      // Invalidate indexer and checker task queries
      queryClient.invalidateQueries({ 
        queryKey: ['indexer-tasks'],
        exact: false 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['checker-tasks'],
        exact: false 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['indexer-tasks-overview'],
        exact: false 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['checker-tasks-overview'],
        exact: false 
      });
      
      // Also invalidate any fallback queries
      queryClient.invalidateQueries({ 
        queryKey: ['recent-tasks'],
        exact: false 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['dashboard-overview'],
        exact: false 
      });
      
      // Force refetch all recent and overview queries
      queryClient.refetchQueries({ 
        queryKey: ['indexer-tasks'],
        exact: false 
      });
      
      queryClient.refetchQueries({ 
        queryKey: ['checker-tasks'],
        exact: false 
      });
      
      console.log('✅ Recent tasks cache invalidation completed');
    } else {
      console.warn('⚠️ No user ID found for cache invalidation');
    }
  };
}; 