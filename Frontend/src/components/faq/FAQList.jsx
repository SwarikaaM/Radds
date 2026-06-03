import FAQAccordion from "../ui/FAQAccordion";
import { faqs } from "../../data/faq";

export default function FAQList({ activeCategory }) {
  const filtered =
    activeCategory === "All"
      ? faqs
      : faqs.filter(
          (faq) => faq.category === activeCategory
        );

  return (
    <div className="max-w-4xl mx-auto">
      <FAQAccordion items={filtered} />
    </div>
  );
}