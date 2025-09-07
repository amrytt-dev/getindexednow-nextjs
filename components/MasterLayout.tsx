import { useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useSeoData } from '@/hooks/useSeoData';
import { SeoHead } from '@/components/SeoHead';
import Header from './Header';
import { DashboardHeader } from './DashboardHeader';
import Footer from './Footer';

interface MasterLayoutProps {
  children: React.ReactNode;
}

export const MasterLayout = ({ children }: MasterLayoutProps) => {
  const { user, loading } = useUser();
  const location = useLocation();
  const { seoData } = useSeoData();
    
  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname.startsWith('/auth') 
  || location.pathname.startsWith('/forgot-password') 
  || location.pathname.startsWith('/reset-password')
  || location.pathname.startsWith('/verify-email') 
  || location.pathname.startsWith('/confirm-email-change')
  || location.pathname.startsWith('/verify-2fa')
  || location.pathname.startsWith('/payment-success')
  || location.pathname.startsWith('/2fa/verify')
  || location.pathname.startsWith('/payment-failed');
  
  // Show footer only when NOT on admin routes
  const showFooter = !isAdminRoute && !isAuthRoute;
    
  // Show header only when NOT on admin routes
  const showHeader = !isAdminRoute && !isAuthRoute;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Centralized SEO Head */}
      <SeoHead seoData={seoData} />
      
      {/* Dynamic Header - only show when NOT on admin routes */}
             {showHeader && (
         loading ? (
           // Show a skeleton header while checking authentication
           <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
             <div className="container flex h-14 items-center justify-between">
               {/* Logo skeleton */}
               <div className="flex items-center space-x-4">
                 <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
               </div>
               
               {/* Navigation skeleton */}
               <div className="hidden md:flex items-center space-x-6">
                 <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                 <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                 <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                 <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
               </div>
               
               {/* Right side skeleton */}
               <div className="flex items-center space-x-4">
                 <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                 <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
               </div>
             </div>
           </div>
         ) : (
           user ? <DashboardHeader /> : <Header />
         )
       )}
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Conditional Footer */}
      {showFooter && <Footer />}
    </div>
  );
}; 