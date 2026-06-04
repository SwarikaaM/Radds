import { useCallback } from "react";

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function InputRow({ input, value, onChange }) {
  const { key, label, prefix, suffix, min, max, step, helper, decimals } = input;

  const handleSlider = (e) => onChange(key, Number(e.target.value));

  const handleNumber = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    const parsed = decimals ? parseFloat(raw) : parseInt(raw, 10);
    if (!isNaN(parsed)) onChange(key, clamp(parsed, min, max));
  };

  const handleBlur = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    const parsed = decimals ? parseFloat(raw) : parseInt(raw, 10);
    onChange(key, isNaN(parsed) ? min : clamp(parsed, min, max));
  };

  const pct = ((value - min) / (max - min)) * 100;

  const displayVal = decimals
    ? Number(value).toFixed(decimals)
    : Number(value).toLocaleString("en-IN");

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <label className="text-textmuted text-sm font-medium flex-1">{label}</label>
        {/* Number input box */}
        <div className="flex items-center gap-1 bg-white border border-[#D1DDE8] focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(34,86,143,0.08)] rounded-input px-3 py-2 transition-all duration-200 min-w-[120px]">
          {prefix && <span className="text-textmuted text-sm font-mono-num">{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            className="w-full text-sm font-mono-num font-semibold text-textprimary bg-transparent outline-none text-center"
            value={displayVal}
            onChange={handleNumber}
            onBlur={handleBlur}
          />
          {suffix && <span className="text-textmuted text-xs font-mono-num whitespace-nowrap">{suffix}</span>}
        </div>
      </div>

      {/* Slider */}
      <div className="relative h-6 flex items-center">
        <div className="w-full h-1.5 bg-[#E2EBF5] rounded-full relative">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-100 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSlider}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-6"
          style={{ zIndex: 2 }}
        />
        <div
          className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md pointer-events-none transition-all duration-100 ease-out"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-textmuted font-mono-num">
        <span>{prefix}{min.toLocaleString("en-IN")}{suffix?.trim()}</span>
        <span>{prefix}{max.toLocaleString("en-IN")}{suffix?.trim()}</span>
      </div>

      {helper && (
        <p className="text-[11px] text-textmuted/70 italic">{helper}</p>
      )}
    </div>
  );
}

export default function CalculatorInputPanel({ inputs, values, onChange }) {
  const handleChange = useCallback((key, val) => {
    onChange({ ...values, [key]: val });
  }, [values, onChange]);

  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-textprimary font-semibold text-base mb-0.5">Configure Inputs</h3>
        <p className="text-textmuted text-xs">All results update instantly as you adjust</p>
      </div>
      {inputs.map((input) => (
        <InputRow
          key={input.key}
          input={input}
          value={values[input.key]}
          onChange={handleChange}
        />
      ))}
    </div>
  );
}
