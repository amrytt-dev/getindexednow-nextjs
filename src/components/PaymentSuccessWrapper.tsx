import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PaymentSuccess } from '../pages/PaymentSuccess';

export const PaymentSuccessWrapper = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Redirect to dashboard if no session_id is present
    if (!sessionId) {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [sessionId, navigate]);

  // Don't render anything if no session_id
  if (!sessionId) {
    return null;
  }

  return <PaymentSuccess />;
};
