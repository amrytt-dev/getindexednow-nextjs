import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface CreditUsageHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export const CreditUsageHeader = ({ onRefresh, refreshing }: CreditUsageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 ">Credit Usage Report</h2>
        <p className="text-gray-600 ">Track your monthly credit consumption and usage patterns</p>
      </div>
      <Button 
        onClick={onRefresh} 
        disabled={refreshing}
        variant="outline"
        className="bg-white/80 backdrop-blur-md border-gray-200 "
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};
