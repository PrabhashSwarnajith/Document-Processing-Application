import type { FC } from 'react';
import type { UploadedFile } from '../types';

interface UploadHistoryProps {
  files: UploadedFile[];
  onClearHistory: () => void;
  onRetry: (file: UploadedFile) => Promise<void>;
}

const UploadHistory: FC<UploadHistoryProps> = ({ files, onClearHistory, onRetry }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  const getFileIcon = (type: string): string => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type === 'text/csv') return '📊';
    return '📦';
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/10 border border-red-400/20';
      case 'uploading':
      case 'pending':
        return 'text-yellow-300 bg-yellow-400/10 border border-yellow-400/30';
      default:
        return 'text-slate-300 bg-slate-500/5 border border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Upload History</h2>
          <p className="text-sm text-slate-400 mt-1">{files.length} record(s)</p>
        </div>
        <button
          onClick={onClearHistory}
          className="rounded-full border border-slate-700 bg-slate-900/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover:border-white/40"
        >
          🗑️ Clear All
        </button>
      </div>

      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className={`rounded-3xl border p-5 shadow-2xl shadow-black/60 transition duration-200 ${
              file.status === 'error'
                ? 'border-red-700/40 bg-red-500/5'
                : file.status === 'success'
                  ? 'border-cyan-500/40 bg-cyan-500/5'
                  : 'border-blue-500/20 bg-blue-500/5'
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <span className="text-3xl">{getFileIcon(file.type)}</span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1">📦 {formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">🕛 {formatDate(file.uploadedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${getStatusStyles(file.status)}`}>
                  {file.status === 'success' && '✓ Success'}
                  {file.status === 'error' && '✗ Failed'}
                  {file.status === 'uploading' && '⏳ Uploading'}
                  {file.status === 'pending' && '⏰ Pending'}
                </span>
                {file.status === 'error' && (
                  <button
                    onClick={() => onRetry(file)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/40"
                  >
                    🔄 Retry
                  </button>
                )}
              </div>
            </div>

            {file.error && (
              <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                {file.error}
              </p>
            )}
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <p className="text-center text-slate-400 py-12">No files uploaded yet</p>
      )}
    </div>
  );
};

export default UploadHistory;
