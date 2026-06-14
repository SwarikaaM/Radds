import { Link } from "react-router-dom";
import { ArrowUpRight, HelpCircle } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import FAQAccordion from "../ui/FAQAccordion";
import ScrollReveal from "../ui/ScrollReveal";

const faqs = [
  {
    question: "Is Radds Capital SEBI registered?",
    answer:
      "Radds Capital is registered with AMFI as a Mutual Fund Distributor (ARN-334716 | ARN-292158 | ARN- 124053). We are not a SEBI Registered Investment Adviser (RIA). As an MFD, we help clients invest in mutual funds and provide incidental guidance on scheme selection based on your risk profile and goals.",
  },
  {
    question: "Do you charge commissions on the products you recommend?",
    answer:
      "As an AMFI-Registered Mutual Fund Distributor, we earn trail commission from the AMCs on the investments placed through us, as per SEBI regulations. We do not charge advisory fees separately. Our ARN is disclosed on all transactions. We are obligated to recommend only schemes suitable to your risk profile.",
  },
  {
    question: "Can I start investing with a small SIP amount?",
    answer:
      "Absolutely. You can start a SIP with as little as ₹500 per month in most mutual funds. We believe consistency matters more than size at the beginning. Our advisors will help you identify the right funds for your risk profile and gradually scale your investments as your income grows.",
  },
  {
    question: "Do you help with insurance and tax planning as well?",
    answer:
      "Yes — alongside mutual fund distribution, we can assist with life and health insurance distribution through empanelled insurers. For tax planning, we can guide you on tax-saving investment options like ELSS, NPS, and PPF available within the mutual fund and investment distribution framework. For comprehensive financial planning, we recommend consulting a SEBI Registered Investment Adviser.",
  },
  {
    question: "How do I book a consultation with Radds Capital?",
    answer:
      "Click 'Book Consultation', fill in your preferred time slot, and one of our team will connect with you. The initial discussion covers your investment goals, risk profile, and how mutual fund distribution through Radds Capital can serve your needs. No commitment required.",
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
