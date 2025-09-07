import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';
import { UserData } from '@/types/admin';
import { useUpdateUser } from '@/hooks/useAdminUsers';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null;
  onSuccess?: () => void;
}

export const UserEditDialog = ({ open, onOpenChange, user, onSuccess }: UserEditDialogProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    status: 'active',
    isEmailVerified: false,
    isAdmin: false,
    isEditor: false,
  });

  const updateUserMutation = useUpdateUser();

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      status: 'active',
      isEmailVerified: false,
      isAdmin: false,
      isEditor: false,
    });
  };

  useEffect(() => {
    if (user && open) {
      console.log('UserEditDialog - Updating form data with user:', user);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        status: user.status || 'active',
        isEmailVerified: user.isEmailVerified === true,
        isAdmin: user.isAdmin === true,
        isEditor: user.isEditor === true,
      });
    } else if (!open) {
      // Reset form when dialog closes
      resetForm();
    }
  }, [user, open]);

  // Force update when user data changes (for admin status specifically)
  useEffect(() => {
    if (user && open) {
      console.log('UserEditDialog - User data changed, updating form:', {
        userId: user.user_id,
        isAdmin: user.isAdmin,
        isEditor: user.isEditor,
        fullUser: user
      });
      console.log('prev formData:', formData);
      
      // Handle undefined values more robustly
      const newIsAdmin = user.isAdmin === true;
      const newIsEditor = user.isEditor === true;
      
      setFormData(prev => ({
        ...prev,
        isAdmin: newIsAdmin,
        isEditor: newIsEditor,
      }));

      console.log('After update - new formData will be:', {
        ...formData,
        isAdmin: newIsAdmin,
        isEditor: newIsEditor,
      });
    }
  }, [user?.isAdmin, user?.isEditor, user?.user_id, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUserMutation.mutateAsync({
        userId: user.user_id,
        userData: formData,
      });
      
      // Check if admin status was changed
      if (user.isAdmin !== formData.isAdmin) {
        toast({
          title: 'Admin Status Updated',
          description: 'The user will need to log out and log back in to see the admin status changes.',
          variant: 'default',
        });
      }
      
      // Call onSuccess first to trigger refetch
      onSuccess?.();
      
      // Add a longer delay to ensure cache invalidation completes
      setTimeout(() => {
        onOpenChange(false);
      }, 500);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" key={`${user?.user_id || 'new'}-${user?.isAdmin}-${user?.isEditor}`}>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="First name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Last name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              placeholder="Contact number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Verification</Label>
                <div className="text-sm text-muted-foreground">
                  Mark user's email as verified
                </div>
              </div>
              <Switch
                checked={formData.isEmailVerified}
                onCheckedChange={(checked) => handleInputChange('isEmailVerified', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-amber-500" />
                  <Label>Admin Access</Label>
                </div>
                <div className="text-sm text-muted-foreground">
                  Grant admin privileges to this user
                </div>
              </div>
              <Switch
                checked={formData.isAdmin}
                onCheckedChange={(checked) => handleInputChange('isAdmin', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <Label>Editor Access (Blog)</Label>
                </div>
                <div className="text-sm text-muted-foreground">
                  Allow access only to Blog Management in admin
                </div>
              </div>
              <Switch
                checked={formData.isEditor}
                onCheckedChange={(checked) => handleInputChange('isEditor', checked)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};