
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Gift } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
// Removed Supabase dependency

interface ExtraCredit {
  id: string;
  credits: number;
  expires_at: string | null;
  reason: string | null;
  created_at: string;
}

export const ExtraCreditsExpiration = () => {
  const { data: extraCredits = [], isLoading } = useQuery({
    queryKey: ['extraCredits'],
    queryFn: async () => {
      // Mock extra credits data
      return [] as ExtraCredit[];
    },
  });

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (extraCredits.length === 0) {
    return null;
  }

  const getDaysRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpirationStatus = (daysRemaining: number | null) => {
    if (daysRemaining === null) return 'permanent';
    if (daysRemaining <= 0) return 'expired';
    if (daysRemaining <= 3) return 'urgent';
    if (daysRemaining <= 7) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200 ';
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200 ';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 ';
      case 'permanent':
        return 'bg-purple-100 text-purple-800 border-purple-200 ';
      default:
        return 'bg-green-100 text-green-800 border-green-200 ';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50 ">
        <CardTitle className="flex items-center space-x-2">
          <Gift className="h-5 w-5 text-purple-600 " />
          <span className="text-gray-900 ">Extra Credits</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {extraCredits.map((credit) => {
            const daysRemaining = getDaysRemaining(credit.expires_at);
            const status = getExpirationStatus(daysRemaining);
            
            return (
              <div key={credit.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  {status === 'urgent' || status === 'expired' ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Gift className="h-4 w-4 text-purple-500" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900 ">
                      {credit.credits.toLocaleString()} credits
                    </div>
                    {credit.reason && (
                      <div className="text-xs text-gray-600 ">
                        {credit.reason}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(status)} border-0`}>
                    {status === 'permanent' && 'No expiration'}
                    {status === 'expired' && 'Expired'}
                    {status === 'urgent' && `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`}
                    {status === 'warning' && `${daysRemaining} days left`}
                    {status === 'normal' && `${daysRemaining} days left`}
                  </Badge>
                  {credit.expires_at && (
                    <div className="text-xs text-gray-600  mt-1">
                      Expires: {formatDate(credit.expires_at)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
