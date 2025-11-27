import FileUpload from '../components/FileUpload';
import UploadHistory from '../components/UploadHistory';
import ResponseTable from '../components/ResponseTable';
import { useUpload } from '../hooks/useUpload';

export default function DocumentUploadPage() {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL ;
  const { uploadedFiles, isLoading, error, handleFileUpload, handleClearHistory, handleRetry, clearError } =
    useUpload(webhookUrl);

  const totalUploads = uploadedFiles.length;
  const successUploads = uploadedFiles.filter((file) => file.status === 'success').length;
  const errorUploads = uploadedFiles.filter((file) => file.status === 'error').length;

  const stats = [
    { label: 'Total uploads', value: totalUploads },
    { label: 'Completed', value: successUploads },
    { label: 'Need review', value: errorUploads },
  ];

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Header Section */}
      <div className="relative isolate overflow-hidden w-full">
        <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-slate-950 to-slate-950" aria-hidden />
        <div className="relative w-full px-6 pb-24 pt-16">
          <div className="mx-auto max-w-7xl rounded-3xl border border-slate-800/60 bg-slate-900/80 p-10 shadow-2xl shadow-black/60 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">Upload Center</p>
            <div className="mt-3 space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold">Document Upload</h1>
              <p className="text-lg text-slate-400 max-w-3xl">
                Upload PDF, image, or CSV files and let n8n automate the downstream workflow. The experience is
                optimized for clarity and trust.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center shadow-inner shadow-slate-900/30"
                >
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col items-center px-6 pb-16">
        <div className="w-full max-w-7xl space-y-10">
          {/* Upload Section */}
          <section className="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-8 shadow-lg shadow-black/40">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Upload files</h2>
                <p className="text-sm text-slate-400">Drag and drop any supported file or click to browse.</p>
              </div>
              <span className="text-xs uppercase tracking-widest text-slate-500">MAX 50MB per upload</span>
            </div>
            <div className="mt-6">
              <FileUpload onUpload={handleFileUpload} isLoading={isLoading} />
            </div>
            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <span className="text-2xl leading-none">⚠️</span>
                <div className="flex-1">
                  <p className="font-semibold text-red-100">Upload error</p>
                  <p>{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-100 hover:bg-red-500/30"
                >
                  Dismiss
                </button>
              </div>
            )}
          </section>

          {uploadedFiles.length > 0 ? (
            <section className="w-full space-y-8">
              {/* Upload History */}
              <div className="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-8 shadow-lg shadow-black/40">
                <UploadHistory files={uploadedFiles} onClearHistory={handleClearHistory} onRetry={handleRetry} />
              </div>
              
              {/* Invoice/Response Data */}
              <div className="w-full rounded-3xl border border-slate-800/60 bg-slate-900/70 p-8 shadow-lg shadow-black/40">
                <ResponseTable files={uploadedFiles} />
              </div>
            </section>
          ) : (
            <section className="rounded-3xl border border-slate-800/60 bg-slate-900/60 p-10 text-center shadow-md shadow-black/20">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-800/70 text-4xl">📁</div>
              <p className="text-xl font-semibold text-slate-200">No files uploaded yet</p>
              <p className="text-sm text-slate-500 mt-1">Drop a document above or click the upload area to begin.</p>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900/40 bg-slate-950/50 py-8 px-6">
        <div className="mx-auto max-w-7xl text-center text-xs uppercase tracking-[0.4em] text-slate-500">
          Document Upload Service © 2025
        </div>
      </footer>
    </div>
  );
}
