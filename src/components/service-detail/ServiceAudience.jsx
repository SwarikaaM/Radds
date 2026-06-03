import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";

export default function ServiceAudience({ service }) {
  return (
    <section className="py-24 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="Who Is This For?" />

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {service.audience.map((person) => (
            <Card key={person.title}>
              <h3 className="font-semibold mb-3">
                {person.title}
              </h3>

              <p className="text-textmuted">
                {person.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}