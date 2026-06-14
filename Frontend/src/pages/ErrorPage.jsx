import { useNavigate, useLocation } from 'react-router-dom';

const ERROR_META = {
  404:       { title: 'Page Not Found',        hint: 'The page you are looking for does not exist or may have moved.' },
  403:       { title: 'Access Denied',         hint: 'You do not have permission to view this page.' },
  401:       { title: 'Session Expired',       hint: 'Please log in again to continue.' },
  PDF_ERROR: { title: 'Export Failed',         hint: 'We could not generate your PDF right now.' },
  XLSX_ERROR:{ title: 'Export Failed',         hint: 'We could not generate your Excel file right now.' },
  500:       { title: 'Server Error',          hint: 'Something went wrong on our end.' },
  NETWORK:   { title: 'Connection Problem',    hint: 'We couldn not reach the server. Check your internet connection.' },
};

const DEFAULT_META = {
  title: 'Something Went Wrong',
  hint: 'An unexpected error occurred.',
};

export default function ErrorPage({ code, onRetry, inline = false }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const errorCode  = code || location.state?.code || 404;
  const meta       = ERROR_META[errorCode] || DEFAULT_META;

  if (inline) {
    // Compact version for use inside pages (e.g. export failure toast-replacement)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-4">
        {/* <span className="text-2xl flex-shrink-0">{meta.emoji}</span> */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-red-800 text-sm">{meta.title}</p>
          <p className="text-red-600 text-xs mt-0.5">{meta.hint}</p>
          <p className="text-red-400 text-xs mt-1 font-mono">Error code: {String(errorCode)}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-shrink-0 text-xs font-medium text-red-700 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-100 transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  // Full-page version (used for 404, route-level errors)
  return (
    <main className="min-h-screen bg-[#F4F8FC] flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon circle */}
        {/* <div className="w-20 h-20 rounded-full bg-white border border-[#E2EBF5] flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">
          {meta.emoji}
        </div> */}

        {/* Error code badge */}
        <span className="inline-block bg-[#EAF2FF] text-[#22568F] text-xs font-mono font-semibold px-3 py-1 rounded-full mb-4">
          {String(errorCode)}
        </span>

        <h1 className="font-playfair text-3xl font-bold text-[#0D1B2E] mb-3">
          {meta.title}
        </h1>
        <p className="text-[#6B7E99] text-base mb-8">{meta.hint}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-[#22568F] text-white rounded-xl text-sm font-medium hover:bg-[#1a4070] transition-colors"
            >
              Try again
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-[#D1DDE8] text-[#3D4F66] rounded-xl text-sm font-medium hover:bg-white transition-colors"
          >
            ← Go back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-[#D1DDE8] text-[#3D4F66] rounded-xl text-sm font-medium hover:bg-white transition-colors"
          >
            Home
          </button>
        </div>

        <p className="text-[#9BADC0] text-xs mt-10">
          Radds Capital — AMFI-Registered Mutual Fund Distributor
        </p>
      </div>
    </main>
  );
}
