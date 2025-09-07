
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Removed Supabase dependency
import { RefreshCw, Zap, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ApiBalance {
  indexer: number;
  checker: number;
}

export const ApiBalanceCard = () => {
  const [balance, setBalance] = useState<ApiBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    // Mock admin status - implement your own logic
    setIsAdmin(false);
  };

  const fetchBalance = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      // Mock balance data
      setBalance({ indexer: 1000, checker: 500 });
      toast({
        title: "Balance updated",
        description: "API balance has been refreshed (mock data)",
      });
    } catch (error) {
      toast({
        title: "Error fetching balance",
        description: "Please implement your own backend API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if user is not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>API Balance</span>
              <Badge variant="outline" className="ml-2">Admin Only</Badge>
            </CardTitle>
            <CardDescription>
              Real-time credits from GetIndexedNow API
            </CardDescription>
          </div>
          <Button 
            onClick={fetchBalance} 
            disabled={loading} 
            variant="outline" 
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {balance ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Indexer Credits</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {balance.indexer.toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Checker Credits</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {balance.checker.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">Click refresh to fetch current API balance</p>
            <Button onClick={fetchBalance} disabled={loading}>
              {loading ? 'Fetching...' : 'Fetch Balance'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
