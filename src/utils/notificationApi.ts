import {
  NotificationResponse,
  UnreadCountResponse,
  NotificationActionResponse,
  CreateNotificationData,
} from "@/types/notification";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class NotificationApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/api/notifications${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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
