
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface ReportViewerProps {
  report: {
    task: any;
    links: any[];
    summary: any;
  };
  onClose: () => void;
}

export const ReportViewer = ({ report, onClose }: ReportViewerProps) => {
  const { task, links } = report;

  const getStatusIcon = (isIndexed: boolean | null) => {
    if (isIndexed === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (isIndexed === false) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getStatusBadge = (isIndexed: boolean | null) => {
    if (isIndexed === true) {
      return <Badge variant="default" className="bg-green-500">Indexed</Badge>;
    } else if (isIndexed === false) {
      return <Badge variant="destructive">Not Indexed</Badge>;
    }
    return <Badge variant="secondary">Unknown</Badge>;
  };

  const getErrorDescription = (errorCode: string | null) => {
    if (!errorCode || errorCode === '0') return null;
    
    const errorDescriptions: Record<string, string> = {
      '-1': 'Meta tag noindex found on page',
      '404': 'Page not found (404 error)',
      '500': 'Server error (500)',
      '503': 'Service unavailable (503)',
      '403': 'Forbidden access (403)',
      '401': 'Unauthorized access (401)',
    };
    
    return errorDescriptions[errorCode] || `HTTP Status Code: ${errorCode}`;
  };

  const handleViewOnGoogle = (url: string) => {
    // Search for the exact URL instead of just the domain
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`"${url}"`)}`;
    window.open(googleSearchUrl, '_blank');
  };

  const indexedCount = links.filter(link => link.is_indexed === true).length;
  const notIndexedCount = links.filter(link => link.is_indexed === false).length;
  const unknownCount = links.filter(link => link.is_indexed === null).length;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Indexing Report for {task.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{links.length}</div>
              <div className="text-sm text-blue-600">Total URLs</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{indexedCount}</div>
              <div className="text-sm text-green-600">Indexed by Google</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{notIndexedCount}</div>
              <div className="text-sm text-red-600">Not Indexed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{unknownCount}</div>
              <div className="text-sm text-gray-600">Unknown Status</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detailed Results</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Status</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Title/Status</TableHead>
                    <TableHead>Error</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {getStatusIcon(link.is_indexed)}
                      </TableCell>
                      <TableCell>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {link.url}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(link.is_indexed)}
                          {link.title && (
                            <div className="text-sm text-muted-foreground">
                              {link.title}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {link.error_code && link.error_code !== '0' && (
                          <div className="space-y-1">
                            <Badge variant="outline">{link.error_code}</Badge>
                            <div className="text-xs text-muted-foreground">
                              {getErrorDescription(link.error_code)}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOnGoogle(link.url)}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View on Google
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
