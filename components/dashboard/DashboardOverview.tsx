
import { ApiBalanceCard } from '@/components/ApiBalanceCard';
import { MonthlyUsageCard } from './MonthlyUsageCard';
import { CustomUserSubscription } from '@/types/subscription';

interface CreditUsage {
  indexer_used: number;
  checker_used: number;
  total_used: number;
}

interface TotalCredits {
  total_credits: number;
  subscription_credits: number;
  extra_credits: number;
}

interface DashboardOverviewProps {
  subscription: CustomUserSubscription | null;
  creditUsage: CreditUsage;
  totalCredits: TotalCredits | null;
  subscriptionLoading: boolean;
  onUsageUpdate: () => void;
}

export const DashboardOverview = ({ 
  subscription, 
  creditUsage, 
  totalCredits,
  subscriptionLoading, 
  onUsageUpdate 
}: DashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      <MonthlyUsageCard 
        subscription={subscription} 
        creditUsage={creditUsage} 
        totalCredits={totalCredits}
        subscriptionLoading={subscriptionLoading} 
      />
      <ApiBalanceCard />
    </div>
  );
};
