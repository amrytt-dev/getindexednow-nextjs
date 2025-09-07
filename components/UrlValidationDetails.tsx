import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface UrlValidationDetailsProps {
  taskId: string;
}

interface UrlValidationData {
  code: number;
  taskId: string;
  urls: Array<{
    id: string;
    submittedUrl: string;
    submittedStatus: number | null;
    accessibleUrl: string | null;
    accessibleStatus: number | null;
    isAccessible: boolean;
    processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
    processedAt: string | null;
    errorCode: string | null;
  }>;
  total: number;
  accessible: number;
  processing: number;
  completed: number;
  failed: number;
}

export const UrlValidationDetails: React.FC<UrlValidationDetailsProps> = ({ taskId }) => {
  const [data, setData] = useState<UrlValidationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/proxy/speedyindex/url-validation/details/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch URL validation details');
      }
      
      const result: UrlValidationData = await response.json();
      setData(result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchData();
    }
  }, [taskId]);

  const getStatusIcon = (status: number | null, isAccessible: boolean) => {
    if (status === null) return <Clock className="w-4 h-4 text-gray-400" />;
    if (status === 200 && isAccessible) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status >= 400) return <XCircle className="w-4 h-4 text-red-500" />;
    return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusBadge = (status: number | null) => {
    if (status === null) return <Badge variant="secondary">Pending</Badge>;
    if (status === 200) return <Badge variant="default" className="bg-green-100 text-green-800">200 OK</Badge>;
    if (status >= 300 && status < 400) return <Badge variant="secondary" className="bg-blue-100 text-blue-800">{status} Redirect</Badge>;
    if (status >= 400 && status < 500) return <Badge variant="destructive" className="bg-red-100 text-red-800">{status} Client Error</Badge>;
    if (status >= 500) return <Badge variant="destructive" className="bg-red-100 text-red-800">{status} Server Error</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getProcessingStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredUrls = data?.urls.filter(url => {
    switch (filter) {
      case 'accessible':
        return url.isAccessible;
      case 'inaccessible':
        return !url.isAccessible && (url.processingStatus === 'completed' || url.processingStatus === 'failed');
      case 'processing':
        return url.processingStatus === 'processing';
      case 'failed':
        return url.processingStatus === 'failed';
      default:
        return true;
    }
  }) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>URL Validation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>URL Validation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <XCircle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
            <Button onClick={fetchData} className="mt-4">Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>URL Validation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No URL validation data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>URL Validation Details</CardTitle>
          <div className="flex items-center space-x-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All URLs</SelectItem>
                <SelectItem value="accessible">Accessible (200)</SelectItem>
                <SelectItem value="inaccessible">Inaccessible</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchData} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.total}</div>
            <div className="text-sm text-gray-600">Total URLs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.accessible}</div>
            <div className="text-sm text-gray-600">Accessible</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{data.processing}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{data.failed}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>
        
        {/* Summary message */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
          <p className="text-sm text-gray-600">
            You submitted <strong>{data.total} URLs</strong>. 
            {data.accessible > 0 && (
              <span> <strong>{data.accessible} URLs</strong> were valid and sent for indexing. </span>
            )}
            {data.failed > 0 && (
              <span> <strong>{data.failed} URLs</strong> were invalid and not sent for indexing. </span>
            )}
            {data.processing > 0 && (
              <span> <strong>{data.processing} URLs</strong> are still being processed. </span>
            )}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Submitted URL</TableHead>
                <TableHead>Submitted Status</TableHead>
                <TableHead>Accessible URL</TableHead>
                <TableHead>Accessible Status</TableHead>
                <TableHead>Processing</TableHead>
                <TableHead>Processed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUrls.map((url) => (
                <TableRow key={url.id}>
                  <TableCell>
                    {getStatusIcon(url.accessibleStatus, url.isAccessible)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      <a 
                        href={url.submittedUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <span className="truncate">{url.submittedUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    {url.submittedStatus !== null ? getStatusBadge(url.submittedStatus) : '-'}
                  </TableCell>
                  <TableCell>
                    {url.accessibleUrl ? (
                      <div className="max-w-xs truncate">
                        <a 
                          href={url.accessibleUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <span className="truncate">{url.accessibleUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {url.accessibleStatus !== null ? getStatusBadge(url.accessibleStatus) : '-'}
                  </TableCell>
                  <TableCell>
                    {getProcessingStatusBadge(url.processingStatus)}
                  </TableCell>
                  <TableCell>
                    {url.processedAt ? (
                      <span className="text-sm text-gray-600">
                        {new Date(url.processedAt).toLocaleString()}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUrls.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No URLs match the selected filter
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 