import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface EmailAvailabilityState {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useEmailAvailability = (email: string) => {
  const [state, setState] = useState<EmailAvailabilityState>({
    isChecking: false,
    isAvailable: null,
    error: null,
  });

  const debouncedEmail = useDebounce(email, 500); // 500ms delay

  const checkEmailAvailability = useCallback(async (emailToCheck: string) => {
    if (!emailToCheck || emailToCheck.length < 3) {
      setState({
        isChecking: false,
        isAvailable: null,
        error: null,
      });
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToCheck)) {
      setState({
        isChecking: false,
        isAvailable: null,
        error: 'Invalid email format',
      });
      return;
    }

    setState(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      const response = await fetch(`${BASE_URL}/api/auth/check-email?email=${encodeURIComponent(emailToCheck)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check email availability');
      }

      const data = await response.json();
      
      setState({
        isChecking: false,
        isAvailable: data.available,
        error: null,
      });
    } catch (error) {
      setState({
        isChecking: false,
        isAvailable: null,
        error: error instanceof Error ? error.message : 'Failed to check email availability',
      });
    }
  }, []);

  useEffect(() => {
    if (debouncedEmail) {
      checkEmailAvailability(debouncedEmail);
    } else {
      setState({
        isChecking: false,
        isAvailable: null,
        error: null,
      });
    }
  }, [debouncedEmail, checkEmailAvailability]);

  return state;
};
