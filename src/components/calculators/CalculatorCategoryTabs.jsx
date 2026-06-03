import { motion } from "framer-motion";
import { calculatorCategories } from "../../data/calculators";

export default function CalculatorCategoryTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {calculatorCategories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`relative px-4 py-2 text-sm font-medium rounded-btn transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              isActive
                ? "text-white"
                : "text-textmuted hover:text-textprimary hover:bg-[#EEF3FA]"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 bg-primary rounded-btn"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        );
      })}
    </div>
  );
}