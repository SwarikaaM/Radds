import SectionHeader from "../ui/SectionHeader";

export default function ServiceRisks({ service }) {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          title="Risks & Considerations"
          subtitle="Transparent guidance helps better decisions."
        />

        <ul className="space-y-4 mt-12">
          {service.risks.map((risk) => (
            <li
              key={risk}
              className="border rounded-xl p-5"
            >
              {risk}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}