import { motion, AnimatePresence } from "framer-motion";
import { formatINR } from "../../utils/format";

const colorMap = {
  primary: {
    text: "text-primary",
    bg: "bg-primary/8",
    border: "border-primary/15",
  },
  success: {
    text: "text-success",
    bg: "bg-success/8",
    border: "border-success/15",
  },
  gradient: {
    text: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary",
    bg: "bg-gradient-to-br from-primary/8 to-secondary/5",
    border: "border-secondary/20",
  },
  warning: {
    text: "text-warning",
    bg: "bg-warning/8",
    border: "border-warning/15",
  },
};

function SummaryCard({ label, value, color, index }) {
  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      className={`rounded-card p-5 border ${c.bg} ${c.border} text-center`}
      layout
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={value}
          // Added 'overflow-x-auto', 'whitespace-nowrap', and custom scrollbar removal for mobile look
          className={`font-mono-num font-bold pl-1 text-xl md:text-2xl mb-1.5 overflow-x-auto whitespace-nowrap scrollbar-none ${c.text}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {formatINR(value)}
        </motion.p>
      </AnimatePresence>
      <p className="text-textmuted text-xs font-medium">{label}</p>
    </motion.div>

  );
}

export default function CalculatorSummary({ summaryKeys, results }) {
  if (!results) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {summaryKeys.map((sk, i) => (
        <SummaryCard
          key={sk.key}
          label={sk.label}
          value={results[sk.key]}
          color={sk.color}
          index={i}
        />
      ))}
    </div>
  );
}