import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ApiBalanceCard } from '@/components/ApiBalanceCard';
import { MonthlyUsageCard } from './MonthlyUsageCard';
import { SubscriptionTimeline } from './SubscriptionTimeline';
import { ExtraCreditsExpiration } from './ExtraCreditsExpiration';
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

interface DashboardSidebarProps {
  subscription: CustomUserSubscription | null;
  creditUsage: CreditUsage;
  totalCredits: TotalCredits | null;
  subscriptionLoading: boolean;
  onUsageUpdate: () => void;
  userCreditsData?: any;
}

export const DashboardSidebar = ({ 
  subscription, 
  creditUsage, 
  totalCredits,
  subscriptionLoading, 
  onUsageUpdate,
  userCreditsData
}: DashboardSidebarProps) => {
  const [creditsOverviewOpen, setCreditsOverviewOpen] = useState(true);
  const [timelineOpen, setTimelineOpen] = useState(true);

  return (
    <div className="lg:col-span-1">
      {/* Mobile Only - Collapsible */}
      <div className="lg:hidden space-y-4">
        <Collapsible open={creditsOverviewOpen} onOpenChange={setCreditsOverviewOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-card/90 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="font-semibold">Credits Overview</span>
              {creditsOverviewOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <MonthlyUsageCard 
              subscription={subscription} 
              creditUsage={creditUsage} 
              totalCredits={totalCredits}
              subscriptionLoading={subscriptionLoading} 
              userCreditsData={userCreditsData}
            />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={timelineOpen} onOpenChange={setTimelineOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-card/90 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="font-semibold">Subscription Timeline</span>
              {timelineOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <SubscriptionTimeline subscription={subscription} userCreditsData={userCreditsData} />
          </CollapsibleContent>
        </Collapsible>

        <ExtraCreditsExpiration />
        <ApiBalanceCard />
      </div>

      {/* Desktop Only - Normal Layout */}
      <div className="hidden lg:block space-y-6">
        <MonthlyUsageCard 
          subscription={subscription} 
          creditUsage={creditUsage} 
          totalCredits={totalCredits}
          subscriptionLoading={subscriptionLoading} 
          userCreditsData={userCreditsData}
        />
        
        <SubscriptionTimeline subscription={subscription} userCreditsData={userCreditsData} />
        
        <ExtraCreditsExpiration />
        <ApiBalanceCard />
      </div>
    </div>
  );
};
