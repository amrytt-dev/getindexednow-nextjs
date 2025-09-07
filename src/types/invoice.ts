export interface Invoice {
  id: string;
  userId: string;
  month: number;
  year: number;
  totalCredits: number;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'generated' | 'sent';
  generatedAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}



export interface InvoiceDetails {
  invoice: Invoice;
  creditUsageDetails: Array<{
    id: string;
    amount: number;
    createdAt: string;
    taskId?: string;
    task?: {
      id: string;
      title: string;
      status: string;
    };
  }>;
}

export interface InvoiceResponse {
  code: number;
  result?: Invoice | Invoice[] | InvoiceDetails;
  message?: string;
  error?: string;
}

export interface DownloadResponse {
  success: boolean;
  message?: string;
  error?: string;
} 