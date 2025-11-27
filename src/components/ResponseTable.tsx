import type { UploadedFile, InvoiceData } from '../types';

interface ResponseTableProps {
  files: UploadedFile[];
}

export default function ResponseTable({ files }: ResponseTableProps) {
  const successFiles = files.filter((f) => f.status === 'success');

  if (successFiles.length === 0) {
    return null;
  }

  const isInvoiceData = (data: unknown): data is InvoiceData => {
    return (
      data !== null &&
      typeof data === 'object' &&
      ('invoice_id' in data || 'vendor_name' in data || 'customer_name' in data)
    );
  };

  const invoiceFiles = successFiles.filter((f) => isInvoiceData(f.n8nResponse));

  if (invoiceFiles.length > 0) {
    return (
      <div className="w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Invoice Data</h2>
          <p className="text-base text-slate-400 mt-2">Extracted invoice information from uploaded documents.</p>
        </div>

        {/* Horizontal Table Layout */}
        <div className="w-full overflow-x-auto rounded-2xl border border-slate-700/60 bg-slate-800/40 shadow-xl">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-800/80 border-b border-slate-700/50 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-cyan-300 whitespace-nowrap">Invoice ID</th>
                <th className="px-6 py-4 text-left font-bold text-cyan-300 whitespace-nowrap">Vendor</th>
                <th className="px-6 py-4 text-left font-bold text-cyan-300 whitespace-nowrap">Customer</th>
                <th className="px-6 py-4 text-left font-bold text-cyan-300 whitespace-nowrap">Invoice Date</th>
                <th className="px-6 py-4 text-left font-bold text-cyan-300 whitespace-nowrap">Due Date</th>
                <th className="px-6 py-4 text-right font-bold text-cyan-300 whitespace-nowrap">Subtotal</th>
                <th className="px-6 py-4 text-right font-bold text-cyan-300 whitespace-nowrap">Tax</th>
                <th className="px-6 py-4 text-right font-bold text-cyan-300 whitespace-nowrap">Total</th>
                <th className="px-6 py-4 text-center font-bold text-cyan-300 whitespace-nowrap">Currency</th>
                <th className="px-6 py-4 text-left font-bold text-cyan-300 whitespace-nowrap">File</th>
                <th className="px-6 py-4 text-left font-bold text-cyan-300 whitespace-nowrap">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {invoiceFiles.map((file) => {
                const data = file.n8nResponse as InvoiceData;
                return (
                  <tr key={file.id} className="hover:bg-slate-700/30 transition-colors duration-150 border-b border-slate-700/20">
                    <td className="px-6 py-4">
                      <span className="text-base font-bold text-white">{data.invoice_id || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-200">{data.vendor_name || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-200">{data.customer_name || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{data.invoice_date || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{data.due_date || '—'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <code className="text-sm bg-slate-900/50 px-2.5 py-1 rounded border border-slate-700/50 text-slate-200">
                        {data.subtotal || '—'}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <code className="text-sm bg-slate-900/50 px-2.5 py-1 rounded border border-slate-700/50 text-slate-200">
                        {data.tax_total || '—'}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {data.total || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-base font-semibold text-cyan-400">{data.currency || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400 truncate max-w-xs" title={file.name}>
                        📄 {file.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-center p-6 bg-slate-800/20 rounded-2xl border border-slate-700/50">
          <p className="text-sm text-slate-300 font-medium">
            ✓ {invoiceFiles.length} invoice{invoiceFiles.length !== 1 ? 's' : ''} extracted successfully
          </p>
        </div>
      </div>
    );
  }

  // Fallback for non-invoice data
  const getResponseValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return '—';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const flattenResponse = (obj: unknown): Record<string, string> => {
    if (!obj || typeof obj !== 'object') {
      return {};
    }

    const flattened: Record<string, string> = {};
    const entries = Array.isArray(obj) ? Object.entries(obj) : Object.entries(obj as Record<string, unknown>);

    entries.forEach(([key, value]) => {
      flattened[key] = getResponseValue(value);
    });

    return flattened;
  };

  const allKeys = new Set<string>();
  successFiles.forEach((file) => {
    if (file.n8nResponse) {
      Object.keys(flattenResponse(file.n8nResponse)).forEach((key) => allKeys.add(key));
    }
  });

  const responseKeys = Array.from(allKeys);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Response Data</h2>
        <p className="text-sm text-slate-400">Displays webhook responses from n8n for successful uploads.</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/60">
        <div className="overflow-x-auto rounded-3xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/60 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">File</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Upload Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Status</th>
                {responseKeys.map((key) => (
                  <th key={key} className="px-6 py-4 text-left text-sm font-semibold text-cyan-300 whitespace-nowrap">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {successFiles.map((file) => {
                const responseFlat = flattenResponse(file.n8nResponse);
                return (
                  <tr key={file.id} className="hover:bg-slate-700/20 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📄</span>
                        <span className="font-medium text-white truncate block" title={file.name}>
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
                        ✓ Success
                      </span>
                    </td>
                    {responseKeys.map((key) => (
                      <td key={`${file.id}-${key}`} className="px-6 py-4">
                        <code className="text-xs bg-slate-900/50 px-2.5 py-1.5 rounded border border-slate-700/50 text-cyan-300 block max-w-xs overflow-x-auto">
                          {responseFlat[key] || '—'}
                        </code>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
        <p className="text-sm text-slate-400">
          {successFiles.length} successful upload{successFiles.length !== 1 ? 's' : ''} with response{successFiles.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
