import {
  NotificationResponse,
  UnreadCountResponse,
  NotificationActionResponse,
  CreateNotificationData,
} from "@/types/notification";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

class NotificationApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const body = options.body;
    const method = options.method || (body ? "POST" : "GET");
    return await fetchWithAuth<T>(`/notifications${endpoint}`, {
      method,
      body:
        typeof body === "string" || body instanceof FormData ? body : undefined,
      headers: options.headers,
    });
  }

  // Get all notifications for the current user
  async getNotifications(): Promise<NotificationResponse> {
    return this.request<NotificationResponse>("");
  }

  // Get unread notifications count
  async getUnreadCount(): Promise<UnreadCountResponse> {
    return this.request<UnreadCountResponse>("/unread-count");
  }

  // Mark a notification as read
  async markAsRead(
    notificationId: string
  ): Promise<NotificationActionResponse> {
    return this.request<NotificationActionResponse>(`/${notificationId}/read`, {
      method: "PATCH",
    });
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<NotificationActionResponse> {
    return this.request<NotificationActionResponse>("/mark-all-read", {
      method: "PATCH",
    });
  }

  // Delete a notification
  async deleteNotification(
    notificationId: string
  ): Promise<NotificationActionResponse> {
    return this.request<NotificationActionResponse>(`/${notificationId}`, {
      method: "DELETE",
    });
  }

  // Create a notification (admin only)
  async createNotification(
    data: CreateNotificationData
  ): Promise<NotificationResponse> {
    return this.request<NotificationResponse>("", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const notificationApi = new NotificationApiService();
