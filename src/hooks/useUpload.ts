import { useState } from 'react';
import type { UploadedFile, InvoiceData } from '../types';
import { uploadService } from '../services/uploadService';

interface UseUploadReturn {
  uploadedFiles: UploadedFile[];
  isLoading: boolean;
  error: string | null;
  handleFileUpload: (file: File) => Promise<void>;
  handleClearHistory: () => void;
  handleRetry: (file: UploadedFile) => Promise<void>;
  clearError: () => void;
}

export function useUpload(webhookUrl: string): UseUploadReturn {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadService.uploadFile(file, webhookUrl);

      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        status: 'success',
        n8nResponse: result as InvoiceData,
        originalFile: file,
      };

      setUploadedFiles((prev) => [newFile, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);

      const failedFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        status: 'error',
        error: errorMessage,
        originalFile: file,
      };

      setUploadedFiles((prev) => [failedFile, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setUploadedFiles([]);
  };

  const handleRetry = async (file: UploadedFile) => {
    if (!file.originalFile) return;
    await handleFileUpload(file.originalFile);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    uploadedFiles,
    isLoading,
    error,
    handleFileUpload,
    handleClearHistory,
    handleRetry,
    clearError,
  };
}
