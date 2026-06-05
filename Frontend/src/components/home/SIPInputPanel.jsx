import { motion } from "framer-motion";

function SliderInput({ label, value, min, max, step, onChange, prefix, suffix, formatDisplay }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-textmuted text-sm font-medium">{label}</label>
        <div className="flex items-center gap-1 bg-lightbg border border-[#E2EBF5] rounded-input px-3 py-1.5">
          {prefix && <span className="text-textmuted text-sm">{prefix}</span>}
          <span className="font-mono-num font-semibold text-sm text-textprimary min-w-[60px] text-center">
            {formatDisplay ? formatDisplay(value) : value.toLocaleString("en-IN")}
          </span>
          {suffix && <span className="text-textmuted text-sm">{suffix}</span>}
        </div>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="w-full h-1.5 bg-[#E2EBF5] rounded-full relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-5"
          style={{ zIndex: 2 }}
        />
        <motion.div
          className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md pointer-events-none"
          animate={{ left: `calc(${pct}% - 8px)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-textmuted font-mono-num">
        <span>{prefix}{min.toLocaleString("en-IN")}{suffix}</span>
        <span>{prefix}{max.toLocaleString("en-IN")}{suffix}</span>
      </div>
    </div>
  );
}

export default function SIPInputPanel({ monthly, setMonthly, rate, setRate, years, setYears }) {
  return (
    <div className="space-y-7">
      <SliderInput
        label="Monthly Investment"
        value={monthly}
        min={500}
        max={100000}
        step={500}
        onChange={setMonthly}
        prefix="₹"
      />
      <SliderInput
        label="Expected Annual Return"
        value={rate}
        min={4}
        max={30}
        step={0.5}
        onChange={setRate}
        suffix="% p.a."
        formatDisplay={(v) => v.toFixed(1)}
      />
      <SliderInput
        label="Investment Duration"
        value={years}
        min={1}
        max={40}
        step={1}
        onChange={setYears}
        suffix=" Yrs"
        formatDisplay={(v) => v}
      />
    </div>
  );
}
