export type FileType = 'pdf' | 'image' | 'csv' | 'unknown';
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

export interface InvoiceData {
  total?: string;
  currency?: string;
  due_date?: string;
  subtotal?: string;
  tax_total?: string;
  invoice_id?: string;
  vendor_name?: string;
  invoice_date?: string;
  customer_name?: string;
  [key: string]: unknown;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  status: UploadStatus;
  originalFile?: File;
  n8nResponse?: InvoiceData;
  error?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  type: FileType;
  error?: string;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  loaded: number;
  total: number;
}
