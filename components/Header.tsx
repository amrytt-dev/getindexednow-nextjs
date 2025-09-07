import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import {useUser} from "@/contexts/UserContext";
import {Link} from "react-router-dom";
import { ScrollToTopLink } from './ScrollToTopLink';

const Header = () => {
  const { user } = useUser();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Logo - visible on both mobile and desktop */}
            <div className="flex items-center ml-3 md:ml-0">
              <ScrollToTopLink to="/">
                <img src="/logo.svg" alt="GetIndexedNow Logo" className="w-48" />
              </ScrollToTopLink>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="/#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </a>
            <a href="/#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {!user ? (
                <>
                <ScrollToTopLink to="/auth">
                  <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                    Sign In
                  </Button>
                </ScrollToTopLink>
                <ScrollToTopLink to="/auth">
                  <Button variant="hero" size="sm">
                    Get Started
                  </Button>
                </ScrollToTopLink>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </>
            ) : (
                <ScrollToTopLink to="/dashboard">
                  <Button variant="hero" size="lg">Dashboard</Button>
                </ScrollToTopLink>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;