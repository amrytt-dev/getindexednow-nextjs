import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

export const AdminAuthWrapper = ({ children }: AdminAuthWrapperProps) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    // Wait for user data to load
    if (userLoading) {
      return;
    }

    // Check if user is authenticated
    if (!user) {
      navigate('/auth', { replace: true, state: { from: location.pathname } });
      return;
    }

    // Check if user has admin or editor (blog) access
    if (!user.isAdmin && !user.isEditor) {
      // Redirect non-admin users to login page with a message
      navigate('/auth', { 
        replace: true, 
        state: { 
          from: location.pathname,
          message: 'Admin/editor access required. Please log in with the correct account.' 
        } 
      });
      return;
    }

    // User is authenticated and is admin
    setLoading(false);
  }, [user, userLoading, navigate, location.pathname]);

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only render children if user is authenticated and is admin
  if (!user || (!user.isAdmin && !user.isEditor)) {
    return null;
  }

  return <>{children}</>;
}; 