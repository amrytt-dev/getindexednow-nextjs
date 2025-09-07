
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { DashboardHeader } from '../DashboardHeader';
import { SubscriptionManager } from '../SubscriptionManager';
import { CustomUserSubscription } from '@/types/subscription';

interface DashboardErrorProps {
  error: string;
  subscription: CustomUserSubscription | null;
  monthlyUsage: number;
  onRetry: () => void;
  onSubscriptionUpdate: () => void;
}

export const DashboardError = ({ error, subscription, monthlyUsage, onRetry, onSubscriptionUpdate }: DashboardErrorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 ">
      <DashboardHeader subscription={subscription} monthlyUsage={monthlyUsage} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-red-200 bg-red-50 ">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-700 mb-4">
              {error}
            </p>
            <button 
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <SubscriptionManager onSubscriptionUpdate={onSubscriptionUpdate} />
        </div>
      </div>
    </div>
  );
};
