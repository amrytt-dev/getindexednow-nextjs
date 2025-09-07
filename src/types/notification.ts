export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'plan' | 'invoice' | 'bonus' | 'system';
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  meta?: Record<string, any>;
}

export interface NotificationResponse {
  code: number;
  result: Notification[];
}

export interface UnreadCountResponse {
  code: number;
  result: {
    count: number;
  };
}

export interface NotificationActionResponse {
  code: number;
  result: {
    success: boolean;
  };
}

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'plan' | 'invoice' | 'bonus' | 'system';
  expiresAt?: string;
  meta?: Record<string, any>;
} 