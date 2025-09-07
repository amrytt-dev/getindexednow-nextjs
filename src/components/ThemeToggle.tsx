import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-8 h-8 flex items-center justify-center rounded-full bg-gray-200  transition-colors duration-300 focus:outline-none focus:ring-0"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="w-4 h-4 text-yellow-300" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="w-4 h-4 text-yellow-500" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}; 