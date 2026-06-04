import { motion } from "framer-motion";
import { faqCategories } from "../../data/faq";

export default function FAQCategoryTabs({ activeCategory, setActiveCategory }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {faqCategories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "text-white"
                : "bg-white border border-[#E2EBF5] text-textmuted hover:text-primary hover:border-primary/40"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="faq-tab-pill"
                className="absolute inset-0 bg-primary rounded-lg"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {category}
          </button>
        );
      })}
    </div>
  );
}