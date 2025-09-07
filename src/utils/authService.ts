import { toast } from '@/hooks/use-toast';

export interface TokenPayload {
  userId: string;
  email: string;
  isAdmin?: boolean;
  exp: number;
  iat: number;
}

class AuthService {
  private static instance: AuthService;
  private logoutCallbacks: (() => void)[] = [];
  private tokenValidationInterval: NodeJS.Timeout | null = null;

  private constructor() {
    // Start token validation monitoring
    this.startTokenValidation();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Get token from localStorage
   */
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Set token in localStorage
   */
  public setToken(token: string | null): void {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  /**
   * Decode JWT token without verification (client-side only)
   */
  public decodeToken(token: string): TokenPayload | null {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return null;
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      return payload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  public isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  /**
   * Check if token will expire soon (within 5 minutes)
   */
  public isTokenExpiringSoon(token: string, minutes: number = 5): boolean {
    const payload = this.decodeToken(token);
    if (!payload) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;
    return timeUntilExpiry < (minutes * 60);
  }

  /**
   * Validate token with server
   */
  public async validateTokenWithServer(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  /**
   * Force logout and clear all auth data
   */
  public logout(reason: string = 'Session expired'): void {
    console.log('Logging out user:', reason);
    
    // Clear token
    this.setToken(null);
    
    // Clear any other auth-related data
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();
    
    // Clear any cached data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('task-refresh-') || key.startsWith('query-')) {
        localStorage.removeItem(key);
      }
    });

    // Show logout notification (neutral, bottom-center via viewport)
    try {
      const lower = (reason || '').toLowerCase();
      const description = lower.includes('expired') ? 'You have been logged out.' : reason || 'You have been logged out.';
      toast({
        title: 'Logged out',
        description,
        variant: 'default',
      });
    } catch (_) {
      // no-op if toast system unavailable
    }

    // Execute logout callbacks
    this.logoutCallbacks.forEach(callback => callback());

    // Redirect to home page shortly after showing toast
    setTimeout(() => {
      window.location.href = '/auth';
    }, 500);
  }

  /**
   * Register logout callback
   */
  public onLogout(callback: () => void): void {
    this.logoutCallbacks.push(callback);
  }

  /**
   * Remove logout callback
   */
  public removeLogoutCallback(callback: () => void): void {
    const index = this.logoutCallbacks.indexOf(callback);
    if (index > -1) {
      this.logoutCallbacks.splice(index, 1);
    }
  }

  /**
   * Start token validation monitoring
   */
  private startTokenValidation(): void {
    // Check token every 30 seconds
    this.tokenValidationInterval = setInterval(() => {
      this.checkTokenValidity();
    }, 30000);
  }

  /**
   * Stop token validation monitoring
   */
  public stopTokenValidation(): void {
    if (this.tokenValidationInterval) {
      clearInterval(this.tokenValidationInterval);
      this.tokenValidationInterval = null;
    }
  }

  /**
   * Check if current token is valid
   */
  private async checkTokenValidity(): Promise<void> {
    const token = this.getToken();
    
    if (!token) {
      return;
    }

    // Check if token is expired
    if (this.isTokenExpired(token)) {
      this.logout('Your session has expired. Please log in again.');
      return;
    }

    // Check if token is expiring soon
    if (this.isTokenExpiringSoon(token)) {
      toast({
        title: 'Session Expiring Soon',
        description: 'Your session will expire in 5 minutes',
        variant: 'default',
      });
    }

    // Optionally validate with server (uncomment if you want server-side validation)
    // const isValid = await this.validateTokenWithServer(token);
    // if (!isValid) {
    //   this.logout('Invalid session. Please log in again.');
    // }
  }

  /**
   * Get user info from token
   */
  public getUserFromToken(token: string): { userId: string; email: string; isAdmin?: boolean } | null {
    const payload = this.decodeToken(token);
    if (!payload) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      isAdmin: payload.isAdmin,
    };
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    return !this.isTokenExpired(token);
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export class for testing
export { AuthService }; 