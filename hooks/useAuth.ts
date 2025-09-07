import { useCallback, useEffect, useState } from 'react';
import { authService, TokenPayload } from '@/utils/authService';
import { useUser } from '@/contexts/UserContext';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  token: string | null;
}

export const useAuth = () => {
  const { user, loading, logout: contextLogout, setToken } = useUser();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
  });

  // Update auth state when user context changes
  useEffect(() => {
    const token = authService.getToken();
    const isAuthenticated = authService.isAuthenticated();
    
    setAuthState({
      isAuthenticated,
      isLoading: loading,
      user,
      token,
    });
  }, [user, loading]);

  // Login function
  const login = useCallback((token: string) => {
    authService.setToken(token);
    setToken(token);
  }, [setToken]);

  // Logout function
  const logout = useCallback((reason?: string) => {
    contextLogout();
    authService.logout(reason);
  }, [contextLogout]);

  // Check if token is expired
  const isTokenExpired = useCallback((token: string) => {
    return authService.isTokenExpired(token);
  }, []);

  // Check if token is expiring soon
  const isTokenExpiringSoon = useCallback((token: string, minutes?: number) => {
    return authService.isTokenExpiringSoon(token, minutes);
  }, []);

  // Get user info from token
  const getUserFromToken = useCallback((token: string) => {
    return authService.getUserFromToken(token);
  }, []);

  // Validate token with server
  const validateTokenWithServer = useCallback(async (token: string) => {
    return authService.validateTokenWithServer(token);
  }, []);

  // Get current token
  const getToken = useCallback(() => {
    return authService.getToken();
  }, []);

  // Set token
  const setAuthToken = useCallback((token: string | null) => {
    authService.setToken(token);
    setToken(token);
  }, [setToken]);

  return {
    // State
    ...authState,
    
    // Actions
    login,
    logout,
    setToken: setAuthToken,
    getToken,
    
    // Token utilities
    isTokenExpired,
    isTokenExpiringSoon,
    getUserFromToken,
    validateTokenWithServer,
    
    // Auth service instance (for advanced usage)
    authService,
  };
}; 