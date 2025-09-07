import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Shield, QrCode, Key, Download, AlertTriangle } from 'lucide-react';
import { twoFactorApi } from '@/utils/twoFactorApi';
import { OTPInput } from '@/components/ui/otp-input';

interface TwoFactorSetupProps {
  onSetupComplete: () => void;
  onCancel: () => void;
}

export const TwoFactorSetup = ({ onSetupComplete, onCancel }: TwoFactorSetupProps) => {
  const [step, setStep] = useState<'loading' | 'qr' | 'verify' | 'backup'>('loading');
  const [setup, setSetup] = useState<any | null>(null);
  const [otpValue, setOtpValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    generateSetup();
  }, []);

  const generateSetup = async () => {
    try {
      const setupData = await twoFactorApi.generateSetup();
      setSetup(setupData);
      setStep('qr');
    } catch (error) {
      toast({
        title: 'Setup failed',
        description: 'Failed to generate 2FA setup. Please try again.',
        variant: 'destructive',
      });
      onCancel();
    }
  };

  const handleVerifyToken = async (code?: string) => {
    const tokenToVerify = code || otpValue;
    
    if (!tokenToVerify || tokenToVerify.length !== 6) {
      toast({
        title: 'Invalid token',
        description: 'Please enter a 6-digit verification code.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await twoFactorApi.enable2FA(tokenToVerify);
      setStep('backup');
    } catch (error: any) {
      toast({
        title: 'Verification failed',
        description: error.message || 'Invalid verification code.',
        variant: 'destructive',
      });
      setOtpValue('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPComplete = (value: string) => {
    handleVerifyToken(value);
  };

  const handleComplete = () => {
    toast({
      title: '2FA enabled successfully',
      description: 'Two-factor authentication is now active on your account.',
    });
    onSetupComplete();
  };

  const downloadBackupCodes = () => {
    if (!setup?.backupCodes) return;
    
    const codesText = `GetIndexedNow - Backup Codes

IMPORTANT: Keep these backup codes in a safe place. You can use them to access your account if you lose your authenticator app.

Backup Codes:
${setup.backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

Instructions:
- Each code can only be used once
- Use these codes if you lose access to your authenticator app
- Store them securely - they provide access to your account
- You can generate new backup codes from your account settings

Generated on: ${new Date().toLocaleDateString()}
`;
    
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'getindexednow-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (step === 'loading') {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Generating 2FA setup...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'qr') {
    return (
      <Card>
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <QrCode className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold">Scan QR Code</CardTitle>
          <p className="text-sm text-muted-foreground">Set up your authenticator app</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded border">
              <img 
                src={setup?.qrCodeUrl} 
                alt="QR Code for 2FA setup" 
                className="w-48 h-48"
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center space-y-1">
            <p>1. Open your authenticator app (Google Authenticator, Authy, etc.)</p>
            <p>2. Scan the QR code above</p>
            <p>3. Enter the 6-digit code from your app below</p>
          </div>

          <div className="space-y-3">
            <OTPInput
              length={6}
              value={otpValue}
              onChange={setOtpValue}
              onComplete={handleOTPComplete}
              disabled={isSubmitting}
            />

            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => handleVerifyToken()}
                disabled={isSubmitting || otpValue.length !== 6}
                className="flex-1"
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Enable 2FA'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'backup') {
    return (
      <Card>
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold">Backup Codes</CardTitle>
          <p className="text-sm text-muted-foreground">Save these codes in a secure location</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-amber-800 mb-1">Important Security Information</p>
                <ul className="space-y-0.5 text-amber-700">
                  <li>• Each backup code can only be used once</li>
                  <li>• Use these codes if you lose access to your authenticator app</li>
                  <li>• Store them securely - they provide access to your account</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-muted p-3 rounded">
            <div className="grid grid-cols-2 gap-2">
              {setup?.backupCodes.map((code, index) => (
                <div key={index} className="bg-background p-2 rounded border font-mono text-center text-sm font-semibold">
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadBackupCodes} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleComplete} className="flex-1">
              Complete Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}; 