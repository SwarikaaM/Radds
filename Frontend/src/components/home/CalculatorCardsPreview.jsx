import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, ArrowDownCircle, Clock, DollarSign, ArrowUpRight, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import { calculators } from "../../data/calculators";

const iconMap = { TrendingUp, ArrowDownCircle, Clock, DollarSign, ArrowUpRight, Zap };

const palette = [
  { bg: "bg-primary/8", text: "text-primary", border: "rgba(34,86,143,0.22)" },
  { bg: "bg-secondary/8", text: "text-secondary", border: "rgba(35,137,175,0.22)" },
  { bg: "bg-accent/8", text: "text-accent", border: "rgba(57,195,239,0.22)" },
  { bg: "bg-success/8", text: "text-success", border: "rgba(29,185,84,0.22)" },
  { bg: "bg-warning/8", text: "text-warning", border: "rgba(245,166,35,0.22)" },
  { bg: "bg-primary/8", text: "text-primary", border: "rgba(34,86,143,0.22)" },
];

export default function CalculatorCardsPreview() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const SCROLL_BY = 300;

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? SCROLL_BY : -SCROLL_BY, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeader
            eyebrow="Financial Tools"
            title="More Tools to Plan Your Future"
            subtitle="Free, instant calculators for smarter financial decisions."
            align="left"
            className="mb-0 max-w-lg"
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              onClick={() => scroll("left")}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? "border-primary/30 text-primary bg-primary/5 hover:bg-primary hover:text-white hover:border-primary"
                  : "border-[#E2EBF5] text-[#C5D3E0] cursor-not-allowed"
              }`}
              whileTap={canScrollLeft ? { scale: 0.9 } : {}}
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </motion.button>
            <motion.button
              onClick={() => scroll("right")}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? "border-primary/30 text-primary bg-primary/5 hover:bg-primary hover:text-white hover:border-primary"
                  : "border-[#E2EBF5] text-[#C5D3E0] cursor-not-allowed"
              }`}
              whileTap={canScrollRight ? { scale: 0.9 } : {}}
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Scrollable strip */}
      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 ml-12 sm:px-6 lg:px-8 pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {calculators.map((calc, i) => {
          const Icon = iconMap[calc.icon] || TrendingUp;
          const c = palette[i % palette.length];
          return (
            <Link
              key={calc.id}
              to={`/calculators/${calc.slug}`}
              className="flex-shrink-0 w-[260px]"
              style={{ scrollSnapAlign: "start" }}
            >
              <motion.div
                className={`group bg-white rounded-card p-5 border border-[#E2EBF5] shadow-sm h-full flex flex-col`}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 36px rgba(34,86,143,0.10)",
                  borderColor: c.border,
                }}
                transition={{ duration: 0.2 }}
              >
                <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={18} className={c.text} />
                </div>
                <h3 className="text-textprimary font-semibold text-sm mb-1.5 leading-snug">{calc.title}</h3>
                <p className="text-textmuted text-xs leading-relaxed mb-4 flex-1">{calc.description}</p>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${c.text}`}>
                  Calculate
                  <motion.span
                    className="inline-flex"
                    whileHover={{ x: 2, y: -2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ArrowUpRight size={12} />
                  </motion.span>
                </span>
              </motion.div>
            </Link>
          );
        })}
        <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8" />
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/calculators"
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors"
        >
          View All Calculators <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
}