import {
  Eye,
  Users,
  ShieldCheck,
  Scale,
  Clock3,
  GraduationCap,
} from "lucide-react";

const values = [
  {
    icon: Eye,
    title: "Transparency",
  },
  {
    icon: Users,
    title: "Client-First",
  },
  {
    icon: ShieldCheck,
    title: "Independence",
  },
  {
    icon: Scale,
    title: "Integrity",
  },
  {
    icon: Clock3,
    title: "Long-Term Thinking",
  },
  {
    icon: GraduationCap,
    title: "Financial Education",
  },
];

export default function ValuesSection() {
  return (
    <section className="py-24 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-playfair text-5xl text-center font-bold mb-16">
          Our Values
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="bg-white rounded-xl p-8 border border-[#E2EBF5]"
              >
                <Icon
                  size={28}
                  className="text-primary mb-5"
                />

                <h3 className="font-semibold text-lg">
                  {value.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}