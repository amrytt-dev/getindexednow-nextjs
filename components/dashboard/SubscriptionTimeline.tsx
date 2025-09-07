import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { CustomUserSubscription } from '@/types/subscription';

interface SubscriptionTimelineProps {
  subscription: CustomUserSubscription | null;
  userCreditsData?: any;
}

export const SubscriptionTimeline = ({ subscription, userCreditsData }: SubscriptionTimelineProps) => {
  const loading = !userCreditsData;
  const error = null;

  if (loading) return <Card><CardContent>Loading subscription...</CardContent></Card>;
  if (error || !userCreditsData) return <Card><CardContent>{error || 'No data'}</CardContent></Card>;

  // Use backend data for plan information
  const planName = userCreditsData.planName || 'Free';
  const startDate = new Date(userCreditsData.planStart || new Date());
  const endDate = new Date(userCreditsData.planEnd || new Date());
  const now = new Date();
  const totalPeriod = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  const progress = totalPeriod > 0 ? Math.min(100, Math.max(0, (elapsed / totalPeriod) * 100)) : 0;
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <Card className="border-0 shadow-xl bg-white backdrop-blur-md">
      <CardHeader className="bg-gradient-to-br from-primary to-primary/50 rounded-t-lg pb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-white" />
          <CardTitle className="text-white text-2xl font-bold">Subscription Timeline</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-white rounded-b-lg">
        <div className="flex items-center justify-between mb-4">
          <Badge className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">{planName} Plan</Badge>
          <div className="flex items-center space-x-1 text-gray-500 text-xs">
            <Clock className="h-4 w-4" />
            <span>{daysRemaining} days remaining</span>
          </div>
        </div>

        {/* Warning Message */}
        {userCreditsData.warning && (
          <div className="mb-4 p-3 rounded-lg bg-amber-100 border border-amber-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-amber-800 font-medium">
                {userCreditsData.warning}
              </span>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-700 font-semibold">Billing Cycle</span>
          <span className="text-gray-400 text-sm">{Math.round(progress)}% elapsed</span>
        </div>
        <Progress value={progress} className="h-3 bg-gray-200 [&>div]:bg-green-500" />
        <div className="flex justify-between text-xs text-gray-400 mt-1 mb-4">
          <span>Started: {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span>Renews: {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <hr className="border-gray-200 my-4" />
        <div className="text-center">
          <div className="text-gray-900 text-base mb-1">
            Your credits refresh in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-gray-500">
            Next billing cycle: {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
