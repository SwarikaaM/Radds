import {
  CheckCircle,
  TrendingUp,
  Shield,
  Target,
} from "lucide-react";

import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";

const icons = [
  CheckCircle,
  TrendingUp,
  Shield,
  Target,
];

export default function ServiceBenefits({ service }) {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="Key Benefits" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {service.benefits.map((benefit, index) => {
            const Icon = icons[index % icons.length];

            return (
              <Card key={benefit.title}>
                <Icon className="text-primary mb-4" />

                <h3 className="font-semibold mb-2">
                  {benefit.title}
                </h3>

                <p className="text-textmuted">
                  {benefit.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}