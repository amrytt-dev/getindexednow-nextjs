import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './dashboard/DashboardSidebar';
import { MainContent } from './dashboard/MainContent';
import { DashboardLoading } from './dashboard/DashboardLoading';
import { DashboardError } from './dashboard/DashboardError';
import { NoSubscriptionView } from './dashboard/NoSubscriptionView';
   import { useDashboardData } from '@/hooks/useDashboardData';
   import { useUserCreditsQuery } from '@/hooks/useUserCreditsQuery';

export const Dashboard = () => {
  const {
    subscription,
    creditUsage,
    totalCredits,
    subscriptionLoading,
    error,
    fetchSubscription,
    handleDataRefresh
  } = useDashboardData();

  const { data: userCreditsData, isLoading: creditsLoading, error: creditsError } = useUserCreditsQuery();

  // Loading state
  if (subscriptionLoading) {
    return <DashboardLoading />;
  }

  // Error state
  if (error) {
    return (
      <DashboardError 
        error={error}
        subscription={subscription}
        monthlyUsage={creditUsage.total_used}
        onRetry={() => {
          fetchSubscription();
        }}
        onSubscriptionUpdate={fetchSubscription}
      />
    );
  }

  // No subscription state
  if (!subscription) {
    console.log('Dashboard: Rendering subscription manager - no active subscription');
    return (
      <NoSubscriptionView 
        monthlyUsage={creditUsage.total_used}
        onSubscriptionUpdate={fetchSubscription}
      />
    );
  }

  // Main dashboard for users with active subscription
  console.log('Dashboard: Rendering main dashboard - active subscription found');
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader subscription={subscription} monthlyUsage={creditUsage.total_used} userCreditsData={userCreditsData} />

      <div className="container mx-auto py-4 section-spacing">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DashboardSidebar
            subscription={subscription}
            creditUsage={creditUsage}
            totalCredits={totalCredits}
            subscriptionLoading={false}
            onUsageUpdate={handleDataRefresh}
            userCreditsData={userCreditsData}
          />

          <MainContent onTaskSubmitted={handleDataRefresh} userCreditsData={userCreditsData} />
        </div>
      </div>
    </div>
  );
};
