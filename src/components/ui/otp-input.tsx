import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({ length = 6, value, onChange, onComplete, disabled = false, className, autoFocus = true }, ref) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Initialize refs array
    useEffect(() => {
      inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    // Auto-focus first input
    useEffect(() => {
      if (autoFocus && inputRefs.current[0] && !disabled) {
        inputRefs.current[0].focus();
      }
    }, [autoFocus, disabled]);

    // Auto-verify when all digits are entered
    useEffect(() => {
      if (value.length === length && onComplete) {
        onComplete(value);
      }
    }, [value, length, onComplete]);

    const focusInput = useCallback((index: number) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]?.focus();
        setActiveIndex(index);
      }
    }, []);

    const handleInputChange = useCallback((index: number, inputValue: string) => {
      if (disabled) return;

      const newValue = value.split('');
      
      // Handle single digit input
      if (inputValue.length === 1) {
        newValue[index] = inputValue;
        const newString = newValue.join('');
        onChange(newString);
        
        // Move to next input if not at the end
        if (index < length - 1) {
          focusInput(index + 1);
        }
      }
      // Handle paste or multiple characters
      else if (inputValue.length > 1) {
        const pastedValue = inputValue.slice(0, length);
        const newString = pastedValue.padEnd(length, '').slice(0, length);
        onChange(newString);
        
        // Focus the next empty input or the last input
        const nextIndex = Math.min(pastedValue.length, length - 1);
        focusInput(nextIndex);
      }
    }, [value, length, onChange, focusInput, disabled]);

    const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      // Handle backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        const newValue = value.split('');
        
        if (newValue[index]) {
          // Clear current input
          newValue[index] = '';
          onChange(newValue.join(''));
        } else if (index > 0) {
          // Move to previous input and clear it
          newValue[index - 1] = '';
          onChange(newValue.join(''));
          focusInput(index - 1);
        }
      }
      // Handle arrow keys
      else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
      // Handle delete key
      else if (e.key === 'Delete') {
        e.preventDefault();
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    }, [value, length, onChange, focusInput, disabled]);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
      e.preventDefault();
      if (disabled) return;

      const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
      if (pastedData.length > 0) {
        const newValue = pastedData.slice(0, length).padEnd(length, '').slice(0, length);
        onChange(newValue);
        
        // Focus the next empty input or the last input
        const nextIndex = Math.min(pastedData.length, length - 1);
        focusInput(nextIndex);
      }
    }, [length, onChange, focusInput, disabled]);

    const handleFocus = useCallback((index: number) => {
      setActiveIndex(index);
    }, []);

    return (
      <div ref={ref} className={cn("flex gap-2 justify-center", className)}>
        {Array.from({ length }, (_, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-lg font-mono tracking-widest border-2 transition-all duration-200",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              activeIndex === index ? "border-primary bg-primary/5" : "border-border",
              value[index] ? "bg-primary/10 border-primary/50" : "bg-background",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            autoComplete="one-time-code"
          />
        ))}
      </div>
    );
  }
);

OTPInput.displayName = 'OTPInput'; 