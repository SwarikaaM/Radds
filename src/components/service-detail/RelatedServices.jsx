import { serviceDetails } from "../../data/serviceDetails";
import Card from "../ui/Card";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";

export default function RelatedServices({ service }) {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="Related Services" />

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {service.related.map((slug) => {
            const item = serviceDetails[slug];

            return (
              <Card key={slug}>
                <h3 className="font-semibold mb-3">
                  {item.name}
                </h3>

                <p className="text-textmuted mb-5">
                  {item.tagline}
                </p>

                <Button
                  href={`/services/${slug}`}
                  variant="outline"
                >
                  Explore
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}