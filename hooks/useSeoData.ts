import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchSeoPageBySlug, PublicSeoPage } from '@/utils/seoApi';

// Define public routes that should have SEO data
const PUBLIC_ROUTES = {
  '/': 'home',
  '/about-us': 'about-us',
  '/contact-us': 'contact-us',
  '/blog': 'blog',
  '/terms-condition': 'terms-condition',
  '/help-center': 'help-center',
  '/privacy-policy': 'privacy-policy',
  '/pricing': 'pricing',
};

// Routes that should NOT have SEO data (admin, auth, protected routes)
const EXCLUDED_ROUTES = [
  '/admin',
  '/auth',
  '/dashboard',
  '/trial',
  '/tasks',
  '/reports',
  '/plans-billing',
  '/user',
  '/notifications',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/confirm-email-change',
  '/2fa',
  '/payment-success',
  '/payment-cancel',
];

export const useSeoData = () => {
  const location = useLocation();
  const [seoData, setSeoData] = useState<PublicSeoPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pathname = location.pathname;
    
    // Check if this is a public route that should have SEO data
    const isExcludedRoute = EXCLUDED_ROUTES.some(route => pathname.startsWith(route));
    
    if (isExcludedRoute) {
      setSeoData(null);
      return;
    }

    // Get the slug for this route
    let slug: string | null = null;
    
    // Check if it's a known public route
    if (PUBLIC_ROUTES[pathname as keyof typeof PUBLIC_ROUTES]) {
      slug = PUBLIC_ROUTES[pathname as keyof typeof PUBLIC_ROUTES];
    } else if (pathname !== '/' && !pathname.includes('/')) {
      // This might be a dynamic SEO page (e.g., /some-slug)
      slug = pathname.substring(1); // Remove leading slash
    }

    if (!slug) {
      setSeoData(null);
      return;
    }

    // Fetch SEO data
    setLoading(true);
    setError(null);
    
    fetchSeoPageBySlug(slug)
      .then((data) => {
        if (data && data.published) {
          setSeoData(data);
        } else {
          setSeoData(null);
        }
      })
      .catch((err) => {
        console.warn(`SEO data not found for slug: ${slug}`, err);
        setError(err.message);
        setSeoData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.pathname]);

  return { seoData, loading, error };
};
