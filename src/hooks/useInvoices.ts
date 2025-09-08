import { useState, useEffect } from "react";
import { Invoice, InvoiceDetails, InvoiceResponse } from "../types/invoice";
import { getWithAuth, downloadWithAuth } from "@/utils/fetchWithAuth";

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const data: InvoiceResponse = await getWithAuth<InvoiceResponse>(
        "/invoices"
      );

      if (data.code === 0 && Array.isArray(data.result)) {
        setInvoices(data.result as Invoice[]);
      } else {
        throw new Error(data.message || "Failed to fetch invoices");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const downloadInvoice = async (invoiceId: string): Promise<boolean> => {
    try {
      console.log("🔄 Starting invoice download for:", invoiceId);

      console.log(
        "📡 Making request to:",
        `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${invoiceId}/download`
      );

      // Create a timeout promise
      const timeoutPromise = new Promise<Response>((_, reject) => {
        setTimeout(
          () => reject(new Error("Download timeout - request took too long")),
          30000
        ); // 30 seconds
      });

      // Create the download promise
      const downloadPromise = downloadWithAuth(
        `/invoices/${invoiceId}/download`
      );

      // Race between timeout and download
      const res = await Promise.race([downloadPromise, timeoutPromise]);

      console.log("📡 Response status:", res.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(res.headers.entries())
      );

      // Check if response is ok
      if (!res.ok) {
        let errorMessage = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = res.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Get the filename from the response headers
      const contentDisposition = res.headers.get("content-disposition");
      let filename = `invoice-${invoiceId.slice(0, 8)}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      console.log("📁 Filename:", filename);

      // Check content type
      const contentType = res.headers.get("content-type");
      console.log("📄 Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/pdf")) {
        console.warn("⚠️ Unexpected content type:", contentType);
        // Try to get error message from response
        try {
          const errorText = await res.text();
          console.error("❌ Error response:", errorText);
          throw new Error(
            `Unexpected content type: ${contentType}. Response: ${errorText}`
          );
        } catch (textError) {
          throw new Error(`Unexpected content type: ${contentType}`);
        }
      }

      // Create blob and download
      const blob = await res.blob();
      console.log("📦 Blob size:", blob.size, "bytes");
      console.log("📦 Blob type:", blob.type);

      if (blob.size === 0) {
        throw new Error("Downloaded file is empty");
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";

      // Add to DOM, click, and cleanup
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      console.log("✅ Download initiated successfully");
      return true;
    } catch (err) {
      console.error("❌ Download error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred during download";
      setError(errorMessage);
      return false;
    }
  };

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    downloadInvoice,
  };
};

export const useInvoiceDetails = (invoiceId: string | null) => {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoiceDetails = async () => {
    if (!invoiceId) return;

    try {
      setLoading(true);
      setError(null);

      const data: InvoiceResponse = await getWithAuth<InvoiceResponse>(
        `/invoices/${invoiceId}`
      );

      if (data.code === 0 && data.result) {
        setInvoiceDetails(data.result as InvoiceDetails);
      } else {
        throw new Error(data.message || "Failed to fetch invoice details");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);

  return {
    invoiceDetails,
    loading,
    error,
    fetchInvoiceDetails,
  };
};
