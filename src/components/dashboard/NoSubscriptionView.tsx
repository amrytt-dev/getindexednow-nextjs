
import { DashboardHeader } from '../DashboardHeader';
import { SubscriptionManager } from '../SubscriptionManager';

interface NoSubscriptionViewProps {
  monthlyUsage: number;
  onSubscriptionUpdate: () => void;
}

export const NoSubscriptionView = ({ monthlyUsage, onSubscriptionUpdate }: NoSubscriptionViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 ">
      <DashboardHeader subscription={null} monthlyUsage={monthlyUsage} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Welcome to IndexedNow
          </h1>
          <p className="text-gray-600 text-lg">
            Choose a monthly subscription plan to get started with unified credits
          </p>
        </div>
        
        <SubscriptionManager onSubscriptionUpdate={onSubscriptionUpdate} />
      </div>
    </div>
  );
};
