
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Removed Supabase dependency
import { toast } from '@/hooks/use-toast';
import { Check, Zap, CreditCard, Crown, Star, Building, Loader2 } from 'lucide-react';

interface SubscriptionPlansDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionPlansDialog = ({ open, onOpenChange }: SubscriptionPlansDialogProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 45,
      credits: 800,
      indexerCredits: 400,
      checkerCredits: 400,
      costPerCredit: '$0.056',
      features: [
        '800 Credits per package',
        '400 Indexer + 400 Checker credits',
        '$0.056/credit',
        'VIP queue access'
      ],
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      color: 'border-blue-200 hover:border-blue-300'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 99,
      credits: 2000,
      indexerCredits: 1000,
      checkerCredits: 1000,
      costPerCredit: '$0.050',
      features: [
        '2,000 Credits per package',
        '1,000 Indexer + 1,000 Checker credits',
        '$0.050/credit',
        'VIP queue access'
      ],
      icon: <CreditCard className="h-6 w-6 text-green-600" />,
      color: 'border-green-200 hover:border-green-300',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 219,
      credits: 4800,
      indexerCredits: 2400,
      checkerCredits: 2400,
      costPerCredit: '$0.046',
      features: [
        '4,800 Credits per package',
        '2,400 Indexer + 2,400 Checker credits',
        '$0.046/credit',
        'VIP queue access'
      ],
      icon: <Star className="h-6 w-6 text-purple-600" />,
      color: 'border-purple-200 hover:border-purple-300'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 449,
      credits: 12000,
      indexerCredits: 6000,
      checkerCredits: 6000,
      costPerCredit: '$0.037',
      features: [
        '12,000 Credits per package',
        '6,000 Indexer + 6,000 Checker credits',
        '$0.037/credit',
        'VIP queue access'
      ],
      icon: <Crown className="h-6 w-6 text-orange-600" />,
      color: 'border-orange-200 hover:border-orange-300'
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: 749,
      credits: 20000,
      indexerCredits: 10000,
      checkerCredits: 10000,
      costPerCredit: '$0.037',
      features: [
        '20,000 Credits per package',
        '10,000 Indexer + 10,000 Checker credits',
        '$0.037/credit',
        'VIP queue access'
      ],
      icon: <Building className="h-6 w-6 text-red-600" />,
      color: 'border-red-200 hover:border-red-300'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      price: 1499,
      credits: 40000,
      indexerCredits: 20000,
      checkerCredits: 20000,
      costPerCredit: '$0.037',
      features: [
        '40,000 Credits per package',
        '20,000 Indexer + 20,000 Checker credits',
        '$0.037/credit',
        'VIP queue access'
      ],
      icon: <Building className="h-6 w-6 text-indigo-600" />,
      color: 'border-indigo-200 hover:border-indigo-300'
    }
  ];

  const handlePurchase = async (planId: string) => {
    setLoading(planId);
    try {
      toast({
        title: "Payment System",
        description: "Please implement your own payment system.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Please implement your own payment system.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Credit-based pricing that includes both indexer and checker credits
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative transition-all duration-300 ${plan.color} ${plan.popular ? 'scale-105 shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}
              

              
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600"> one-time</span>
                </div>
                <div className="text-sm text-gray-600">
                  {plan.credits.toLocaleString()} Total Credits
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full mt-6"
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loading === plan.id}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Purchase Plan'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>All plans include indexer and checker credits</p>
          <p>Credits never expire and can be used anytime</p>
          <p>VIP queue: 5min crawler visits for all plans</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
