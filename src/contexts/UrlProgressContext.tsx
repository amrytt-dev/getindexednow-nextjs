import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';

interface UrlValidationProgress {
  taskId: string;
  processed: number;
  total: number;
  percentage: number;
  status: 'processing' | 'completed' | 'failed';
  message?: string;
  error?: string;
}

interface UrlProgressContextType {
  progress: UrlValidationProgress | null;
  setProgress: (progress: UrlValidationProgress | null) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const UrlProgressContext = createContext<UrlProgressContextType | undefined>(undefined);

export const UrlProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UrlValidationProgress | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { user, socket } = useUser();

  useEffect(() => {
    if (!socket || !user) return;

    // Listen for URL validation progress updates
    const handleUrlValidationProgress = (data: UrlValidationProgress) => {
      console.log('🔔 Received URL validation progress via WebSocket:', data);
      setProgress(data);
      setIsVisible(true);

      // Hide progress bar after completion or failure
      if (data.status === 'completed' || data.status === 'failed') {
        setTimeout(() => {
          setIsVisible(false);
          setProgress(null);
        }, 3000); // Hide after 3 seconds
      }
    };

    socket.on('url-validation-progress', handleUrlValidationProgress);

    return () => {
      socket.off('url-validation-progress', handleUrlValidationProgress);
    };
  }, [socket, user]);

  const value: UrlProgressContextType = {
    progress,
    setProgress,
    isVisible,
    setIsVisible,
  };

  return (
    <UrlProgressContext.Provider value={value}>
      {children}
    </UrlProgressContext.Provider>
  );
};

// Export the hook with a more explicit name for better Fast Refresh compatibility
export function useUrlProgress(): UrlProgressContextType {
  const context = useContext(UrlProgressContext);
  if (context === undefined) {
    throw new Error('useUrlProgress must be used within a UrlProgressProvider');
  }
  return context;
} 