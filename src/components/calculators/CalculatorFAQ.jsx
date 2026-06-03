import SectionHeader from "../ui/SectionHeader";
import FAQAccordion from "../ui/FAQAccordion";
import Button from "../ui/Button";

const faqs = [
  {
    question: "Are these calculator results guaranteed?",
    answer:
      "No. Calculator outputs are illustrative estimates based on the assumptions you provide. Actual investment returns may differ due to market conditions and other factors.",
  },
  {
    question: "What return rate should I assume?",
    answer:
      "The return rate should reflect your investment type, risk tolerance, and investment horizon. Conservative assumptions generally lead to better planning decisions.",
  },
  {
    question: "Can I download calculator results?",
    answer:
      "Currently the calculators are designed for planning and comparison. Download functionality may be added in future updates.",
  },
  {
    question: "Why should I consult an advisor after calculating?",
    answer:
      "A calculator provides estimates. An advisor can help evaluate suitability, risk, tax implications, asset allocation, and goal alignment.",
  },
  {
    question: "Are the calculators free?",
    answer:
      "Yes. All calculators on Radds Capital are available free of charge for educational and planning purposes.",
  },
];

export default function CalculatorFAQ() {
  return (
    <>
      <section className="py-24 bg-[#F4F8FC]">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            subtitle="Understand how to use the calculators effectively."
          />

          <div className="mt-12">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0D1B2E]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-5">
            Need help interpreting the numbers?
          </h2>

          <p className="text-white/70 text-lg mb-8">
            Talk to a Radds Capital advisor and turn projections into an actionable financial plan.
          </p>

          <Button href="/contact#book" size="lg">
            Book a Free Consultation
          </Button>
        </div>
      </section>
    </>
  );
}