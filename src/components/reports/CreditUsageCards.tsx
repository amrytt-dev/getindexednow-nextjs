import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, BarChart3, Coins, Clock, Gift } from 'lucide-react';
import { safeToLocaleString } from '@/utils/creditFormatting';

interface CreditUsageData {
  month_year: string;
  indexer_used: number;
  checker_used: number;
  total_used: number;
  total_available: number;
  bonus_credits: number;
  carried_forward_credits?: number;
  held_credits: number;
  remaining_credits: number;
  period_start: string;
  period_end: string;
}

interface CreditUsageCardsProps {
  currentMonth: CreditUsageData;
}

export const CreditUsageCards = ({ currentMonth }: CreditUsageCardsProps) => {
  const usagePercentage = currentMonth && currentMonth.total_available > 0
      ? (currentMonth.total_used / (currentMonth.total_available + currentMonth.bonus_credits + (currentMonth.carried_forward_credits || 0))) * 100
      : 0;

  const hasBonusCredits = currentMonth.bonus_credits > 0;
  const hasCarry = (currentMonth.carried_forward_credits || 0) > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-5">
      <Card className="border border-gradient-to-br from-blue-50 to-indigo-50 ">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-blue-700 ">Total Available</CardTitle>
            <Coins className="h-4 w-4 text-blue-600 " />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 ">
            {safeToLocaleString(currentMonth.total_available + currentMonth.bonus_credits + (currentMonth.carried_forward_credits || 0))}
          </div>
          <p className="text-xs text-blue-600 ">
            {(hasBonusCredits || hasCarry) ? (
              <span>
                {safeToLocaleString(currentMonth.total_available)} plan
                {hasCarry ? ` + ${safeToLocaleString(currentMonth.carried_forward_credits || 0)} carry` : ''}
                {hasBonusCredits ? ` + ${safeToLocaleString(currentMonth.bonus_credits)} bonus` : ''}
              </span>
            ) : (
              'credits this month'
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="border border-gradient-to-br from-green-50 to-emerald-50 ">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-green-700 ">Credits Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 " />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 ">
            {safeToLocaleString(currentMonth.total_used)}
          </div>
          <p className="text-xs text-green-600 ">
            {usagePercentage.toFixed(1)}% of available
          </p>
        </CardContent>
      </Card>

      <Card className="border border-gradient-to-br from-amber-50 to-orange-50 ">   
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-amber-700 ">Credit Holds</CardTitle>
            <Clock className="h-4 w-4 text-amber-600 " />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900 ">
            {safeToLocaleString(currentMonth.held_credits)}
          </div>
          <p className="text-xs text-amber-600 ">credits on hold</p>
        </CardContent>
      </Card>

      <Card className="border border-gradient-to-br from-emerald-50 to-teal-50 ">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-emerald-700 ">Available Credits This Month</CardTitle>
            <Coins className="h-4 w-4 text-emerald-600 " />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-900 ">
            {safeToLocaleString(currentMonth.remaining_credits)}
          </div>
          <p className="text-xs text-emerald-600 ">
            {(hasBonusCredits || hasCarry) ? (
              <span>
                remaining (includes
                {hasCarry ? ` ${safeToLocaleString(currentMonth.carried_forward_credits || 0)} carry` : ''}
                {hasCarry && hasBonusCredits ? ' +' : ''}
                {hasBonusCredits ? ` ${safeToLocaleString(currentMonth.bonus_credits)} bonus` : ''}
                )
              </span>
            ) : (
              'remaining for this month'
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};