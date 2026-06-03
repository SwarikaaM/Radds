import FAQAccordion from "../ui/FAQAccordion";
import SectionHeader from "../ui/SectionHeader";

export default function ServiceFAQ({ service }) {
  return (
    <section className="py-24 bg-[#F4F8FC]">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader title="Frequently Asked Questions" />

        <div className="mt-12">
          <FAQAccordion items={service.faqs} />
        </div>
      </div>
    </section>
  );
}