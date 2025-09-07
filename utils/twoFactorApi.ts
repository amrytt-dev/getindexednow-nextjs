import { postWithAuth, getWithAuth } from './fetchWithAuth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorStatus {
  enabled: boolean;
  hasSecret: boolean;
}

export interface BackupCodesResponse {
  backupCodes: string[];
  remainingCount: number;
}

export const twoFactorApi = {
  // Request 2FA enablement (send verification email)
  request2FAEnablement: async (): Promise<{ message: string }> => {
    const response = await postWithAuth('/2fa/request-enablement', {});
    return response;
  },

  // Generate 2FA setup (secret and QR code)
  generateSetup: async (): Promise<TwoFactorSetup> => {
    const response = await postWithAuth('/2fa/generate-setup', {});
    return response;
  },

  // Enable 2FA (verify token and enable)
  enable2FA: async (token: string): Promise<{ message: string }> => {
    const response = await postWithAuth('/2fa/enable', { token });
    return response;
  },

  // Disable 2FA
  disable2FA: async (): Promise<{ message: string }> => {
    const response = await postWithAuth('/2fa/disable', {});
    return response;
  },

  // Get 2FA status
  getStatus: async (): Promise<TwoFactorStatus> => {
    const response = await getWithAuth('/2fa/status');
    return response;
  },

  // Get remaining backup codes
  getBackupCodes: async (): Promise<BackupCodesResponse> => {
    const response = await getWithAuth('/2fa/backup-codes');
    return response;
  },

  // Generate new backup codes
  generateNewBackupCodes: async (): Promise<{ backupCodes: string[]; message: string }> => {
    const response = await postWithAuth('/2fa/backup-codes/generate', {});
    return response;
  },

  // Verify 2FA token during login
  verifyLoginToken: async (userId: string, token: string): Promise<{ token: string; user: any }> => {
    const response = await fetch(`${BASE_URL}/api/2fa/verify-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Invalid 2FA token');
    }
    return response.json();
  },
}; 