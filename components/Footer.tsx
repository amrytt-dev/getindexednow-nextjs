import { Search, Twitter, Linkedin, Github } from "lucide-react";
import { Link } from 'react-router-dom';
import { ScrollToTopLink } from './ScrollToTopLink';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
          <div className="flex items-center ml-3 md:ml-0">
              <ScrollToTopLink to="/">
                <img src="/logo.svg" alt="GetIndexedNow Logo" className="w-48" />
              </ScrollToTopLink>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional-grade indexing tools trusted by SEO agencies and enterprise companies worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><ScrollToTopLink to="/#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</ScrollToTopLink></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">API Documentation</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><ScrollToTopLink to="/about-us" className="text-muted-foreground hover:text-foreground transition-colors">About Us</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/contact-us" className="text-muted-foreground hover:text-foreground transition-colors">Contact</ScrollToTopLink></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><ScrollToTopLink to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</ScrollToTopLink></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><ScrollToTopLink to="/help-center" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/terms-condition" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</ScrollToTopLink></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Status Page</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GetIndexedNow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;