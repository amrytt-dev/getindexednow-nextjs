import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, Users, Calendar } from 'lucide-react';
import { useCreateNotification } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';

interface NotificationFormData {
  userId: string;
  title: string;
  message: string;
  type: 'plan' | 'invoice' | 'bonus' | 'system';
  expiresAt?: string;
}

export const NotificationManager = () => {
  const [formData, setFormData] = useState<NotificationFormData>({
    userId: '',
    title: '',
    message: '',
    type: 'system',
  });

  const createNotificationMutation = useCreateNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.title || !formData.message) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createNotificationMutation.mutateAsync({
        userId: formData.userId,
        title: formData.title,
        message: formData.message,
        type: formData.type,
        expiresAt: formData.expiresAt,
      });

      // Reset form
      setFormData({
        userId: '',
        title: '',
        message: '',
        type: 'system',
      });

      toast({
        title: 'Success',
        description: 'Notification sent successfully',
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  const handleInputChange = (field: keyof NotificationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'plan':
        return 'bg-blue-100 text-blue-800 ';
      case 'invoice':
        return 'bg-green-100 text-green-800 ';
      case 'bonus':
        return 'bg-purple-100 text-purple-800 ';
      case 'system':
        return 'bg-orange-100 text-orange-800 ';
      default:
        return 'bg-gray-100 text-gray-800 ';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/80  backdrop-blur-md">
        <CardHeader className="border-b border-gray-200 ">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 ">
              <Bell className="h-6 w-6 text-blue-600 " />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 ">
                Send Notification
              </CardTitle>
              <CardDescription className="text-gray-600 ">
                Create and send notifications to users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID */}
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-sm font-medium text-gray-700 ">
                User ID <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter user ID"
                  value={formData.userId}
                  onChange={(e) => handleInputChange('userId', e.target.value)}
                  className="flex-1"
                  required
                />
              </div>
            </div>

            {/* Notification Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-gray-700 ">
                Notification Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plan">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-800 ">
                        Plan
                      </Badge>
                      <span>Plan-related notifications</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="invoice">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800 ">
                        Invoice
                      </Badge>
                      <span>Invoice-related notifications</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bonus">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-100 text-purple-800 ">
                        Bonus
                      </Badge>
                      <span>Bonus credit notifications</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center space-x-2">
                          <Badge className="bg-orange-100 text-orange-800 ">
                        System
                      </Badge>
                      <span>System notifications</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 ">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter notification title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-gray-700 ">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Enter notification message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Expiry Date (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="text-sm font-medium text-gray-700 ">
                Expiry Date (Optional)
              </Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt || ''}
                  onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500">
                Leave empty for notifications that don't expire
              </p>
            </div>

            {/* Preview */}
            {formData.title && formData.message && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 ">
                  Preview
                </Label>
                <Card className="border border-gray-200 ">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-lg">
                          {formData.type === 'plan' ? '📋' : 
                           formData.type === 'invoice' ? '💰' : 
                           formData.type === 'bonus' ? '🎁' : '🔔'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-sm font-medium ${getTypeColor(formData.type).replace('bg-', 'text-')}`}>
                            {formData.title}
                          </h3>
                          <Badge className={getTypeColor(formData.type)}>
                            {formData.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 ">
                          {formData.message}
                        </p>
                        {formData.expiresAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Expires: {new Date(formData.expiresAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={createNotificationMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 "
            >
              {createNotificationMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send Notification
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 