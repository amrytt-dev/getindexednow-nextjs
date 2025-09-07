
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from './UserManagement';
// Removed Supabase dependency
import { Shield } from 'lucide-react';

export const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    // Mock admin status - implement your own logic
    setIsAdmin(false);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-800">
          <Shield className="h-5 w-5" />
          <span>Admin Panel</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
