import { useState } from 'react';

function NumericInput({ value, onChange }) {
  const [raw, setRaw] = useState(value === 0 ? '' : String(value));

  function handleChange(e) {
    const v = e.target.value;
    // Allow empty string or valid non-negative number
    if (v === '' || /^\d*\.?\d*$/.test(v)) {
      setRaw(v);
      onChange(v === '' ? 0 : Number(v));
    }
  }

  function handleBlur() {
    // On blur, normalise: empty → '0' display but keep internal 0
    if (raw === '') setRaw('');
  }

  function handleFocus() {
    // Clear the zero when user focuses so they can type directly
    if (raw === '0' || raw === '') setRaw('');
  }

  return (
    <div className="relative flex items-center border border-[#D1DDE8] rounded-lg bg-white transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(34,86,143,0.08)] hover:border-[#A8BCCF]">
      <span className="pl-3 text-[#6B7E99] text-sm font-mono-num select-none">₹</span>
      <input
        type="text"
        inputMode="numeric"
        value={raw}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="0"
        className="w-full bg-transparent outline-none p-3 pl-1.5 text-sm font-mono-num font-semibold text-[#0D1B2E]"
      />
    </div>
  );
}

export default function ExpenseBreakdownSection({ title, fields, values, onChange }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="bg-white rounded-xl border mt-8 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F8FAFC] transition-colors"
      >
        <h2 className="font-semibold text-xl">{title}</h2>
        <span className="text-[#6B7E99] text-sm">{open ? '▲ Hide' : '▼ Show'}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 grid md:grid-cols-2 gap-5">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">{label}</label>
              <NumericInput value={values[key] || 0} onChange={(v) => onChange(key, v)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}