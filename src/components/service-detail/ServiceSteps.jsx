import SectionHeader from "../ui/SectionHeader";

export default function ServiceSteps({ service }) {
  return (
    <section className="py-24 bg-[#F4F8FC]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title="How It Works" />

        <div className="grid md:grid-cols-4 gap-6 mt-12">
          {service.steps.map((step, index) => (
            <div
              key={step}
              className="bg-white rounded-xl p-6 border"
            >
              <div className="font-mono text-primary text-lg mb-4">
                0{index + 1}
              </div>

              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}