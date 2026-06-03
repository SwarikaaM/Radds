import { TrendingUp, GraduationCap, HeartHandshake, Target } from "lucide-react";
import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";

const perks = [
  {
    title: "Growth",
    icon: TrendingUp,
    text: "Accelerate your professional journey with meaningful responsibilities."
  },
  {
    title: "Learning",
    icon: GraduationCap,
    text: "Continuous mentoring, training, and industry exposure."
  },
  {
    title: "Work-Life Balance",
    icon: HeartHandshake,
    text: "We value sustainable performance and personal wellbeing."
  },
  {
    title: "Impact",
    icon: Target,
    text: "Help individuals and families make better financial decisions."
  }
];

export default function CultureSection() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="Culture"
          title="A Team Built on Trust, Learning & Excellence"
          subtitle="We combine financial expertise with a people-first culture."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {perks.map((perk) => {
            const Icon = perk.icon;

            return (
              <Card key={perk.title} hover glow>
                <Icon className="text-secondary mb-4" size={32} />
                <h3 className="font-semibold text-xl mb-3">
                  {perk.title}
                </h3>
                <p className="text-textmuted">
                  {perk.text}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}