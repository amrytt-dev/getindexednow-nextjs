import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io as socketIOClient, Socket } from 'socket.io-client';
import { toast } from '@/hooks/use-toast';
import { notificationKeys } from '@/hooks/useNotifications';

// Dynamic import for authService to avoid mixed import warnings
let authServiceModule: any = null;

const loadAuthService = async () => {
  if (!authServiceModule) {
    authServiceModule = await import('@/utils/authService');
  }
  return authServiceModule;
};

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  isAdmin?: boolean;
  isEditor?: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
  refetchUser: () => void;
  setToken: (token: string | null) => void;
  socket: Socket | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  // Initialize token on mount
  useEffect(() => {
    const initializeToken = async () => {
      const { authService } = await loadAuthService();
      setTokenState(authService.getToken());
    };
    initializeToken();
  }, []);
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const backendBaseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${backendBaseUrl}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Token is invalid, use auth service to handle logout
          const { authService } = await loadAuthService();
          authService.logout('Your session is invalid. Please log in again.');
          setTokenState(null);
          setUser(null);
          return;
        }
        throw new Error('Failed to fetch user profile');
      }

      const userData = await res.json();
      console.log('UserContext - User profile data received:', userData);
      
      // Check if user ID is missing and try to extract from JWT token
      if (!userData.id) {
        console.log('UserContext - No user ID in response, trying to extract from JWT token');
        try {
          // Decode JWT token to get user ID
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('UserContext - JWT payload:', payload);
            if (payload.userId || payload.sub) {
              userData.id = payload.userId || payload.sub;
              console.log('UserContext - Extracted user ID from JWT:', userData.id);
            }
          }
        } catch (jwtError) {
          console.error('UserContext - Failed to decode JWT token:', jwtError);
        }
      }
      
      // If still no user ID, use email as a fallback identifier
      if (!userData.id && userData.email) {
        userData.id = userData.email;
      }
      
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Use auth service to handle logout
    const { authService } = await loadAuthService();
    authService.logout('You have been logged out.');
    
    // Clear user state
    setUser(null);
    setError(null);
    setTokenState(null);
    
    // Clear entire TanStack Query cache
    queryClient.clear();
  };

  const refetchUser = () => {
    fetchUserProfile();
  };

  const setToken = async (newToken: string | null) => {
    const { authService } = await loadAuthService();
    authService.setToken(newToken);
    setTokenState(newToken);
  };

  // Invalidate task queries when user changes
  useEffect(() => {
    if (user?.id) {
      // Invalidate all task queries for the current user
      queryClient.invalidateQueries({ queryKey: ['tasks', user.id] });
    }
  }, [user?.id, queryClient]);

  // Register logout callback with auth service
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setError(null);
      setTokenState(null);
      queryClient.clear();
    };

    const setupAuthCallbacks = async () => {
      const { authService } = await loadAuthService();
      authService.onLogout(handleLogout);
      return () => {
        authService.removeLogoutCallback(handleLogout);
      };
    };

    setupAuthCallbacks();
  }, [queryClient]);

  // Initialize user context on mount
  useEffect(() => {
    // Check if we have a token on initial load
    const initializeContext = async () => {
      const { authService } = await loadAuthService();
      const initialToken = authService.getToken();
      if (initialToken && !token) {
        setTokenState(initialToken);
      } else {
        // If no token, set loading to false immediately
        setLoading(false);
      }
    };
    initializeContext();
  }, []);

  // Fetch user profile when token changes
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  useEffect(() => {
    if (user && user.id) {
      // Connect to Socket.IO server
      const backendBaseUrl = import.meta.env.VITE_API_URL || '';
      
             // Use the backend URL for WebSocket (direct connection)
       let socketUrl = backendBaseUrl;
       
             // Fallback for development if VITE_API_URL is not set
      if (!socketUrl) {
        socketUrl = 'http://localhost:3000';
      }
      
      console.log('🔌 Connecting to WebSocket:', socketUrl);
      console.log('🔧 WebSocket configuration:', {
        url: socketUrl,
        transports: ['websocket', 'polling'],
        path: '/socket.io/',
        withCredentials: true
      });
      console.log('🌍 Environment info:', {
        isProd: import.meta.env.PROD,
        hostname: window.location.hostname,
        origin: window.location.origin,
        backendBaseUrl: backendBaseUrl
      });
      
      const socketInstance = socketIOClient(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'], // Try polling first, then websocket
        timeout: 30000, // 30 second timeout for production
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        path: '/socket.io/', // Explicit path for Socket.IO
        upgrade: true, // Allow transport upgrade
        rememberUpgrade: true, // Remember transport upgrade
      });
      
      setSocket(socketInstance);
      
      // Register userId with the server
      socketInstance.emit('register', user.id);
      
      // Listen for bonus-credits event
      socketInstance.on('bonus-credits', (data) => {
        toast({
          title: data.title || 'Bonus Credits',
          description: data.message || `You've received bonus credits!`,
        });
        // Invalidate notification queries to update list and count
        queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      });
      
      // Add connection event listeners for debugging
      socketInstance.on('connect', () => {
        console.log('✅ WebSocket connected successfully');
        console.log('🔗 Transport:', socketInstance.io.engine.transport.name);
      });
      
      socketInstance.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        console.log('🔍 Trying polling fallback...');
      });
      
      socketInstance.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason);
      });
      
      // Cleanup on unmount or user change
      return () => {
        console.log('🧹 Cleaning up WebSocket connection');
        socketInstance.disconnect();
        setSocket(null);
      };
    }
  }, [user]);

  const value: UserContextType = {
    user,
    loading,
    error,
    logout,
    refetchUser,
    setToken,
    socket,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Export the hook with a more explicit name for better Fast Refresh compatibility
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 