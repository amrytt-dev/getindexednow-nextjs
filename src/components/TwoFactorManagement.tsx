import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Shield, Smartphone, AlertTriangle, CheckCircle, Mail, Loader2 } from 'lucide-react';
import { twoFactorApi } from '@/utils/twoFactorApi';
import { TwoFactorSetup } from './TwoFactorSetup';

interface TwoFactorManagementProps {
  onStatusChange?: () => void;
  showSetupDirectly?: boolean;
}

export const TwoFactorManagement = ({ onStatusChange, showSetupDirectly = false }: TwoFactorManagementProps) => {
  const [status, setStatus] = useState<{ enabled: boolean; hasSecret: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(showSetupDirectly);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [isRequestingEmail, setIsRequestingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  // Update showSetup when showSetupDirectly prop changes
  useEffect(() => {
    if (showSetupDirectly) {
      setShowSetup(true);
      setShowEmailVerification(false);
      setEmailSent(false);
    }
  }, [showSetupDirectly]);

  const loadStatus = async () => {
    try {
      const statusData = await twoFactorApi.getStatus();
      setStatus(statusData);
    } catch (error) {
      toast({
        title: 'Failed to load 2FA status',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setIsRequestingEmail(true);
    try {
      // Don't wait for email sending - return immediately
      twoFactorApi.request2FAEnablement().catch((error) => {
        console.error('Failed to send email:', error);
        // Log the error but don't show to user since we already showed success
      });
      
      setEmailSent(true);
      setShowEmailVerification(true);
      toast({
        title: 'Verification email sent',
        description: 'Please check your email and click the verification link to proceed with 2FA setup.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to send verification email',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRequestingEmail(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      await twoFactorApi.disable2FA();
      setStatus({ enabled: false, hasSecret: false });
      onStatusChange?.();
      toast({
        title: '2FA disabled',
        description: 'Two-factor authentication has been disabled for your account.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to disable 2FA',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    setShowEmailVerification(false);
    setEmailSent(false);
    loadStatus();
    onStatusChange?.();
  };

  const handleSetupCancel = () => {
    setShowSetup(false);
    setShowEmailVerification(false);
    setEmailSent(false);
  };

  if (isLoading) {
    return (
      <Card className="shadow-none border bg-gradient-to-br from-background to-muted/20">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading 2FA status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showSetup) {
    return <TwoFactorSetup onSetupComplete={handleSetupComplete} onCancel={handleSetupCancel} />;
  }

  if (showEmailVerification) {
    return (
      <Card className="shadow-none border bg-gradient-to-br from-background to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Verification Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-muted-foreground">
            <p className="mb-4">
              To enable two-factor authentication, we need to verify your email address first.
            </p>
            <p>
              This extra security step ensures that only you can enable 2FA on your account.
            </p>
          </div>

          {emailSent ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Verification Email Sent</p>
                  <p className="text-sm text-green-700">
                    Please check your email and click the verification link to proceed.
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-2">What happens next?</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Click the verification link in your email</li>
                      <li>• You'll be redirected back to this page</li>
                      <li>• Then you can scan the QR code and set up 2FA</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSetupCancel}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleEnable2FA} disabled={isRequestingEmail}>
                  {isRequestingEmail ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Email...
                    </div>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Resend Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-2">Security Verification</p>
                    <p className="text-muted-foreground">
                      We'll send a verification email to your registered email address. 
                      This ensures that only you can enable 2FA on your account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSetupCancel}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleEnable2FA} 
                  disabled={isRequestingEmail}
                  className="flex-1"
                >
                  {isRequestingEmail ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Email...
                    </div>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Verification Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card className="shadow-none border bg-gradient-to-br from-background to-muted/20">
        <CardContent className="flex items-center justify-center py-12">
          <span className="text-muted-foreground">Failed to load 2FA status</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
            <p className="text-muted-foreground mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {status.enabled ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">2FA is Enabled</p>
                <p className="text-sm text-green-700">
                  Your account is protected with two-factor authentication
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-2">Security Status</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Two-factor authentication is active</li>
                    <li>• You'll need a 6-digit code to sign in</li>
                    <li>• Your account is protected against unauthorized access</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <div className="max-w-2xl">
                <Button 
                  variant="destructive" 
                  onClick={handleDisable2FA}
                  className="w-full sm:w-auto h-11 px-8"
                >
                  <Shield className="h-4 w-6 mr-2" />
                  Disable 2FA
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">2FA is Disabled</p>
                <p className="text-sm text-amber-700">
                  Enable two-factor authentication for enhanced security
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-2">Why enable 2FA?</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Protects your account even if password is compromised</li>
                    <li>• Requires a second factor (your phone) to sign in</li>
                    <li>• Industry standard security practice</li>
                    <li>• Required for many compliance standards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-1">Email Verification Required</p>
                  <p className="text-blue-700">
                    To enable 2FA, you'll need to verify your email address first. 
                    We'll send you a verification link to ensure only you can enable this security feature.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                onClick={handleEnable2FA}
                disabled={isRequestingEmail}
                className="w-full h-11"
              >
                {isRequestingEmail ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Email...
                  </div>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Enable Two-Factor Authentication
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 