import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

function FAQItem({ question, answer, isOpen, onToggle, dark }) {
  return (
    <div className={`border-b ${dark ? "border-white/10" : "border-[#E2EBF5]"} last:border-0`}>
      <button
        className={`w-full flex items-center justify-between py-5 text-left gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded transition-colors ${
          dark ? "text-white hover:text-accent" : "text-textprimary hover:text-primary"
        }`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-[15px] leading-snug">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 ${dark ? "text-white/50" : "text-textmuted"}`}
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className={`pb-5 text-sm leading-relaxed ${dark ? "text-white/65" : "text-textmuted"}`}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQAccordion({ items, dark = false, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState(new Set([0]));

  const toggle = (idx) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        if (!allowMultiple) next.clear();
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <div className="divide-y-0">
      {items.map((item, idx) => (
        <FAQItem
          key={idx}
          question={item.question}
          answer={item.answer}
          isOpen={openItems.has(idx)}
          onToggle={() => toggle(idx)}
          dark={dark}
        />
      ))}
    </div>
  );
}
