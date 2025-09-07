import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { useInvoices } from '@/hooks/useInvoices';
import { toast } from '@/hooks/use-toast';

interface InvoiceSectionProps {
  className?: string;
}

export const InvoiceSection: React.FC<InvoiceSectionProps> = ({ className }) => {
  const { invoices, loading, error, downloadInvoice } = useInvoices();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (invoiceId: string) => {
    try {
      setDownloading(invoiceId);
      const success = await downloadInvoice(invoiceId);
      if (success) {
        toast({
          title: "Success",
          description: "Invoice downloaded successfully!",
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to download invoice",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100); // Convert cents to dollars
  };

  const getMonthName = (month: number) => {
    const date = new Date(2024, month - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'generated':
        return 'default';
      case 'sent':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Invoiced</h2>
      
      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading invoices...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No invoices generated yet. Invoices are automatically generated for your plan subscriptions when they end.
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">
                        {getMonthName(invoice.month)} {invoice.year}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(invoice.totalAmount)}</p>
                      <p className="text-sm text-gray-500">{invoice.totalCredits} credits included</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Generated</p>
                      <p className="font-medium">
                        {invoice.generatedAt ? formatDate(invoice.generatedAt) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="font-medium">{formatDate(invoice.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(invoice.id)}
                      disabled={downloading === invoice.id}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {downloading === invoice.id ? 'Downloading...' : 'Download PDF'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 