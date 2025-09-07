import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is a hash, try to scroll to that element instead of top.
    if (hash) {
      const id = hash.replace('#', '');
      // Defer until DOM updates after route change
      const scrollToHash = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };

      // Try immediately and then a few retries in case content loads late
      if (!scrollToHash()) {
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(() => {
          attempts++;
          if (scrollToHash() || attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 50);
      }
      return;
    }

    // No hash: scroll to top on pathname change
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname, hash]);
}; 