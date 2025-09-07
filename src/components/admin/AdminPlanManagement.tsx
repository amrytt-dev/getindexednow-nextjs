import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getWithAuth, postWithAuth, deleteWithAuth } from '@/utils/fetchWithAuth';

interface AdminPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  descriptions: string;
  includesInPlan: string;
  billingCycle: string;
  isAdminOnly: boolean;
  isActive: boolean;
  createdAt: string;
}

interface AdminSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  plan: AdminPlan;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function AdminPlanManagement() {
  const [adminPlans, setAdminPlans] = useState<AdminPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<AdminSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [extensionDays, setExtensionDays] = useState('30');
  const { toast } = useToast();

  // Form state for creating new admin plan
  const [formData, setFormData] = useState({
    name: '',
    credits: '',
    descriptions: '',
    features: '',
    billingCycle: 'monthly'
  });

  useEffect(() => {
    fetchAdminPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchAdminPlans = async () => {
    try {
      const data = await getWithAuth('/admin/subscriptions/plans');
      if (data.code === 0) {
        setAdminPlans(data.result.plans);
      }
    } catch (error: any) {
      console.error('Error fetching admin plans:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch admin plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const data = await getWithAuth('/admin/subscriptions/current');
      if (data.code === 0) {
        setCurrentSubscription(data.result.subscription);
      }
    } catch (error: any) {
      console.error('Error fetching current subscription:', error);
    }
  };

  const handleCreatePlan = async () => {
    try {
      const data = await postWithAuth('/admin/subscriptions/plans', {
        name: formData.name,
        credits: parseInt(formData.credits),
        descriptions: formData.descriptions,
        features: formData.features.split(',').map(f => f.trim()),
        billingCycle: formData.billingCycle
      });

      if (data.code === 0) {
        toast({
          title: "Success",
          description: "Admin plan created successfully",
        });
        setShowCreateDialog(false);
        setFormData({
          name: '',
          credits: '',
          descriptions: '',
          features: '',
          billingCycle: 'monthly'
        });
        fetchAdminPlans();
      }
    } catch (error: any) {
      console.error('Error creating admin plan:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin plan",
        variant: "destructive",
      });
    }
  };

  const handleAssignPlan = async (planId: string) => {
    try {
      const data = await postWithAuth('/admin/subscriptions/assign', {
        userId: localStorage.getItem('userId'), // Current admin user
        planId: planId
      });

      if (data.code === 0) {
        toast({
          title: "Success",
          description: "Admin plan assigned successfully",
        });
        setShowAssignDialog(false);
        fetchCurrentSubscription();
      }
    } catch (error: any) {
      console.error('Error assigning plan:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign plan",
        variant: "destructive",
      });
    }
  };

  const handleExtendSubscription = async () => {
    if (!currentSubscription) return;

    try {
      const data = await postWithAuth('/admin/subscriptions/extend', {
        subscriptionId: currentSubscription.id,
        extensionDays: parseInt(extensionDays)
      });

      if (data.code === 0) {
        toast({
          title: "Success",
          description: `Subscription extended by ${extensionDays} days`,
        });
        setShowExtendDialog(false);
        setExtensionDays('30');
        fetchCurrentSubscription();
      }
    } catch (error: any) {
      console.error('Error extending subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to extend subscription",
        variant: "destructive",
      });
    }
  };

  const handleRevokeSubscription = async () => {
    if (!currentSubscription) return;

    if (!confirm('Are you sure you want to revoke your current subscription?')) {
      return;
    }

    try {
      const data = await deleteWithAuth(`/admin/subscriptions/${currentSubscription.id}`);

      if (data.code === 0) {
        toast({
          title: "Success",
          description: "Subscription revoked successfully",
        });
        fetchCurrentSubscription();
      }
    } catch (error: any) {
      console.error('Error revoking subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to revoke subscription",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading admin plan management...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Plan Management</h2>
        <div className="space-x-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>Create Admin Plan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Admin Plan</DialogTitle>
                <DialogDescription>
                  Create a new admin-only plan with custom credits and features.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Admin Pro Plan"
                  />
                </div>
                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="descriptions">Description</Label>
                  <Textarea
                    id="descriptions"
                    value={formData.descriptions}
                    onChange={(e) => setFormData({ ...formData, descriptions: e.target.value })}
                    placeholder="Description of the plan features"
                  />
                </div>
                <div>
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Input
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="VIP queue access, Admin features, Custom expiry"
                  />
                </div>
                <div>
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Select value={formData.billingCycle} onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePlan}>
                    Create Plan
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          {currentSubscription ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{currentSubscription.plan.name}</h3>
                  <p className="text-sm text-gray-600">{currentSubscription.plan.descriptions}</p>
                </div>
                <Badge variant={currentSubscription.isActive ? "default" : "secondary"}>
                  {currentSubscription.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Credits:</span> {currentSubscription.plan.credits.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Billing Cycle:</span> {currentSubscription.plan.billingCycle}
                </div>
                <div>
                  <span className="font-medium">Start Date:</span> {new Date(currentSubscription.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">End Date:</span> {new Date(currentSubscription.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex space-x-2">
                <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Extend Subscription</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Extend Subscription</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="extensionDays">Extension Days</Label>
                        <Input
                          id="extensionDays"
                          type="number"
                          value={extensionDays}
                          onChange={(e) => setExtensionDays(e.target.value)}
                          placeholder="30"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowExtendDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleExtendSubscription}>
                          Extend
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm" onClick={handleRevokeSubscription}>
                  Revoke Subscription
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No active subscription found</p>
              <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                <DialogTrigger asChild>
                  <Button>Assign Admin Plan</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Admin Plan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Select an admin plan to assign to yourself:</p>
                    <div className="space-y-2">
                      {adminPlans.map((plan) => (
                        <div key={plan.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <h4 className="font-medium">{plan.name}</h4>
                            <p className="text-sm text-gray-600">{plan.credits.toLocaleString()} credits</p>
                          </div>
                          <Button size="sm" onClick={() => handleAssignPlan(plan.id)}>
                            Assign
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Admin Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Admin Plans</CardTitle>
          <CardDescription>
            Admin-only plans that can be assigned to admin users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {adminPlans.length > 0 ? (
            <div className="space-y-4">
              {adminPlans.map((plan) => (
                <div key={plan.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{plan.name}</h3>
                      <Badge variant={plan.isActive ? "default" : "secondary"}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">Admin Only</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{plan.descriptions}</p>
                    <div className="flex space-x-4 mt-2 text-sm">
                      <span><strong>Credits:</strong> {plan.credits.toLocaleString()}</span>
                      <span><strong>Billing:</strong> {plan.billingCycle}</span>
                      <span><strong>Price:</strong> Free</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Features:</strong> {plan.includesInPlan}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!currentSubscription && (
                      <Button size="sm" onClick={() => handleAssignPlan(plan.id)}>
                        Assign to Self
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No admin plans available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 