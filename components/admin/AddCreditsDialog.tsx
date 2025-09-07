
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { Plus, Minus } from 'lucide-react';
import { UserData } from '@/types/admin';

interface AddCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null;
  onSuccess: () => void;
}

export const AddCreditsDialog = ({ open, onOpenChange, user, onSuccess }: AddCreditsDialogProps) => {
  const [credits, setCredits] = useState('');
  const [reason, setReason] = useState('');
  const [expiryDays, setExpiryDays] = useState('');
  // Remove operation state
  // const [operation, setOperation] = useState<'add' | 'remove'>('add');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const creditAmount = parseInt(credits) || 0;

    if (creditAmount === 0) {
      toast({
        title: "Invalid input",
        description: "Please enter credits to add",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Only add operation
      const finalCreditAmount = creditAmount;

      const backendBaseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${backendBaseUrl}/api/admin/users/${user.user_id}/add-credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: finalCreditAmount,
          reason: reason || undefined,
          expiryDays: expiryDays ? parseInt(expiryDays) : undefined,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add credits');
      }

      // Handle the new response structure
      if (result.code !== 0) {
        throw new Error(result.error || 'Failed to add credits');
      }

      toast({
        title: `Credits added successfully`,
        description: `Added ${finalCreditAmount} credits to ${user.email}`,
      });

      // Reset form
      setCredits('');
      setReason('');
      setExpiryDays('');
      // setOperation('add');
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error managing credits:', error);
      toast({
        title: "Error managing credits",
        description: error instanceof Error ? error.message : "Failed to manage credits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Credits to User</span>
          </DialogTitle>
        </DialogHeader>

        {user && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm font-medium text-foreground">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
              </div>
              {user.firstName && user.lastName && (
                <div className="text-xs text-muted-foreground">{user.email}</div>
              )}
              <div className="text-xs text-muted-foreground">
                Current monthly credits: {user.monthly_credits || 0}
              </div>
            </div>

            {/* Removed Operation RadioGroup - Only Add Credits allowed */}

            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min="0"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`e.g., Manual payment received, Promotional credits, etc.`}
                rows={2}
              />
            </div>

            {/* Expiry only for add credits */}
            <div className="space-y-2">
              <Label htmlFor="expiryDays">Expires in (Days) - Optional</Label>
              <Input
                id="expiryDays"
                type="number"
                min="1"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                placeholder="Leave empty for plan expiry date"
              />
              <div className="text-xs text-gray-600">
                Leave empty to set expiry at user's current plan expiry date
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Add Credits'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};