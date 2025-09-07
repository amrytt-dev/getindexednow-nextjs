import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Gift } from 'lucide-react';
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
  is_current?: boolean;
}

interface CreditUsageTableProps {
  usageData: CreditUsageData[];
}

export const CreditUsageTable = ({ usageData }: CreditUsageTableProps) => {
  if (usageData.length === 0) {
    return (
        <Card className="border-0 border-[#dadce0] rounded-lg overflow-hidden shadow-md">
          <CardHeader className="border-b bg-[#f8f9fa] ">
            <CardTitle className="text-xl text-[#202124] " >
              Monthly Usage History
            </CardTitle>
            <CardDescription className="text-[#5f6368] ">
              Detailed breakdown of your credit usage over time
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 mx-auto text-[#dadce0] mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-[#202124] " >
                No Usage Data
              </h3>
              <p className="text-[#5f6368] ">
                Start using credits to see your usage history here
              </p>
            </div>
          </CardContent>
        </Card>
    );
  }

  return (
      <Card className="border-0 p-5">
        <CardHeader className="border-b bg-[#f8f9fa] ">
          <CardTitle className="text-xl text-[#202124] ">
            Monthly Usage History
          </CardTitle>
          <CardDescription className="text-[#5f6368] ">
            Detailed breakdown of your credit usage over time
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8f9fa] ">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                  Total Available
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                  Bonus Credits
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                  Total Used
                </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                  Remaining
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                  Usage %
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                  Held Credits
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-[#e8eaed] ">
              {usageData.map((month) => {
                const totalAvailableWithExtras = month.total_available + month.bonus_credits + (month.carried_forward_credits || 0);
                const usagePercent = totalAvailableWithExtras > 0
                    ? (month.total_used / totalAvailableWithExtras) * 100
                    : 0;
                const isCurrentBillingCycle = month.is_current === true;
                const hasBonusCredits = month.bonus_credits > 0;
                const hasCarry = (month.carried_forward_credits || 0) > 0;

                return (
                    <tr key={month.month_year} className={`hover:bg-[#f8f9fa] ${isCurrentBillingCycle ? 'bg-[#e8f0fe]' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-[#202124] ">
                            {new Date(month.month_year + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                          </span>
                          {isCurrentBillingCycle && (
                            <Badge className="ml-2 bg-[#e8f0fe] text-[#1a73e8] rounded-full px-3">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-[#5f6368] mt-1">
                          {new Date(month.period_start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          {" - "}
                          {new Date(month.period_end).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#202124] ">
                        <div>
                          <div className="font-medium">{safeToLocaleString(totalAvailableWithExtras)}</div>
                          {(hasBonusCredits || hasCarry) && (
                            <div className="text-xs text-[#5f6368]">
                              {safeToLocaleString(month.total_available)} plan
                              {hasCarry ? ` + ${safeToLocaleString(month.carried_forward_credits || 0)} carry` : ''}
                              {hasBonusCredits ? ` + ${safeToLocaleString(month.bonus_credits)} bonus` : ''}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#202124] ">
                        {hasBonusCredits ? (
                          <div className="flex items-center">
                            <Gift className="h-4 w-4 text-[#ea4335] mr-1" />
                            <span className="text-[#ea4335] font-medium">{safeToLocaleString(month.bonus_credits)}</span>
                          </div>
                        ) : (
                          <span className="text-[#5f6368]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#202124] ">
                        {safeToLocaleString(month.total_used)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#202124] ">
                        {safeToLocaleString(month.remaining_credits)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <div className="w-full bg-[#e8eaed] rounded-full h-2 mr-2">
                            <div
                                className={`h-2 rounded-full ${usagePercent > 90 ? 'bg-[#ea4335]' : 'bg-[#34a853]'}`}
                                style={{ width: `${Math.min(100, usagePercent)}%` }}
                            ></div>
                          </div>
                          <span className={`${usagePercent > 90 ? 'text-[#ea4335]' : 'text-[#34a853]'}`}>
                          {usagePercent.toFixed(1)}%
                        </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#202124] ">
                        {safeToLocaleString(month.held_credits)}
                      </td>
                    </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
  );
};