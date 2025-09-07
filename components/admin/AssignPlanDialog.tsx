import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
// Removed Supabase dependency
import { toast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { UserData } from '@/types/admin';

interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  monthly_credits: number;
}

interface AssignPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null;
  onSuccess: () => void;
}

export const AssignPlanDialog = ({ open, onOpenChange, user, onSuccess }: AssignPlanDialogProps) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPlans();
      setSelectedPlanId('');
    }
  }, [open]);

  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      // Mock plans data
      setPlans([]);
      toast({
        title: "Plan Management",
        description: "Please implement your own backend API for plan management.",
      });
    } finally {
      setPlansLoading(false);
    }
  };

  const handleAssignPlan = async () => {
    if (!user || !selectedPlanId) return;

    setLoading(true);
    try {
      console.log('Assigning plan to user:', user.user_id, 'plan:', selectedPlanId);

      const now = new Date();
      const oneMonthFromNow = new Date(now);
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

      // Mock plan assignment
      toast({
        title: "Plan Assignment",
        description: "Please implement your own backend API for plan assignment.",
      });

      toast({
        title: "Plan assigned successfully",
        description: `${user.email} has been assigned the selected plan with monthly billing period.`,
      });

      onSuccess();
      onOpenChange(false);
      setSelectedPlanId('');
    } catch (error: any) {
      console.error('Error assigning plan:', error);
      toast({
        title: "Error assigning plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlan = async () => {
    if (!user) return;

    setRemoving(true);
    try {
      // Mock plan removal
      toast({
        title: "Plan Removal",
        description: "Please implement your own backend API for plan removal.",
      });

      toast({
        title: "Plan removed successfully",
        description: `${user.email}'s subscription has been removed.`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error removing plan:', error);
      toast({
        title: "Error removing plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRemoving(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  const hasActivePlan = user?.subscription_status === 'active';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Subscription Plan</DialogTitle>
        </DialogHeader>
        
        {user && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium">User: {user.email}</p>
              <p className="text-xs text-gray-600">
                Current Plan: {user.subscription_plan_name} 
                {user.subscription_status && ` (${user.subscription_status})`}
              </p>
              {user.current_period_end && (
                <p className="text-xs text-gray-500">
                  Period ends: {new Date(user.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-select">Select New Plan</Label>
              {plansLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subscription plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        <div className="flex justify-between items-center w-full">
                          <span className="font-medium">{plan.name}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            {formatPrice(plan.price_monthly)}/mo - {plan.monthly_credits.toLocaleString()} credits
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {selectedPlanId && (
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  ⚠️ This will create a monthly subscription (30 days) starting today.
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <div className="flex space-x-2">
                {hasActivePlan && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemovePlan}
                    disabled={removing || loading}
                  >
                    {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Plan
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading || removing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignPlan}
                  disabled={loading || removing || !selectedPlanId || plansLoading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Assign Plan
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
