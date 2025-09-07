import { useState, useCallback } from 'react';
import { getTaskCounter } from '@/utils/fetchWithAuth';

export const useTaskCounter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCounter = useCallback(async (type: 'indexer' | 'checker'): Promise<number | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getTaskCounter(type);
      return response.counter;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get task counter';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getCounter,
    isLoading,
    error
  };
}; 