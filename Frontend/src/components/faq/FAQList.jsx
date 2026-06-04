import { motion, AnimatePresence } from "framer-motion";
import FAQAccordion from "../ui/FAQAccordion";
import { faqs } from "../../data/faq";

export default function FAQList({ activeCategory }) {
  const filtered =
    activeCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <FAQAccordion items={filtered} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}