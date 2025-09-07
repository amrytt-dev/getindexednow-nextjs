
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ScrollToTopLink } from './ScrollToTopLink';
import { CreditCard, ArrowRight, AlertTriangle, Zap, Check, Loader2 } from 'lucide-react';
// Removed Supabase dependency

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  monthly_credits: number;
  is_popular: boolean;
}

interface SubscriptionManagerProps {
  onSubscriptionUpdate: () => void;
}

export const SubscriptionManager = ({ onSubscriptionUpdate }: SubscriptionManagerProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock plans data
      const mockPlans: Plan[] = [
        {
          id: 'starter',
          name: 'Starter',
          price_monthly: 2900,
          monthly_credits: 1000,
          is_popular: false
        },
        {
          id: 'professional',
          name: 'Professional',
          price_monthly: 7900,
          monthly_credits: 3000,
          is_popular: true
        }
      ];
      setPlans(mockPlans);
    } catch (error) {
      setError(`Please implement your own backend API`);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border-gray-200">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading subscription plans...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Failed to Load Plans
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button 
              onClick={fetchPlans}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Warning - More Prominent */}
      <Card className="border-orange-200 bg-orange-50 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-orange-800 text-xl">
            <AlertTriangle className="h-6 w-6" />
            <span>No Active Subscription</span>
          </CardTitle>
          <CardDescription className="text-orange-700 text-base">
            You need an active monthly subscription to access IndexedNow features. 
            Subscribe now to get unified credits that refresh every month.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Monthly Plans Preview - Enhanced */}
      <Card className="border-blue-200 bg-blue-50 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-blue-800 text-xl">
            <Zap className="h-6 w-6" />
            <span>Monthly Subscription Plans</span>
          </CardTitle>
          <CardDescription className="text-blue-700 text-base">
            Recurring monthly payments with unified credits for indexing and checking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {plans.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className={`bg-white p-6 rounded-xl border ${
                    plan.is_popular 
                      ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
                      : 'border-blue-200 shadow-md'
                  } relative transform hover:scale-105 transition-transform duration-200`}>
                    {plan.is_popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1">
                        Most Popular
                      </Badge>
                    )}
                    <div className="text-center space-y-3">
                      <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                      <div className="text-3xl font-bold text-blue-600">${formatPrice(plan.price_monthly)}</div>
                      <div className="text-sm text-gray-600 font-medium">per month</div>
                      <div className="text-lg font-semibold text-gray-700">
                        {plan.monthly_credits.toLocaleString()} Credits/month
                      </div>
                      <div className="flex items-center justify-center text-sm text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        Use for indexing or checking
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center space-y-4">
                <ScrollToTopLink to="/plans-billing">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold" size="lg">
                    View All Monthly Plans & Subscribe
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </ScrollToTopLink>
                
                <p className="text-sm text-gray-500">
                  Cancel anytime • No setup fees • Instant activation
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No subscription plans available at the moment.
              </p>
              <Button onClick={fetchPlans} variant="outline">
                Refresh Plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Get Started Message - Enhanced */}
      <Card className="border-green-200 bg-green-50 shadow-md">
        <CardContent className="p-6 text-center">
          <CreditCard className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-green-800 mb-2">
            Ready to Get Started?
          </h3>
          <p className="text-green-700 mb-6">
            Choose a monthly plan with unified credits that refresh every month. 
            Start indexing your URLs and checking their status immediately after subscription.
          </p>
          <ScrollToTopLink to="/plans-billing">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold">
              Choose Your Plan Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </ScrollToTopLink>
        </CardContent>
      </Card>
    </div>
  );
};
