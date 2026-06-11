import { useState } from 'react';
import { FileDown, TableProperties, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/useProfile';

export default function CalculatorExportBar({ calculatorType, inputs, results }) {
  const { user, apiFetch } = useAuth();
  const { hasProfile, sessionExpired } = useProfile();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [xlsxLoading, setXlsxLoading] = useState(false);
  const [error, setError] = useState('');

  // Not logged in — show locked state
  if (!user) {
    return (
      <div className="rounded-xl border border-[#D7E7F7] bg-white p-5">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h3 className="font-semibold text-textprimary">Export Calculator Report</h3>
            <p className="text-sm text-textmuted mt-0.5">
              <span className="text-[#22568F] font-medium cursor-pointer hover:underline"
                onClick={() => window.location.href = '/login'}>
                Sign in
              </span> to export your report as PDF or Excel.
            </p>
          </div>
          <div className="flex gap-3 opacity-40 cursor-not-allowed">
            <ExportBtn icon={<FileDown size={14} />} label="Export PDF" disabled />
            <ExportBtn icon={<TableProperties size={14} />} label="Export Excel" disabled />
          </div>
        </div>
      </div>
    );
  }

  async function handleExport(type) {
    if (sessionExpired) { setError('Session expired. Please sign in again.'); return; }
    setError('');
    const setLoading = type === 'pdf' ? setPdfLoading : setXlsxLoading;
    setLoading(true);

    try {
      const body = {
        calculator_type: calculatorType,
        inputs: inputs,
      };

      const res = await apiFetch(`/api/exports/${type}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Export failed');
      }

      // Download the file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `radds_report_${Date.now()}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[#D7E7F7] bg-white p-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h3 className="font-semibold text-textprimary">Export Calculator Report</h3>
          <p className="text-sm text-textmuted mt-0.5">
            Download your profile, inputs and results.
          </p>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={pdfLoading}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-[#22568F] bg-white text-[#22568F] text-sm font-medium hover:bg-[#22568F] hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            {pdfLoading ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
            Export PDF
          </button>
          <button
            onClick={() => handleExport('xlsx')}
            disabled={xlsxLoading}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-[#22568F] bg-white text-[#22568F] text-sm font-medium hover:bg-[#22568F] hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            {xlsxLoading ? <Loader2 size={14} className="animate-spin" /> : <TableProperties size={14} />}
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}

function ExportBtn({ icon, label, disabled }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D7E7F7] bg-[#F8FAFC] text-textmuted text-sm ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      {icon}{label}
    </div>
  );
}