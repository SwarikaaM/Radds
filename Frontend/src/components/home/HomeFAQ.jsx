import { Link } from "react-router-dom";
import { ArrowUpRight, HelpCircle } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import FAQAccordion from "../ui/FAQAccordion";
import ScrollReveal from "../ui/ScrollReveal";

const faqs = [
  {
    question: "Is Radds Capital SEBI registered?",
    answer:
      "Yes. Radds Capital is a SEBI Registered Investment Advisor (RIA) operating under SEBI's Investment Advisers Regulations, 2013. Our registration number is INA000012345. You can verify this on the SEBI website under the list of registered investment advisors.",
  },
  {
    question: "Do you charge commissions on the products you recommend?",
    answer:
      "No. We operate on a fee-only advisory model. We do not earn commissions, trail fees, or any form of distributor income from the products we recommend. Our revenue comes entirely from the advisory fees you pay us — which means our advice is aligned 100% with your interests, not product manufacturers.",
  },
  {
    question: "Can I start investing with a small SIP amount?",
    answer:
      "Absolutely. You can start a SIP with as little as ₹500 per month in most mutual funds. We believe consistency matters more than size at the beginning. Our advisors will help you identify the right funds for your risk profile and gradually scale your investments as your income grows.",
  },
  {
    question: "Do you help with insurance and tax planning as well?",
    answer:
      "Yes — we offer comprehensive financial planning that covers life insurance, health insurance, term plans, tax-saving investments (ELSS, NPS, PPF), and ITR-linked tax optimisation. We believe insurance and tax efficiency are as important as investment returns, and both are built into your financial plan.",
  },
  {
    question: "How do I book a consultation with Radds Capital?",
    answer:
      "Simply click 'Book Consultation' on our website, fill in your preferred time slot, and one of our advisors will call you. The first consultation is completely free, lasts about 45 minutes, and covers your current financial situation, goals, and a broad outline of how we can help. No commitment required.",
  },
];

export default function HomeFAQ() {
  return (
    <section className="bg-lightbg py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-24">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle size={16} className="text-secondary" />
                <span className="text-secondary font-semibold text-sm uppercase tracking-widest">FAQ</span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-textprimary leading-tight mb-4">
                Questions Investors Often Ask
              </h2>
              <p className="text-textmuted text-base leading-relaxed mb-8">
                Transparent answers to the things that matter most before you trust someone with your money.
              </p>
              <Link
                to="/faq"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
              >
                View All FAQs <ArrowUpRight size={15} />
              </Link>
            </ScrollReveal>
          </div>

          {/* Right accordion */}
          <ScrollReveal delay={0.1}>
            <div className="bg-white rounded-card border border-[#E2EBF5] shadow-sm px-6 py-2">
              <FAQAccordion items={faqs} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
