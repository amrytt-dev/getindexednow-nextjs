import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Pencil, X, Check, User, Mail, Phone, Edit3 } from 'lucide-react';
import { getWithAuth, putWithAuth } from '@/utils/fetchWithAuth';
import { EmailChangeDialog } from '@/components/EmailChangeDialog';

export const UserSettingProfile = () => {
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', contactNumber: '' });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', contactNumber: '' });
  const [loading, setLoading] = useState(false);
  const [showEmailChangeDialog, setShowEmailChangeDialog] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getWithAuth<any>('/user/profile');
      setProfile(data);
      setForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        contactNumber: data.contactNumber || '',
      });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load profile', variant: 'destructive' });
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      contactNumber: profile.contactNumber || '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await putWithAuth<any>('/user/profile', form);
      setProfile(data);
      setEditMode(false);
      toast({ title: 'Profile updated', description: 'Your profile was updated successfully.' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChangeSuccess = () => {
    // Refresh profile data to get updated email
    fetchProfile();
    setShowEmailChangeDialog(false);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="shadow-none border bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <CardTitle className="text-xl lg:text-2xl font-semibold">Profile Settings</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">Manage your personal information</p>
              </div>
            </div>
            {!editMode && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEdit} 
              >
                <Pencil className="h-4 w-4 text-primary" />
                
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pb-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-google-blue" />
                  First Name
                </label>
                <Input
                  name="firstName"
                  placeholder="Enter your first name"
                  value={editMode ? form.firstName : profile.firstName || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="h-11 transition-all duration-200 border-border/50 focus:border-google-blue"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-google-blue" />
                  Last Name
                </label>
                <Input
                  name="lastName"
                  placeholder="Enter your last name"
                  value={editMode ? form.lastName : profile.lastName || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="h-11 transition-all duration-200 border-border/50 focus:border-google-blue"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-google-blue" />
                  Email Address
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmailChangeDialog(true)}
                  className="h-8 px-3 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Change Email
                </Button>
              </div>
              <Input
                name="email"
                placeholder="your@email.com"
                type="email"
                value={profile.email || ''}
                disabled
                className="h-11 bg-muted/30 transition-all duration-200 border-border/30"
              />
              <p className="text-xs text-muted-foreground">Click "Change Email" to update your email address</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-google-blue" />
                Contact Number
              </label>
              <Input
                name="contactNumber"
                placeholder="Enter your phone number"
                value={editMode ? form.contactNumber : profile.contactNumber || ''}
                onChange={handleChange}
                disabled={!editMode}
                className="h-11 transition-all duration-200 border-border/50 focus:border-google-blue"
              />
            </div>
            
            {editMode && (
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/20">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel} 
                  disabled={loading}
                  className="flex-1 sm:flex-none h-11 px-6"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 sm:flex-none h-11 px-6 text-white bg-primary hover:bg-primary/80 hover:text-white"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>

    {/* Email Change Dialog */}
    <EmailChangeDialog
      isOpen={showEmailChangeDialog}
      onClose={() => setShowEmailChangeDialog(false)}
      currentEmail={profile.email}
    />
    </>
  );
}