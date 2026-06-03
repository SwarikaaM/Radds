import { Link } from "react-router-dom";
import { ArrowUpRight, HelpCircle } from "lucide-react";
import FAQAccordion from "../ui/FAQAccordion";
import ScrollReveal from "../ui/ScrollReveal";

export default function CalculatorDetailFAQ({ faqs, calculatorTitle }) {
  if (!faqs?.length) return null;

  return (
    <section className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={16} className="text-secondary" />
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">
              FAQ
            </span>
          </div>
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-textprimary mb-8">
            Common Questions About {calculatorTitle}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-white rounded-card border border-[#E2EBF5] shadow-sm px-6 py-2 mb-8">
            <FAQAccordion items={faqs} />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Link
            to="/faq"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
          >
            View all FAQs <ArrowUpRight size={14} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
