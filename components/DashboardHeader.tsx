import { useState, useEffect } from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import { ScrollToTopLink } from './ScrollToTopLink';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Settings, LogOut, User, Crown, Zap, CreditCard, Shield, LayoutDashboard, ListTodo, BarChart3, CreditCard as CreditCardIcon, Bell, Menu, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useUserCreditsQuery } from '@/hooks/useUserCreditsQuery';
import { NotificationBell } from '@/components/NotificationBell';
// import { ThemeToggle } from './ThemeToggle'; // Removed - forcing light mode only
import { useTheme } from '@/components/ThemeProvider';

interface DashboardHeaderProps {
  subscription?: any;
  monthlyUsage?: number;
  userCreditsData?: any;
}

export const DashboardHeader = ({ subscription, monthlyUsage, userCreditsData }: DashboardHeaderProps) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const { data: creditsInfo, isLoading: creditsLoading } = useUserCreditsQuery();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      // Use the logout function from user context
      logout();
      
      // Redirect handled inside authService.logout
    } catch (error) {
      toast({
        title: 'Sign out failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Navigation items for mobile sidebar
  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard'
    },
    {
      path: '/tasks',
      label: 'Tasks'

    },
    {
      path: '/reports',
      label: 'Reports'
    },
    {
      path: '/plans-billing',
      label: 'Plans & Billing'
    },
    {
      path: '/user/setting/profile',
      label: 'Settings'
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Hamburger menu and logo */}
            <div className="flex items-center">
              {/* Mobile Hamburger Button - positioned at the far left */}
              <button
                className="md:hidden p-3 rounded-xl hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              {/* Logo - visible on both mobile and desktop */}
              <div className="flex items-center ml-3 md:ml-0">
                <ScrollToTopLink to="/"><img src="/logo.svg" alt="GetIndexedNow Logo" className="w-48" /></ScrollToTopLink>
              </div>
            </div>

            {/* Center - Desktop Navigation (hidden on mobile) */}
            <nav className="hidden md:flex flex-1 justify-center space-x-2">
              <button
                onClick={() => navigate('/dashboard')}
                className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'text-secondary elevation-2'
                    : 'text-muted-foreground'
                }`}
              >

                <span>Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/tasks')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === '/tasks'
                    ? 'text-secondary  elevation-2'
                    : 'text-muted-foreground'
                }`}
              >
                <span>Tasks</span>
              </button>
              <button
                onClick={() => navigate('/reports')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === '/reports'
                    ? 'text-secondary  elevation-2'
                    : 'text-muted-foreground'
                }`}
              >

                <span>Reports</span>
              </button>
              <button
                onClick={() => navigate('/plans-billing')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === '/plans-billing'
                    ? 'text-secondary  elevation-2'
                    : 'text-muted-foreground'
                }`}
              >

                <span>Plans & Billing</span>
              </button>
              <button
                onClick={() => navigate('/user/setting/profile')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname.startsWith('/user/setting')
                    ? 'text-secondary  elevation-2'
                    : 'text-muted-foreground'
                }`}
              >

                <span>Settings</span>
              </button>
            </nav>

            {/* Right side - Theme toggle, notifications, and user menu */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/*<ThemeToggle />*/}
              <NotificationBell />
              
              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.email || 'User'} />
                      <AvatarFallback className="bg-gradient-to-r from-secondary to-primary text-white text-sm font-medium">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName && user?.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : user?.email || 'User'
                        }
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || 'Loading...'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/user/setting/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/plans-billing')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Plans & Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/user/setting/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {(user?.isAdmin || user?.isEditor) && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden
        `}
      >
        {/* Sidebar Content */}
        <div className="flex flex-col h-full bg-card elevation-4">
          {/* Logo Section - Centered and properly sized */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <img
              src="/logo.svg"
              alt="GetIndexedNow Logo"
              className="h-10 w-auto max-w-[180px] object-contain"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary text-foreground/60 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-6">
            <div className="space-y-2">
              {navigationItems.map(item => {
                
                const isActive = location.pathname === item.path || 
                  (item.path === '/user/setting/profile' && location.pathname.startsWith('/user/setting'));
                
                return (
                  <button
                    key={item.path}
                    onClick={() => { 
                      navigate(item.path); 
                      setMobileMenuOpen(false); 
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium
                      ${isActive 
                        ? 'text-secondary  elevation-2' 
                        : 'text-foreground hover:bg-secondary'
                      }
                    `}
                  >
                    {/* <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} /> */} 
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Admin Panel Link */}
              {(user?.isAdmin || user?.isEditor) && (
                <button
                  onClick={() => { 
                    navigate('/admin'); 
                    setMobileMenuOpen(false); 
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium
                    ${location.pathname === '/admin'
                      ? 'bg-accent text-accent-foreground elevation-2'
                      : 'text-foreground hover:bg-secondary'
                    }
                  `}
                >
                  {/* <Shield className={`w-5 h-5 ${location.pathname === '/admin' ? 'text-accent-foreground' : 'text-accent'}`} /> */}
                  <span>Admin Panel</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
