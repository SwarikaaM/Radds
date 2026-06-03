import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, ArrowDownCircle, Clock,
  DollarSign, ArrowUpRight, Zap,
  ChevronRight, Tag, SlidersHorizontal,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const iconMap = {
  TrendingUp,
  ArrowDownCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
  Zap,
};

const palette = [
  {
    bg: "bg-primary/8",
    text: "text-primary",
    border: "group-hover:border-primary/35",
    shadow: "group-hover:shadow-primary/8",
    btn: "bg-primary/10 text-primary hover:bg-primary hover:text-white",
  },
  {
    bg: "bg-secondary/8",
    text: "text-secondary",
    border: "group-hover:border-secondary/35",
    shadow: "group-hover:shadow-secondary/8",
    btn: "bg-secondary/10 text-secondary hover:bg-secondary hover:text-white",
  },
  {
    bg: "bg-accent/8",
    text: "text-accent",
    border: "group-hover:border-accent/35",
    shadow: "group-hover:shadow-accent/10",
    btn: "bg-accent/10 text-accent hover:bg-accent hover:text-dark",
  },
  {
    bg: "bg-success/8",
    text: "text-success",
    border: "group-hover:border-success/35",
    shadow: "group-hover:shadow-success/8",
    btn: "bg-success/10 text-success hover:bg-success hover:text-white",
  },
  {
    bg: "bg-warning/8",
    text: "text-warning",
    border: "group-hover:border-warning/35",
    shadow: "group-hover:shadow-warning/8",
    btn: "bg-warning/10 text-warning hover:bg-warning hover:text-dark",
  },
  {
    bg: "bg-primary/8",
    text: "text-primary",
    border: "group-hover:border-primary/35",
    shadow: "group-hover:shadow-primary/8",
    btn: "bg-primary/10 text-primary hover:bg-primary hover:text-white",
  },
];

function CalculatorCard({ calc, colorIndex }) {
  const Icon = iconMap[calc.icon] || TrendingUp;
  const c = palette[colorIndex % palette.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={calc.route} className="group block h-full">
        <motion.div
          className={`h-full bg-white rounded-card border border-[#E2EBF5] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${c.border} ${c.shadow} flex flex-col`}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {/* Top accent bar */}
          <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-primary to-secondary`} />

          <div className="p-6 flex flex-col flex-1">
            {/* Icon + category */}
            <div className="flex items-start justify-between mb-5">
              <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                <Icon size={22} className={c.text} />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
                {calc.category}
              </span>
            </div>

            {/* Title + description */}
            <h3 className="text-textprimary font-semibold text-base mb-2 leading-snug group-hover:text-primary transition-colors duration-200">
              {calc.title}
            </h3>
            <p className="text-textmuted text-sm leading-relaxed flex-1 mb-4">
              {calc.shortDescription}
            </p>

            {/* Best for */}
            <div className="flex items-start gap-2 mb-3">
              <Tag size={11} className="text-textmuted/60 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-textmuted/80 leading-tight">
                <span className="font-semibold text-textmuted">Best for:</span>{" "}
                {calc.bestFor}
              </p>
            </div>

            {/* Inputs summary */}
            <div className="flex items-start gap-2 mb-5">
              <SlidersHorizontal size={11} className="text-textmuted/60 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-textmuted/70 leading-tight font-mono-num">
                {calc.inputsSummary}
              </p>
            </div>

            {/* CTA button */}
            <div className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-btn text-sm font-semibold transition-all duration-200 ${c.btn}`}>
              Calculate
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function CalculatorGrid({ calculators }) {
  if (!calculators.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <p className="text-textmuted text-base">No calculators in this category yet.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {calculators.map((calc, i) => (
          <CalculatorCard key={calc.id} calc={calc} colorIndex={i} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}