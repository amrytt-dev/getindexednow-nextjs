
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle, DialogFooter as ConfirmDialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Users, DollarSign, Zap, Package, Loader2, Power, PowerOff, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getWithAuth, postWithAuth, deleteWithAuth } from '@/utils/fetchWithAuth';
import { useUser } from '@/contexts/UserContext';

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  descriptions: string;
  includesInPlan: string;
  billingCycle: string;
  isActive: boolean;
  isFreePlan: boolean;
  activeUsers: number;
  monthlyRevenue: number;
  restrictions?: {
    price?: string;
    credits?: string;
  } | null;
}

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

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  status: string;
}

interface PlansResponse {
  code: number;
  result: {
    plans: Plan[];
    stats: {
      totalPlans: number;
      totalMonthlyRevenue: number;
    };
  };
}

export default function Plans() {
  const { user } = useUser();
  
  // Subscription Plans State
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPlans: 0,
    totalMonthlyRevenue: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    credits: '',
    descriptions: '',
    features: '',
    billingCycle: 'monthly'
  });
  const [confirmDeletePlanId, setConfirmDeletePlanId] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Admin Plans State
  const [adminPlans, setAdminPlans] = useState<AdminPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<AdminSubscription | null>(null);
  const [showAdminCreateDialog, setShowAdminCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [extensionDays, setExtensionDays] = useState('30');
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [selectedAdminUserId, setSelectedAdminUserId] = useState<string>('');
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    credits: '',
    descriptions: '',
    features: '',
    billingCycle: 'monthly'
  });

  const backendBaseUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchPlans();
    fetchAdminPlans();
    fetchCurrentSubscription();
    fetchAdminUsers();
  }, []);

  // Subscription Plans Functions
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendBaseUrl}/api/admin/plans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      const data: PlansResponse = await response.json();
      
      if (data.code === 0) {
        setPlans(data.result.plans);
        setStats(data.result.stats);
      } else {
        throw new Error('Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.credits) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const url = editingPlan 
        ? `${backendBaseUrl}/api/admin/plans/${editingPlan.id}`
        : `${backendBaseUrl}/api/admin/plans`;
      
      const method = editingPlan ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          price: Math.round(parseFloat(formData.price) * 100), // Convert to cents
          credits: parseInt(formData.credits),
          descriptions: formData.descriptions,
          includesInPlan: formData.features.split('\n').filter(f => f.trim()).join(', '),
          billingCycle: formData.billingCycle,
        }),
      });

      const data = await response.json();
      if (data.code === 0) {
        toast({
          title: "Success",
          description: editingPlan ? "Plan updated successfully" : "Plan created successfully",
        });
        setShowDialog(false);
        setFormData({
          name: '',
          price: '',
          credits: '',
          descriptions: '',
          features: '',
          billingCycle: 'monthly'
        });
        setEditingPlan(null);
        fetchPlans();
      } else {
        throw new Error(data.error || 'Failed to save plan');
      }
    } catch (error: any) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save plan",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: (plan.price / 100).toString(),
      credits: plan.credits.toString(),
      descriptions: plan.descriptions || '',
      features: plan.includesInPlan,
      billingCycle: plan.billingCycle
    });
    setShowDialog(true);
  };

  const handleDeleteClick = (planId: string) => {
    setConfirmDeletePlanId(planId);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmDeletePlanId) {
      await handleDelete(confirmDeletePlanId);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeletePlanId(null);
    setConfirmDeleteOpen(false);
  };

  const handleToggleStatus = async (planId: string) => {
    try {
      setToggling(planId);
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendBaseUrl}/api/admin/plans/${planId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.code === 0) {
        toast({
          title: "Success",
          description: "Plan status updated successfully",
        });
        fetchPlans();
      } else {
        throw new Error(data.error || 'Failed to toggle plan status');
      }
    } catch (error: any) {
      console.error('Error toggling plan status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to toggle plan status",
        variant: "destructive",
      });
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      setDeleting(planId);
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendBaseUrl}/api/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.code === 0) {
        toast({
          title: "Plan Deleted",
          description: "The plan has been deleted successfully.",
        });
        fetchPlans(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to delete plan');
      }
    } catch (error: any) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete plan",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
      setConfirmDeleteOpen(false);
      setConfirmDeletePlanId(null);
    }
  };

  // Admin Plans Functions
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

  const fetchAdminUsers = async () => {
    try {
      const data = await getWithAuth('/admin/users/admins');
      if (data.code === 0) {
        setAdminUsers(data.result.adminUsers);
      }
    } catch (error: any) {
      console.error('Error fetching admin users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin users",
        variant: "destructive",
      });
    }
  };

  const handleCreateAdminPlan = async () => {
    try {
      const data = await postWithAuth('/admin/subscriptions/plans', {
        name: adminFormData.name,
        credits: parseInt(adminFormData.credits),
        descriptions: adminFormData.descriptions,
        features: adminFormData.features.split(',').map(f => f.trim()),
        billingCycle: adminFormData.billingCycle
      });

      if (data.code === 0) {
        toast({
          title: "Success",
          description: "Admin plan created successfully",
        });
        setShowAdminCreateDialog(false);
        setAdminFormData({
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
    if (!selectedAdminUserId) {
      toast({
        title: "Error",
        description: "Please select an admin user",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await postWithAuth('/admin/subscriptions/assign', {
        userId: selectedAdminUserId,
        planId: planId
      });

      if (data.code === 0) {
        toast({
          title: "Success",
          description: "Admin plan assigned successfully",
        });
        setShowAssignDialog(false);
        setSelectedAdminUserId('');
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

  const getPlanColor = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('free')) return 'bg-gray-100 text-gray-800';
    if (name.includes('basic')) return 'bg-blue-100 text-blue-800';
    if (name.includes('pro')) return 'bg-purple-100 text-purple-800';
    if (name.includes('enterprise')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Plans</p>
                <p className="text-2xl font-bold">{stats.totalPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${(stats.totalMonthlyRevenue / 100).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscription" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Subscription Plans</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Admin Plans</span>
          </TabsTrigger>
        </TabsList>

        {/* Subscription Plans Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Subscription Plans</span>
                <Button onClick={() => setShowDialog(true)} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Plan</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card key={plan.id} className="relative border-2 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getPlanColor(plan.name)} border-0`}>
                            {plan.name}
                          </Badge>
                          <Badge variant={plan.isActive ? "default" : "secondary"} className="text-xs">
                            {plan.isActive ? "Active" : "Legacy"}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(plan.id)}
                            disabled={toggling === plan.id}
                            className={`h-8 w-8 p-0 ${plan.isActive ? 'text-green-600 hover:text-green-700' : 'text-orange-600 hover:text-orange-700'}`}
                            title={plan.isActive ? 'Deactivate Plan' : 'Activate Plan'}
                          >
                            {toggling === plan.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : plan.isActive ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(plan)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(plan.id)}
                            disabled={plan.activeUsers > 0 || deleting === plan.id}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            {deleting === plan.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="text-3xl font-bold">
                        ${ (plan.price / 100).toFixed(2) }
                        <span className="text-sm font-normal text-muted-foreground">/{plan.billingCycle}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{plan.descriptions || 'No description available'}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Credits</span>
                          <span className="text-sm">{plan.credits.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Active Users</span>
                          <span className="text-sm">{plan.activeUsers}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Features:</span>
                        <ul className="text-sm space-y-1">
                          {plan.includesInPlan.split(',').filter(f => f.trim()).map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              <span>{feature.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {plan.restrictions && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm text-yellow-800 font-medium">Edit Restrictions:</p>
                          <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                            {plan.restrictions.price && <li>• {plan.restrictions.price}</li>}
                            {plan.restrictions.credits && <li>• {plan.restrictions.credits}</li>}
                          </ul>
                        </div>
                      )}

                      {!plan.isActive && plan.activeUsers > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-800 font-medium">Legacy Plan</p>
                          <p className="text-xs text-blue-700 mt-1">
                            This plan is marked as legacy but still available for new subscriptions. Has {plan.activeUsers} active user(s).
                          </p>
                        </div>
                      )}

                      {!plan.isActive && plan.activeUsers === 0 && (
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                          <p className="text-sm text-orange-800 font-medium">Legacy Plan</p>
                          <p className="text-xs text-orange-700 mt-1">
                            This plan is marked as legacy but still available for new subscriptions.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Plans Tab */}
        <TabsContent value="admin" className="space-y-6">
          {/* Current Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current Admin Subscription Status</CardTitle>
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
                         <div>
                           <Label htmlFor="admin-user-select">Select Admin User</Label>
                           <Select value={selectedAdminUserId} onValueChange={setSelectedAdminUserId}>
                             <SelectTrigger>
                               <SelectValue placeholder="Choose an admin user" />
                             </SelectTrigger>
                             <SelectContent>
                               {adminUsers.map((adminUser) => (
                                 <SelectItem key={adminUser.id} value={adminUser.id}>
                                   {adminUser.firstName} {adminUser.lastName} ({adminUser.email})
                                 </SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                         </div>
                         
                         {selectedAdminUserId && (
                           <>
                             <p className="text-sm text-gray-600">Select an admin plan to assign:</p>
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
                           </>
                         )}
                         
                         {!selectedAdminUserId && (
                           <p className="text-sm text-gray-500">Please select an admin user first to see available plans.</p>
                         )}
                         
                         <div className="flex justify-end space-x-2 pt-4">
                           <Button variant="outline" onClick={() => {
                             setShowAssignDialog(false);
                             setSelectedAdminUserId('');
                           }}>
                             Cancel
                           </Button>
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
              <CardTitle className="flex items-center justify-between">
                <span>Available Admin Plans</span>
                <Button onClick={() => setShowAdminCreateDialog(true)} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Admin Plan</span>
                </Button>
              </CardTitle>
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
                        <Button size="sm" onClick={() => {
                          setSelectedAdminUserId(user?.id || '');
                          setShowAssignDialog(true);
                        }}>
                          Assign to Self
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedAdminUserId('');
                          setShowAssignDialog(true);
                        }}>
                          Assign to Other Admin
                        </Button>
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
        </TabsContent>
      </Tabs>

      {/* Add/Edit Subscription Plan Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Edit Plan' : 'Add New Plan'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Pro Plan"
              />
            </div>
            
            {!editingPlan && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      min="0"
                      value={formData.credits}
                      onChange={(e) => setFormData({...formData, credits: e.target.value})}
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Select value={formData.billingCycle} onValueChange={(value) => setFormData({...formData, billingCycle: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.descriptions}
                onChange={(e) => setFormData({...formData, descriptions: e.target.value})}
                placeholder="Brief description of the plan"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                placeholder="Feature 1, Feature 2, Feature 3"
                rows={4}
              />
            </div>

            {editingPlan && editingPlan.restrictions && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800 font-medium">Note:</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Price and credits cannot be modified for plans with active subscriptions.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {editingPlan ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                `${editingPlan ? 'Update' : 'Create'} Plan`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Admin Plan Dialog */}
      <Dialog open={showAdminCreateDialog} onOpenChange={setShowAdminCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Admin Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-name">Plan Name</Label>
              <Input
                id="admin-name"
                value={adminFormData.name}
                onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                placeholder="e.g., Admin Pro Plan"
              />
            </div>
            <div>
              <Label htmlFor="admin-credits">Credits</Label>
              <Input
                id="admin-credits"
                type="number"
                value={adminFormData.credits}
                onChange={(e) => setAdminFormData({ ...adminFormData, credits: e.target.value })}
                placeholder="50000"
              />
            </div>
            <div>
              <Label htmlFor="admin-descriptions">Description</Label>
              <Textarea
                id="admin-descriptions"
                value={adminFormData.descriptions}
                onChange={(e) => setAdminFormData({ ...adminFormData, descriptions: e.target.value })}
                placeholder="Description of the plan features"
              />
            </div>
            <div>
              <Label htmlFor="admin-features">Features (comma-separated)</Label>
              <Input
                id="admin-features"
                value={adminFormData.features}
                onChange={(e) => setAdminFormData({ ...adminFormData, features: e.target.value })}
                placeholder="VIP queue access, Admin features, Custom expiry"
              />
            </div>
            <div>
              <Label htmlFor="admin-billingCycle">Billing Cycle</Label>
              <Select value={adminFormData.billingCycle} onValueChange={(value) => setAdminFormData({ ...adminFormData, billingCycle: value })}>
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
              <Button variant="outline" onClick={() => setShowAdminCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAdminPlan}>
                Create Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <ConfirmDialogContent className="sm:max-w-md">
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>Confirm Delete</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <div className="py-4">
            Are you sure you want to delete this plan? This action cannot be undone.
          </div>
          <ConfirmDialogFooter>
            <Button variant="outline" onClick={handleCancelDelete} disabled={deleting !== null}>Cancel</Button>
            <Button onClick={handleConfirmDelete} disabled={deleting !== null} variant="destructive">
              {deleting !== null ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </div>
  );
}
