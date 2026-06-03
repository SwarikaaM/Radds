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
      key={value}
      className={`rounded-card p-5 border ${c.bg} ${c.border} text-center`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <p className={`font-mono-num font-bold text-xl md:text-2xl mb-1.5 ${c.text}`}>
        {formatINR(value)}
      </p>
      <p className="text-textmuted text-xs font-medium">{label}</p>
    </motion.div>
  );
}

export default function CalculatorSummary({ summaryKeys, results }) {
  if (!results) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <AnimatePresence mode="wait">
        {summaryKeys.map((sk, i) => (
          <SummaryCard
            key={sk.key}
            label={sk.label}
            value={results[sk.key]}
            color={sk.color}
            index={i}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
