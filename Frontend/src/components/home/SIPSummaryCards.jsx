import { TrendingUp, Wallet, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function fmt(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function SIPSummaryCards({ invested, returns, total }) {
  const cards = [
    { label: "Invested Amount", value: fmt(invested), icon: Wallet, color: "text-primary", bg: "bg-primary/8" },
    { label: "Estimated Returns", value: fmt(returns), icon: TrendingUp, color: "text-success", bg: "bg-success/8" },
    { label: "Total Value", value: fmt(total), icon: DollarSign, color: "text-secondary", bg: "bg-secondary/8", highlight: true },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`rounded-card p-4 text-center border relative overflow-hidden ${
              card.highlight
                ? "border-secondary/30 bg-secondary/5 shadow-md"
                : "border-[#E2EBF5] bg-white"
            }`}
          >
            <div className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Icon size={15} className={card.color} />
            </div>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={card.value}
                className={`font-mono-num font-bold text-base ${card.color}`}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                {card.value}
              </motion.p>
            </AnimatePresence>
            <p className="text-textmuted text-[11px] mt-0.5 leading-tight">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
