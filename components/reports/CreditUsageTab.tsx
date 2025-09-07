import { useCreditUsageData } from '@/hooks/useCreditUsageData';
import { CreditUsageHeader } from './CreditUsageHeader';
import { CreditUsageCards } from './CreditUsageCards';
import { CreditUsageTable } from './CreditUsageTable';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CreditUsageTab = ({usageData, loading, error, refreshing, handleRefresh}: {
  usageData: any; loading: boolean; error: unknown; refreshing: boolean; handleRefresh: () => Promise<void>;
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  } 

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load credit usage
          </h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'An error occurred while loading credit usage data'}
          </p>
          <Button onClick={handleRefresh} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const currentMonth = usageData[0];

  return (
    <div className="space-y-6">
      {/*<CreditUsageHeader onRefresh={handleRefresh} refreshing={refreshing} />*/}

      {currentMonth && (
        <CreditUsageCards currentMonth={currentMonth} />
      )}
      <div className="border-b"></div>
      <CreditUsageTable usageData={usageData} />
    </div>
  );
};
