import SectionHeader from "../ui/SectionHeader";

export default function ServiceExplanation({ service }) {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          title={`What is ${service.name}?`}
        />

        <p className="text-lg text-textmuted leading-relaxed">
          {service.description}
        </p>
      </div>
    </section>
  );
}