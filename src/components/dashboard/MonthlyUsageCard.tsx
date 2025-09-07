import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart3, Calendar, Clock, Info } from 'lucide-react';
import { useBonusCredits } from '@/hooks/useBonusCredits';
import { useUserCreditsQuery } from '@/hooks/useUserCreditsQuery';
import { useTasksArray } from '@/hooks/useTasksQueries';
import { useUser } from '@/contexts/UserContext';
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

interface MonthlyUsageCardProps {
  subscription: CustomUserSubscription | null;
  creditUsage: CreditUsage;
  totalCredits: TotalCredits | null;
  subscriptionLoading: boolean;
  userCreditsData?: any;
  hideScheduledDowngradeMessage?: boolean;
}

export const MonthlyUsageCard = ({ subscription, userCreditsData, creditUsage, totalCredits, subscriptionLoading, hideScheduledDowngradeMessage = false }: MonthlyUsageCardProps) => {
  const { user } = useUser();
  const { data: currentUserCreditsData, refetch: refetchUserCredits } = useUserCreditsQuery();
  const { data: indexerTasks = [] } = useTasksArray('indexer', user?.id);
  const { data: checkerTasks = [] } = useTasksArray('checker', user?.id);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use the most up-to-date credits data
  const creditsData = currentUserCreditsData || userCreditsData;
  const loading = !creditsData;
  const error = null;
  const { bonusCredits, loading: loadingBonusCredits, error: bonusError, refetch } = useBonusCredits();
  
  console.log(creditsData);

  // Check if there are any active tasks that might affect credits
  const hasActiveTasks = [...indexerTasks, ...checkerTasks].some(task => 
    !task.is_completed
  );

  // Set up polling for credits when there are active tasks
  useEffect(() => {
    if (hasActiveTasks) {
      // Poll every 30 seconds when there are active tasks
      pollingIntervalRef.current = setInterval(() => {
        console.log('Polling for credit updates due to active tasks');
        refetchUserCredits();
      }, 30000); // 30 seconds
    } else {
      // Clear polling when no active tasks
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [hasActiveTasks, refetchUserCredits]);

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md">
        <CardContent className="p-6 text-center">Loading credits...</CardContent>
      </Card>
    );
  }
  if (error || !creditsData) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md">
        <CardContent className="p-6 text-center text-red-500">{error || 'No data'}</CardContent>
      </Card>
    );
  }

  // If a downgrade is scheduled, show only a single-line text above the card
  let scheduledDowngradeText = null;
  if (creditsData.scheduledDowngrade && !hideScheduledDowngradeMessage) {
    const { toPlanName, effectiveDate } = creditsData.scheduledDowngrade;
    scheduledDowngradeText = (
      <div className="mb-2 text-sm text-orange-700 font-medium">
        Your plan will be downgraded to <strong>{toPlanName}</strong> on <strong>{new Date(effectiveDate).toLocaleDateString()}</strong>.
      </div>
    );
  }

  console.log('subscription', subscription);

  // Use backend data consistently - get all credit info from creditsData
  const totalCreditsValue = creditsData.totalCredits ?? 0;
  const bonusCreditsTotal = creditsData.bonusCredits ?? 0;
  const usedCredits = creditsData.usedCredits ?? 0;
  const heldCredits = creditsData.heldCredits ?? 0;
  const remainingCredits = creditsData.creditsAvailable ?? 0;
  const totalConsumed = usedCredits + heldCredits;
  const totalAvailableCredits = totalCreditsValue + bonusCreditsTotal;
  const usagePercentage = totalAvailableCredits > 0 ? (totalConsumed / totalAvailableCredits) * 100 : 0;

  // Calculate days until next billing using backend data
  const now = new Date();
  const endDate = new Date(creditsData.planEnd || subscription?.current_period_end || new Date());
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  // Minimal progress bar for /plans-billing (when hideScheduledDowngradeMessage is true)
  if (hideScheduledDowngradeMessage) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <Badge 
              variant="outline" 
              className="bg-blue-50 text-blue-700 border-blue-200 "
            >
              {creditsData.planName || subscription?.subscription_plans?.name || 'No Active Plan'}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-900 ">Credits Used</span>
              <span className="text-gray-600 ">
                {totalConsumed} / {totalCreditsValue}
              </span>
            </div>
            <Progress value={Math.max(0, usagePercentage)} className="h-3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md">
      <CardHeader className="border-b bg-gradient-to-br from-secondary to-secondary/50 ">
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-white " />
          <span className="text-white ">Credits Overview</span>
        </CardTitle>
        <CardDescription className="text-white ">
          Current month usage and remaining credits
        </CardDescription>
        {scheduledDowngradeText}
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <Badge 
            variant="outline" 
            className="bg-blue-50 text-blue-700 border-blue-200 "
          >
            {creditsData.planName || subscription?.subscription_plans?.name || 'No Active Plan'}
          </Badge>
        </div>

        {/* Timeline Section */}
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-100 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600 " />
              <span className="text-sm font-medium text-gray-900 ">
                Credits refresh in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
              </span>
            </div>
            {daysRemaining <= 7 && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 ">
                <Clock className="w-3 h-3 mr-1" />
                Soon
              </Badge>
            )}
          </div>
          <div className="text-xs text-gray-600  mt-1">
            Next billing: {endDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>

        {/* Warning Message */}
        {creditsData.warning && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50/50  border border-amber-200 ">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-amber-700  font-medium">
                {creditsData.warning}
              </span>
            </div>
          </div>
        )}

        {/* All Credits Consumed Warning */}
        {totalConsumed >= totalCreditsValue && totalCreditsValue > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-red-50/50  border border-red-200 ">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-red-700  font-medium">
                All credits consumed ({totalConsumed}/{totalCreditsValue}). Cannot create new tasks until credits are released or plan is upgraded.
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Total Credits Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-900 ">Total Credits</span>
              <span className="text-gray-600 ">
                {totalConsumed} / {totalAvailableCredits} consumed
              </span>
            </div>
            <Progress value={Math.max(0, usagePercentage)} className="h-3" />
            <div className="flex justify-between text-xs text-gray-600 ">
              <span>{remainingCredits} remaining</span>
              <span>{Math.max(0, usagePercentage).toFixed(1)}% consumed</span>
            </div>
          </div>

          {/* Credit Breakdown */}
          <div className="pt-4 border-t ">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 ">Used Credits</span>
                <span className="font-medium text-green-600 ">
                  {usedCredits}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 ">Held Credits</span>
                <span className="font-medium text-amber-600 ">
                  {heldCredits}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 ">Available Credits</span>
                <span className="font-medium text-blue-600 ">
                  {remainingCredits}
                </span>
              </div>
              {(creditsData.bonusCredits || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 ">Bonus Credits</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-medium text-purple-600 cursor-help inline-flex items-center space-x-1">
                          <span>{creditsData.bonusCredits || 0}</span>
                          <Info className="h-3 w-3" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        {loadingBonusCredits ? (
                          <div className="text-sm">Loading bonus credits...</div>
                        ) : bonusCredits.length > 0 ? (
                          <div className="space-y-2">
                            <div className="font-medium text-sm">Bonus Credits History:</div>
                            {bonusCredits.map((credit, index) => (
                              <div key={credit.id || index} className="text-xs space-y-1 border-l-2 border-purple-200 pl-2">
                                <div className="font-medium text-purple-600">+{credit.amount} credits</div>
                                {credit.reason && (
                                  <div className="text-muted-foreground">Reason: {credit.reason}</div>
                                )}
                                {credit.expiresAt && (
                                  <div className="text-muted-foreground">
                                    Expires: {new Date(credit.expiresAt).toLocaleDateString()}
                                  </div>
                                )}
                                <div className="text-muted-foreground">
                                  Added: {new Date(credit.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm">No bonus credits found</div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  </div>
                )}
            </div>
          </div>

          {/* Plan Details */}
          <div className="pt-4 border-t ">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 ">Monthly Plan Credits</span>
                <span className="font-medium text-gray-900 ">
                  {totalCreditsValue}
                </span>
              </div>
              {(creditsData.bonusCredits || 0) > 0 && (
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 ">Total Available Credits</span>
                  <span className="font-medium text-gray-900 ">
                    {totalAvailableCredits} (Plan: {totalCreditsValue} + Bonus: {bonusCreditsTotal})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
