import { useState, useRef } from 'react';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'text/csv',
];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export default function FileUpload({ onUpload, isLoading = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not supported. Allowed: PDF, JPEG, PNG, GIF, WebP, CSV`,
      };
    }

    if (file.size > MAX_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds 50MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    return { isValid: true };
  };

  const handleFile = async (file: File) => {
    setValidationError(null);

    const validation = validateFile(file);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Validation failed');
      return;
    }

    try {
      await onUpload(file);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`group relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10 scale-105 shadow-lg shadow-cyan-500/20'
            : 'border-slate-600 bg-slate-800/30 hover:border-cyan-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-slate-700/30'
        } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          disabled={isLoading}
          className="hidden"
          accept={ALLOWED_TYPES.join(',')}
          aria-label="Upload file input"
        />

        <div className="space-y-4">
          <div className={`text-6xl transition-transform duration-200 ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}>
            📁
          </div>
          <div className="space-y-2">
            <p className="text-xl font-bold text-white">
              {isLoading ? 'Uploading...' : isDragging ? 'Drop files here' : 'Drop files or click to browse'}
            </p>
            <p className="text-sm text-slate-400">
              PDF, JPEG, PNG, GIF, WebP, CSV • Max 50MB
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-cyan-300">Processing...</span>
            </div>
          </div>
        )}
      </div>

      {validationError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">⚠️</span>
            <p className="text-red-300 text-sm font-medium">{validationError}</p>
          </div>
        </div>
      )}
    </div>
  );
}
