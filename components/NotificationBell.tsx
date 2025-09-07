import { useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // React Query hooks
  const { data: notifications = [], isLoading: loading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();

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
      case 'plan':
        return '📋';
      case 'invoice':
        return '💰';
      case 'bonus':
        return '🎁';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'plan':
        return 'text-blue-600 ';
      case 'invoice':
        return 'text-green-600 ';
      case 'bonus':
        return 'text-purple-600 ';
      case 'system':
        return 'text-orange-600 ';
      default:
        return 'text-gray-600 ';
    }
  };



  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-72 max-h-80">
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-medium">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-6 px-2 text-xs"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-100">
          {loading ? (
            <div className="p-3 text-center text-xs text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-3 text-center text-xs text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      <span className="text-base">{getNotificationIcon(notification.type)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-medium ${getNotificationColor(notification.type)} truncate`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-1">
                          {!notification.isRead && (
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-4 w-4 p-0 hover:bg-red-100 "
                          >
                            <Trash2 className="h-2 w-2 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-5 px-1.5 text-xs hover:bg-green-100 "
                          >
                            <Check className="h-2.5 w-2.5 text-green-500 mr-1" />
                            Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 