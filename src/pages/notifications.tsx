import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, Trash2, Filter, CheckCheck } from "lucide-react";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { AuthWrapper } from "@/components/AuthWrapper";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  // React Query hooks
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    switch (activeTab) {
      case "unread":
        return !notification.isRead;
      case "read":
        return notification.isRead;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  // Delete notification
  const deleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_completed":
        return "✅";
      case "task_failed":
        return "❌";
      case "subscription":
        return "💳";
      case "system":
        return "🔔";
      default:
        return "📢";
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "task_completed":
        return "text-green-600";
      case "task_failed":
        return "text-red-600";
      case "subscription":
        return "text-blue-600";
      case "system":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <AuthWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your account activity
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Your Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Manage your notifications and stay informed about your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="read">
                  Read ({notifications.length - unreadCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <ScrollArea className="h-[600px] w-full">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No notifications
                      </h3>
                      <p className="text-muted-foreground">
                        {activeTab === "unread"
                          ? "You're all caught up! No unread notifications."
                          : activeTab === "read"
                          ? "No read notifications yet."
                          : "You don't have any notifications yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border ${
                            notification.isRead
                              ? "bg-muted/50 border-muted"
                              : "bg-background border-border shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <span className="text-2xl">
                                {getNotificationIcon(notification.type)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`font-medium ${getNotificationColor(
                                    notification.type
                                  )}`}
                                >
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {formatDistanceToNow(
                                    new Date(notification.createdAt),
                                    { addSuffix: true }
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {!notification.isRead && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AuthWrapper>
  );
}
