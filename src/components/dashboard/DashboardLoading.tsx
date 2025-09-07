
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { DashboardHeader } from '../DashboardHeader';

export const DashboardLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 ">
      
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-gray-200 ">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading your dashboard...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your subscription details
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
