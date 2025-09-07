import { useState, useEffect } from 'react';
import { getWithAuth } from '@/utils/fetchWithAuth';

interface BonusCredit {
  id: string;
  amount: number;
  reason?: string;
  expiresAt?: string;
  createdAt: string;
}

interface UseBonusCreditsReturn {
  bonusCredits: BonusCredit[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useBonusCredits = (): UseBonusCreditsReturn => {
  const [bonusCredits, setBonusCredits] = useState<BonusCredit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBonusCredits = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getWithAuth<any>('/user/bonus-credits');
      
      if (result.code === 0) {
        setBonusCredits(result.result.bonusCredits || []);
      } else {
        throw new Error(result.error || 'Failed to fetch bonus credits');
      }
    } catch (err) {
      console.error('Error fetching bonus credits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bonus credits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonusCredits();
  }, []);

  return {
    bonusCredits,
    loading,
    error,
    refetch: fetchBonusCredits,
  };
}; 