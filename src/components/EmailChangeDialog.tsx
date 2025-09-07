import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { emailChangeApi } from '@/utils/fetchWithAuth';
import { twoFactorApi } from '@/utils/twoFactorApi';
import { Mail, Shield, AlertTriangle, CheckCircle, X, RefreshCw } from 'lucide-react';
import { OTPInput } from '@/components/ui/otp-input';
import { useDebounce } from '@/hooks/useDebounce';

interface EmailChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
}

type DialogStep = 'input' | 'confirm' | '2fa' | 'success' | 'error';

export const EmailChangeDialog: React.FC<EmailChangeDialogProps> = ({
  isOpen,
  onClose,
  currentEmail,
}) => {
  const [step, setStep] = useState<DialogStep>('input');
  const [newEmail, setNewEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [emailValidationError, setEmailValidationError] = useState('');
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);

  // Debounce email validation to avoid too many API calls
  const debouncedEmail = useDebounce(newEmail, 500);

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setNewEmail('');
      setOtpValue('');
      setError('');
      setRequires2FA(false);
      setPendingEmail('');
      setEmailValidationError('');
      setIsValidatingEmail(false);
    }
  }, [isOpen]);

  // Real-time email validation
  useEffect(() => {
    const validateEmail = async () => {
      if (!debouncedEmail || debouncedEmail === currentEmail) {
        setEmailValidationError('');
        setIsValidatingEmail(false);
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(debouncedEmail)) {
        setEmailValidationError('Please enter a valid email address');
        setIsValidatingEmail(false);
        return;
      }

      setIsValidatingEmail(true);
      setEmailValidationError('');

      try {
        // Use the dedicated validation endpoint
        const result = await emailChangeApi.validateEmail(debouncedEmail);
        
        if (result.available) {
          setEmailValidationError(''); // Email is available
        } else {
          setEmailValidationError(result.error || 'Email validation failed');
        }
      } catch (err: any) {
        if (err.message && err.message.includes('already in use')) {
          setEmailValidationError('This email address is already in use');
        } else {
          setEmailValidationError('Failed to validate email address');
        }
      } finally {
        setIsValidatingEmail(false);
      }
    };

    validateEmail();
  }, [debouncedEmail, currentEmail]);

  const handleInitiateChange = async () => {
    if (!newEmail || newEmail === currentEmail) {
      setError('Please enter a different email address');
      return;
    }

    if (emailValidationError) {
      setError(emailValidationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await emailChangeApi.initiateChange(newEmail);
      
      if (result.error) {
        setError(result.error);
        setStep('error');
        return;
      }

      setRequires2FA(result.requires2FA);
      setPendingEmail(result.newEmail);

      if (result.requires2FA) {
        setStep('2fa');
      } else {
        setStep('success');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate email change');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerification = async (code?: string) => {
    const tokenToVerify = code || otpValue;
    
    if (!tokenToVerify || tokenToVerify.length !== 6) {
      setError('Please enter a valid 6-digit 2FA code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await emailChangeApi.verifyWith2FA(tokenToVerify);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to verify 2FA token');
      // Clear the OTP input on error
      setOtpValue('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = (value: string) => {
    // Auto-verify when all 6 digits are entered
    handle2FAVerification(value);
  };

  const handleCancel = async () => {
    try {
      await emailChangeApi.cancelChange();
    } catch (err) {
      console.error('Failed to cancel email change:', err);
    }
    onClose();
  };

  const renderInputStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-email">Current Email</Label>
        <Input
          id="current-email"
          value={currentEmail}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-email">New Email Address</Label>
        <div className="relative">
          <Input
            id="new-email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email address"
            className={emailValidationError ? 'border-red-500' : ''}
          />
          {isValidatingEmail && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        {emailValidationError && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {emailValidationError}
          </p>
        )}
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Changing your email address will require confirmation from both your current and new email addresses.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleInitiateChange} 
          disabled={isLoading || isValidatingEmail || !!emailValidationError || !newEmail || newEmail === currentEmail}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </Button>
      </div>
    </div>
  );

  const render2FAStep = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-blue-600">
        <Shield className="h-5 w-5" />
        <span className="font-medium">Two-Factor Authentication Required</span>
      </div>
      
      <p className="text-sm text-gray-600">
        Please enter your 2FA code to confirm the email change request.
      </p>

      <div className="space-y-4">
        <div className="text-center">
          <Label className="text-sm font-medium text-foreground mb-4 block">
            2FA Verification Code
          </Label>
          <OTPInput
            length={6}
            value={otpValue}
            onChange={setOtpValue}
            onComplete={handleOTPComplete}
            disabled={isLoading}
            className="mb-4"
          />
          <p className="text-xs text-muted-foreground">
            Code will be verified automatically when all 6 digits are entered
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Verifying code...
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={() => handle2FAVerification()} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Email Change Request Sent</span>
      </div>
      
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              We've sent a confirmation email to your current email address:
            </p>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">{currentEmail}</span>
                <span className="text-xs text-gray-500">(Current email)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please check your current email address and click the confirmation link to proceed with the email change.
          After confirmation, you'll receive a verification email at your new address.
          The links will expire in 24 hours.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );

  const renderErrorStep = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-red-600">
        <X className="h-5 w-5" />
        <span className="font-medium">Error</span>
      </div>
      
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setStep('input')}>
          Try Again
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );

  const getStepContent = () => {
    switch (step) {
      case 'input':
        return renderInputStep();
      case '2fa':
        return render2FAStep();
      case 'success':
        return renderSuccessStep();
      case 'error':
        return renderErrorStep();
      default:
        return renderInputStep();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'input':
        return 'Change Email Address';
      case '2fa':
        return 'Verify 2FA Code';
      case 'success':
        return 'Email Change Requested';
      case 'error':
        return 'Error';
      default:
        return 'Change Email Address';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'input':
        return 'Enter your new email address to begin the change process.';
      case '2fa':
        return 'Enter your two-factor authentication code to verify this change.';
      case 'success':
        return 'Your email change request has been initiated. Please check your current email address for confirmation.';
      case 'error':
        return 'An error occurred while processing your request.';
      default:
        return 'Enter your new email address to begin the change process.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
          <DialogDescription>{getStepDescription()}</DialogDescription>
        </DialogHeader>
        {getStepContent()}
      </DialogContent>
    </Dialog>
  );
}; 